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
var productdata
var newsList
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
            newsList = results
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
                productdata = results
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
                url: '/sproduct/' + _.id,
                changefreq: 'monthly',
                priority: 0.5,
                img: _.src
            })
            _.list.forEach(__ => {
                siteArry.push({
                    url: '/sproduct/' + _.id + '/' + __.id,
                    changefreq: 'monthly',
                    priority: 0.5,
                    img: __.imgSrc
                })
            })
        })

        newsList.forEach(_ => {
            siteArry.push({
                url: '/newsList/' + _.id,
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
        streamToPromise(pipeline).then(sm => sitemap = sm)
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

    const recommendData = await new Promise((res, rej) => {
        threadpool.query(`select * from product_list where recommend != 0 order by recommend desc`, function (error, results2, fields) {
            if (error) {
                throw error
            };
            res(results2)
        })
    })

    await ctx.render('sys1', {
        productdata, recommendData, newsList
    })
})

router.get("/newsList", async (ctx) => {
    await ctx.render('newsList', {
        newsList, productdata
    })
})

router.get("/newsList/:id", async (ctx) => {
    await ctx.render("newsWatch", {
        productdata, news: newsList.find(_ => _.id == ctx.params.id)
    })
})

router.get("/product", async (ctx) => {
    await ctx.render('product', {
        productdata,
    })
})

router.get("/newproduct", async (ctx) => {
    var typeData
    await new Promise(function (res, rej) {
        threadpool.query(`select * from PRODUCT_TYPE`, function (error, results, fields) {
            if (error) {
                throw error
            };
            typeData = results;
            console.log(typeData.length)
            typeData.forEach((item, index) => {
                threadpool.query(`select * from PRODUCT_LIST where typeID='${item.id}'`, function (error, results, fields) {
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
router.get("/sproduct/:a", async (ctx) => {
    const type_id = ctx.params.a;
    // 获取当前分类下产品列表
    const gs_list = await new Promise((res, rej) => {
        threadpool.query(`SELECT * FROM PRODUCT_LIST WHERE typeID = '${type_id}'`, (err, results, fields) => {
            if (err) {
                rej(err)
            }
            res(results)
        })
    })
    // 获取当前分类信息
    const gs_info = await new Promise((res, rej) => {
        threadpool.query(`SELECT * FROM PRODUCT_TYPE WHERE id = '${type_id}'`, (err, results, fields) => {
            if (err) {
                rej(err)
            }
            res(results[0])
        })
    })
    // 找到当前分类信息后三个分类信息
    const gs_sort = gs_info.sort;

    const gs_type_length = await new Promise((res, rej) => {
        threadpool.query(`SELECT COUNT(*) as length FROM PRODUCT_TYPE`, (err, results, fields) => {
            if (err) {
                rej(err)
            }
            res(results[0])
        })
    })

    const related_sort = [(gs_sort + 1) % gs_type_length.length, (gs_sort + 2) % gs_type_length.length, (gs_sort + 3) % gs_type_length.length]

    const related_arry = await new Promise((res, rej) => {
        threadpool.query(`SELECT type.id, type.name, list.imgSrc
                      FROM PRODUCT_TYPE type JOIN PRODUCT_LIST list
                      ON type.id = list.typeID
                      WHERE type.sort IN (${related_sort.map(_ => `'${_}'`).join(',')})`, (err, results, fields) => {
            if (err) {
                rej(err)
            }
            res(results)
        })
    })
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
        }), productdata, related_arry_set
    })
})

// 获取小类商品信息
router.get("/sproduct/:a/:b", async (ctx) => {
    const typeID = ctx.params.a;
    const listID = ctx.params.b;

    // 获取商品信息
    const list_info = await new Promise((res, rej) => {
        const sql = `SELECT * FROM PRODUCT_LIST
                WHERE id = '${listID}'`

        threadpool.query(sql, (err, result, fields) => {
            if (err) {
                rej(err)
            }
            res(result[0])
        })
    })

    const other_list = await new Promise((res, rej) => {
        const sql = `SELECT imgSrc, list_name, id
                FROM PRODUCT_LIST
                WHERE typeID = '${typeID}' AND id <> '${listID}'`

        threadpool.query(sql, (err, results, fields) => {
            if (err) {
                rej(err)
            }
            res(results)
        })
    })

    await ctx.render('deproduct', {
        list_info, other_list, productdata,
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


router.get("/houtai", async (ctx) => {
    console.log(__dirname)
    var products = await productdata[parseInt(ctx.params.a)];
    var index = parseInt(ctx.params.a);
    await ctx.render('index', {
        products, index, productdata,
    })
})


router.post("/deletebig", async (ctx) => {
    var which = await parsePostData(ctx) - 1
    productdata.splice(which, 1)
    fs.writeFileSync('./static/data/product.json', JSON.stringify(productdata));
    productdata = JSON.parse(fs.readFileSync('static/data/product.json', 'utf8'));
    ctx.body = 1;
})


router.post("/deletesmall", async (ctx) => {
    var which1 = await parsePostData(ctx)
    which1 = parseQueryStr(which1)
    console.log(which1.out, which1.in)
    productdata[which1.out - 1].splice(which1.in - 1, 1)
    fs.writeFileSync('./static/data/product.json', JSON.stringify(productdata));
    productdata = JSON.parse(fs.readFileSync('static/data/product.json', 'utf8'));
    ctx.body = 1;
})

router.post("/upload", async (ctx) => {
    let result = { success: false }
    let serverFilePath = path.join(__dirname, './static')
    console.log(serverFilePath)
    // 上传文件事件
    result = await uploadFile(ctx, {
        path: serverFilePath
    })
    productdata = JSON.parse(fs.readFileSync('static/data/product.json', 'utf8'));
    await ctx.render('changesuccess', {
    })
})

router.post("/upload1", async (ctx) => {
    let result = { success: false }
    let serverFilePath = path.join(__dirname, './static')
    // 上传文件事件
    result = await uploadFile1(ctx, {
        path: serverFilePath
    })
    productdata = JSON.parse(fs.readFileSync('static/data/product.json', 'utf8'));
    await ctx.render('changesuccess', {
    })
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

houtai_api(router, threadpool, reload, reloadNews, rebuildSitemap, client, news_client)

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