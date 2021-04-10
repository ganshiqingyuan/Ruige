const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static')
const convert = require('koa-convert');
const staticCache = require('koa-static-cache');
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
const { Readable } = require('stream')
const koaBody = require('koa-body');
var cors = require('koa2-cors');
const path = require('path')
const http = require('http')
const app = new Koa({
    proxy: true,
    proxyIpHeader: 'X-Real-IP',
})
const fs = require("fs")
const router = require('koa-router')();

const { uploadFile } = require('./static/js/upload.js')
const { uploadFile1 } = require('./static/js/upload1.js')

const sqlconfig = require("./config/sqlconfig.js")

let OSS = require('ali-oss');

let client = new OSS({
    region: 'oss-cn-hongkong',
    accessKeyId: sqlconfig.accessKeyId,
    accessKeySecret: sqlconfig.accessKeySecret,
    bucket: 'ruigedist'
});


let news_client = new OSS({
    region: 'oss-us-east-1',
    accessKeyId: sqlconfig.accessKeyId,
    accessKeySecret: sqlconfig.accessKeySecret,
    bucket: 'ruigefuns'
});

const Core = require('@alicloud/pop-core');

var sms_client = new Core({
    accessKeyId: sqlconfig.accessKeyId,
    accessKeySecret: sqlconfig.accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

var params = {
    "RegionId": "cn-hangzhou"
}

var requestOption = {
    method: 'POST'
};


const uuid = require("uuid")

const mysql = require("mysql");

var threadpool = mysql.createPool({
    acquireTimeout: 1000,
    connectionLimit: 20,
    host: sqlconfig.database.HOST,
    port: sqlconfig.database.PORT,
    user: sqlconfig.database.USERNAME,
    password: sqlconfig.database.PASSWORD,
    database: sqlconfig.database.DATABASE
});

const houtai_api = require('./houtai/houtai_api/houtai_api.js')
const auth = require('./houtai/houtai_api/auth.js')
const db = (require('./houtai/houtai_api/db.js'))(threadpool)

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    throw err
});




const staticPath = './static';

//  全局缓存
var sitemap
try {
    setTimeout(() => {
        reload().then(res => {
            return reloadNews().then(res2 => {
                rebuildSitemap()
            })
        })
    }, 100)
}
catch (err) {
    console.info(err)
}

function reloadNews() {
    console.log("开始初始化新闻数据")
    return new Promise((res, rej) => {
        threadpool.query(`select id, DATE_FORMAT(creationTimestamp,'%Y-%m-%d %H:%i:%S') as creationTimestamp, title, titleImg, content from news order by creationTimestamp`, function (error, results, fields) {
            if (error) {
                console.log(error)
                throw error
            };
            global.newsList = results
            res(results)
        });
    })
        .catch(error => {
            console.log(error)
            throw error
        })
}

function reload() {
    console.log("开始初始化数据")
    return new Promise((res, rej) => {
        threadpool.query(`select * from product_type order by sort`, function (error, results, fields) {
            if (error) {
                console.log(error)
                throw error
            };
            const id_list = results.map(_ => _.id)
            console.log(id_list)
            const sql = `select * from product_list where typeID in (${id_list.map(_ => `'${_}'`).join(',')})`
            threadpool.query(sql, function (error, results2, fields) {
                if (error) {
                    throw error
                }
                results.forEach(_ => {
                    _.list = results2.filter(__ => __.typeID == _.id);
                })
                global.productdata = results
                res(results)
                console.log('数据初始化成功')

            })
        });
    })
        .catch(error => {
            console.log(error)
            throw error
        })
}

