const uuid = require("uuid")
const tencentcloud = require("tencentcloud-sdk-nodejs");
const sqlconfig = require("../../config/sqlconfig.js");
const auth = require("../../config/admin.js");
const ipaddr = require("ipaddr.js");
const libqqwry = require("lib-qqwry");
var qqwry = libqqwry()

const VpcClient = tencentcloud.vpc.v20170312.Client;

const clientConfig = {
    credential: {
        secretId: sqlconfig.txSecretId,
        secretKey: sqlconfig.txSecretKey,
    },
    region: "na-ashburn",
    profile: {
        httpProfile: {
            endpoint: "vpc.tencentcloudapi.com",
        },
    },
};

const client = new VpcClient(clientConfig);

async function createIpInfo(cookie, ip, db, url) {
    url = getUrlName(url)
    // 调用腾讯云接口获取地址
    // const params = {
    //     "AddressIps": [
    //         ip.substr(ip.lastIndexOf(':') + 1)
    //     ],
    //     "Fields": {
    //         "Country": true,
    //         "Province": true,
    //         "City": true,
    //         "Region": true,
    //         "Isp": true,
    //         "AsName": true,
    //         "AsId": true,
    //         "Comment": true
    //     }
    // };
    // const data = await client.DescribeIpGeolocationInfos(params);

    // db.query(`insert into user(cookie, count, ip, location, history) values('${cookie}', 1, '${ip || ''}' , '${data && data.AddressInfo && JSON.stringify(data.AddressInfo[0]) || ''}', '${url}')`)
    db.query(`insert into user(cookie, count, ip, location, history) values('${cookie}', 1, '${ip || ''}' , '${JSON.stringify(searchIp(ip))}', '${url}')`)
}

function searchIp(ip) {
    const ret = {
        country: "",
        area: ""
    };
    let kind

    try {
        kind = ipaddr.parse(ip).kind();

        if ("ipv4" === kind) {
            const result = qqwry.searchIP(ip);

            for (const key in result) {
                const lowerKey = key.toLowerCase();

                if ("string" === typeof result[key]) {
                    const v = result[key].trim();

                    if ("CZ88.NET" === v) {
                        ret[lowerKey] = "";
                    } else {
                        ret[lowerKey] = v;
                    }
                } else {
                    ret[lowerKey] = result[key];
                }
            }
        }
    } catch (err) {
        console.log(err);
    }

    if (!ret.ip) {
        ret.ip = ip;
    }

    if (!ret.country && !ret.area) {
        if ("ipv6" === kind) {
            ret.country = "未知 IPv6";
        } else if ("ipv4" === kind) {
            ret.country = "未知 IPv4";
        } else {
            ret.country = "未知";
        }
    }

    return ret;
}

function getUrlName(url) {
    console.log(url)
    if (url == '/' || !url) {
        return '主页'
    }
    const str = url.substr(url.lastIndexOf('/') + 1);

    if (str == 'product') {
        return '产品页'
    }

    if (str == 'service') {
        return '服务页'
    }

    if (str == 'contact') {
        return '联系页'
    }

    if (str == 'partener') {
        return '伙伴页'
    }

    if (str == 'send') {
        return '发送邮件'
    }

    if (str == 'sitemap.xml') {
        return '站点地图'
    }

    for (var i = 0; i < global.newsList.length; i++) {
        if (str == global.newsList[i].title) {
            return '访问：' + global.newsList[i].title
        }
    }

    for (var i = 0; i < global.productdata.length; i++) {
        if (str == global.productdata[i].name) {
            return '访问：' + global.productdata[i].name
        }
        for (var j = 0; j < global.productdata[i].list.length; j++) {
            if (global.productdata[i].list[j].list_name == str) {
                return '访问：' + global.productdata[i].list[j].list_name
            }
        }
    }

    return '未识别页面' + str
}


module.exports = function (threadpool, db) {
    return async function (ctx, next) {
        if (ctx.url.match(/login/) || ctx.url.match(/getCaptcha/)) {
            await next()
            return
        }
        if (!ctx.url.match(/houtai/)) {
            var cookie
            if (cookie = ctx.cookies.get('ruige_auth')) {
                const user = (await db.query(`select * from user where cookie = '${cookie}'`))[0];
                if (user) {
                    await next()
                    if (user.history.length < 10000) {
                        user.history = user.history + ',' + getUrlName(ctx.url)
                    }
                    else {
                        var length = ctx.url.length;
                        user.history = user.history.substr(200).substr(user.history.substr(200).indexOf(',') + 1) || '' + ctx.url
                    }
                    db.query(`update user set count = ${user.count + 1}, history = '${user.history}' where user.id = ${user.id}`);
                    return
                }
            }

            cookie = uuid.v4();
            console.log(ctx.headers['x-real-ip']);
            console.log(ctx.ip);
            console.log(ctx.headers['x-forwarded-for']);
            var ip = ctx.headers['x-real-ip'] || ctx.ip
            console.log(searchIp(ip))
            ctx.cookies.set('ruige_auth', cookie);
            createIpInfo(cookie, ip, db, ctx.url)
            await next()
            return
        }
        else {
            if (!ctx.header.auth || ctx.header.auth != auth.auth) {
                ctx.body = JSON.stringify({
                    code: 303,
                    data: ''
                })
            }
            else {
                await next()
            }
        }
    }
}
