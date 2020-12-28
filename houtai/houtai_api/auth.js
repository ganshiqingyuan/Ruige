const uuid = require("uuid")
const tencentcloud = require("tencentcloud-sdk-nodejs");
const sqlconfig = require("../../config/sqlconfig.js")

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
    console.log(ip)
    // 调用腾讯云接口获取地址
    const params = {
        "AddressIps": [
            ip.substr(ip.lastIndexOf(':') + 1)
        ],
        "Fields": {
            "Country": true,
            "Province": true,
            "City": true,
            "Region": true,
            "Isp": true,
            "AsName": true,
            "AsId": true,
            "Comment": true
        }
    };
    const data = await client.DescribeIpGeolocationInfos(params);

    db.query(`insert into user(cookie, count, ip, location, history) values('${cookie}', 1, '${ip || ''}' , '${data && data.AddressInfo && data.AddressInfo[0] || ''}', '${url}')`)
}

function getUrlName(url) {
    if (url == '/') {
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

    for (var i = 0; i < global.newsList.length; i++) {
        if (str == global.newsList[i].id) {
            return '访问：' + global.newsList[i].title
        }
    }

    for (var i = 0; i < global.productdata.length; i++) {
        if (str == global.productdata[i].id) {
            return '访问：' + global.productdata[i].name
        }
        for (var j = 0; j < global.productdata[i].list.length; j++) {
            if (global.productdata[i].list[j].id == str) {
                return '访问：' + global.productdata[i].list[j].list_name
            }
        }
    }

    return '未识别页面'
}


module.exports = function (threadpool, db) {
    return async function (ctx, next) {
        if (ctx.url.match(/login/) || ctx.url.match(/getCaptcha/)) {
            await next()
            return
        }
        if (!ctx.url.match(/houtai/)) {
            var cookie
            if (cookie = ctx.cookies.get('auth')) {
                const user = (await db.query(`select * from user where cookie = '${cookie}'`))[0];
                if (user) {
                    if (user.history.length < 10000) {
                        user.history = user.history + ',' + getUrlName(ctx.url)
                    }
                    else {
                        var length = ctx.url.length;
                        user.history = user.history.substr(200).substr(user.history.substr(200).indexOf(',') + 1) || '' + ctx.url
                    }
                    db.query(`update user set count = ${user.count + 1}, history = '${user.history}' where user.id = ${user.id}`);
                    await next()
                    return
                }
            }

            cookie = uuid.v4();
            var ip = ctx.ip
            ctx.cookies.set('auth', cookie);
            createIpInfo(cookie, ip, db)
            await next()
            return
        }
        else {
            if (!ctx.header.auth || ctx.header.auth != 'liuruige') {
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