function rebuildSitemap() {
    try {
        const smStream = new SitemapStream({ hostname: 'https://www.rayvet.cn/' })
        const pipeline = smStream.pipe(createGzip())

        const siteArry = [
            {
                url: '/',
                changefreq: 'monthly',
                priority: 1
            },
            {
                url: '/product',
                changefreq: 'monthly',
                priority: 1
            },
            {
                url: '/service',
                changefreq: 'monthly',
                priority: 1
            },
            {
                url: '/partener',
                changefreq: 'monthly',
                priority: 1
            },
            {
                url: '/contact',
                changefreq: 'monthly',
                priority: 1
            },
            {
                url: '/newsList',
                changefreq: 'daily',
                priority: 1
            }
        ]

        productdata.forEach(_ => {
            siteArry.push({
                url: '/product/' + _.name.replace(/\s/g, '-'),
                changefreq: 'monthly',
                priority: 0.5,
                img: _.src
            })
            _.list.forEach(__ => {
                siteArry.push({
                    url: '/product/' + _.name.replace(/\s/g, '-') + '/' + __.list_name.replace(/\s/g, '-'),
                    changefreq: 'monthly',
                    priority: 0.5,
                    img: __.imgSrc
                })
            })
        })

        newsList.forEach(_ => {
            siteArry.push({
                url: '/newsList/' + _.title.replace(/\s/g, '-'),
                changefreq: 'daily',
                priority: 0.5,
                img: _.titleImg
            })
        })

        // pipe your entries or directly write them.
        // smStream.write({ url: '/page-1/', changefreq: 'daily', priority: 0.3 })
        // smStream.write({ url: '/page-2/', changefreq: 'monthly', priority: 0.7 })
        // smStream.write({ url: '/page-3/' })    // changefreq: 'weekly',  priority: 0.5
        // smStream.write({ url: '/page-4/', img: "http://urlTest.com" })
        Readable.from(siteArry).pipe(smStream)

        // cache the response
        streamToPromise(pipeline).then(sm => {
            sitemap = sm;
            //http.get("http://www.google.com/ping?sitemap=https://www.rayvet.cn/sitemap.xml")
        })
        // make sure to attach a write stream such as streamToPromise before ending
        // stream write the response
        // pipeline.pipe(res).on('error', (e) => { throw e })
    } catch (e) {
        console.error(e)
    }
}

app.use(convert(staticCache(path.join(__dirname, staticPath), {
    maxAge: 0
})));

app.use(static(
    path.join(__dirname, staticPath)
))

app.use(cors())

app.use(koaBody(
    {
        formidable: {
            uploadDir: path.resolve(__dirname, './static/img')
        },
        multipart: true
    }
))


app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

router.get("/", async (ctx) => {
    await ctx.render('sys1', {
        productdata,
        recommendData: productdata.reduce(function (pre, cur) {
            return pre.concat(cur.list)
        }, []).filter(function (_) {
            return _.recommend
        }).sort((pre, cur) => pre.sort - cur.sort),
        newsList,
        cdn: sqlconfig.cdn
    })
})

router.get("/newsList", async (ctx) => {
    await ctx.render('newsList', {
        newsList, productdata, cdn: sqlconfig.cdn
    })
})

router.get("/newsList/:title", async (ctx) => {
    const news = newsList.find(_ => _.title.replace(/\s/g, '-') == ctx.params.title);
    if (!news) {
        await ctx.render('delete_news', {
            news: newsList.slice(0, 3), cdn: sqlconfig.cdn
        })
        return
    }
    await ctx.render("newsWatch", {
        productdata, news: newsList.find(_ => _.title.replace(/\s/g, '-') == ctx.params.title)
    })
})

router.get("/product", async (ctx) => {
    await ctx.render('product', {
        productdata, cdn: sqlconfig.cdn
    })
})

router.get("/newproduct", async (ctx) => {
    var typeData
    await new Promise(function (res, rej) {
        threadpool.query(`select * from product_type`, function (error, results, fields) {
            if (error) {
                throw error
            };
            typeData = results;
            console.log(typeData.length)
            typeData.forEach((item, index) => {
                threadpool.query(`select * from product where typeID='${item.id}'`, function (error, results, fields) {
                    if (error) {
                        throw error
                    };
                    item.children = results
                    res()
                });
            })
        })
    })
    const productdata = typeData
    ctx.body = JSON.stringify(productdata)
    return
    await ctx.render('newproduct', {
        productdata,
    })
})


router.get("/contact", async (ctx) => {
    await ctx.render('contact', {
        productdata,
    })
})


router.get("/service", async (ctx) => {
    await ctx.render('service', {
        productdata,
    })
})

router.get("/partener", async (ctx) => {
    await ctx.render('partener', {
        productdata,
    })
})



// 获取大类商品信息
router.get("/product/:type_name", async (ctx) => {
    const type_name = ctx.params.type_name;
    // 获取当前分类信息
    const gs_info = productdata.filter(type => {
        return type.name.replace(/\s/g, '-') === type_name
    })[0]
    if (!gs_info) {
        await ctx.render('delete_product_type', {
            productdataRecommend: productdata.filter(function (_) {
                return _.recommend
            })
        })
        return
    }
    // 获取当前分类下产品列表
    const gs_list = gs_info.list;
    // 找到当前分类信息后三个分类信息
    const gs_sort = gs_info.sort;

    const gs_type_length = productdata.length;

    const related_sort = [(gs_sort + 1) % gs_type_length, (gs_sort + 2) % gs_type_length, (gs_sort + 3) % gs_type_length]

    const related_arry = productdata.filter(type => related_sort.includes(type.sort));
    const related_arry_set = [];

    related_arry.forEach(_ => {
        if (!related_arry_set.map(__ => __.id).includes(_.id)) {
            related_arry_set.push(_)
        }
    })

    await ctx.render('sproduct', {
        gs_list: gs_list.map(_ => {
            return {
                ..._,
                imgSrc: _.imgSrc
            }
        }), productdata, related_arry_set, gs_info, cdn: sqlconfig.cdn
    })
})

// 获取小类商品信息
router.get("/product/:a/:b", async (ctx) => {
    const typeName = ctx.params.a;
    const listName = ctx.params.b;

    const type_info = productdata.filter(type => type.name.replace(/\s/g, '-') === typeName)[0];
    const list_info = type_info.list.filter(list => list.list_name.replace(/\s/g, '-') === listName)[0];

    if (!list_info || !type_info) {
        await ctx.render('delete_product', {
            productdataRecommend: productdata.reduce(function (pre, cur) {
                return pre.concat(cur.list)
            }, []).filter(function (_) {
                return _.recommend
            })
        })
        return
    }

    const other_list = type_info.list.filter(list => list.id !== list_info.id)

    await ctx.render('deproduct', {
        list_info, type_info, other_list, productdata, cdn: sqlconfig.cdn
    })
})


router.post("/send", async (ctx) => {
    console.log(ctx.request.body)
    const { name, email, subject, phone, company, word } = ctx.request.body

    const params = {
        "RegionId": "cn-hangzhou",
        "PhoneNumbers": "15130058651",
        "SignName": "瑞格",
        "TemplateCode": "SMS_107005112",
        "TemplateParam": JSON.stringify({ "a": name, "c": email.replace(".", ""), "b": subject, "d": phone, "e": company, "f": word })
    }

    sms_client.request('SendSms', params, requestOption).then((result) => {
        console.log('发送短信成功', JSON.stringify(result));
    }, (ex) => {
        console.log(ex);
    })

    ctx.body = 1
})


router.get('/sitemap.xml', async (ctx) => {
    ctx.set('Content-Type', 'application/xml');
    ctx.set('Content-Encoding', 'gzip');
    // if we have a cached entry send it
    if (sitemap) {
        ctx.body = sitemap
        return
    }
})

router.get('/cdn-product/:img', async (ctx) => {
    console.log("回源")
    ctx.redirect(`https://ruigedist.oss-cn-hongkong.aliyuncs.com/${ctx.params.img}`);
    ctx.body = 'Redirecting';
})

router.get('/cdn-news/:title/:img', async (ctx) => {
    ctx.redirect(`https://ruigedist.oss-cn-hongkong.aliyuncs.com/${ctx.params.title}_${ctx.params.img}`);
    ctx.body = 'Redirecting';
})

houtai_api(router, threadpool, reload, reloadNews, rebuildSitemap, client, news_client, db)

app.use(auth(threadpool, db))

app.use(router.routes())
    .use(router.allowedMethods());


function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = "";
            ctx.req.addListener('data', (data) => {
                postdata += data
            })
            ctx.req.addListener("end", function () {
                resolve(postdata)
            })
        } catch (err) {
            reject(err)
        }
    })
}


function parseQueryStr(queryStr) {
    let queryData = {}
    let queryStrList = queryStr.split('&')
    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=')
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData
}

app.listen(sqlconfig.PORT)
console.log('[demo] start-quick is starting at port 3000')
