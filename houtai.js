const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static')
const convert = require('koa-convert');
const staticCache = require('koa-static-cache');
const path = require('path')
const app = new Koa()
const fs= require("fs")
const router = require('koa-router')();

require('./houtai/houtai_api/houtai_api.js')(router)

const { uploadFile } = require('./static/js/upload.js')
const { uploadFile1 } = require('./static/js/upload1.js')
const nodemailer = require('nodemailer');



const SMSClient = require('@alicloud/sms-sdk')

const accessKeyId = 'LTAISnXsHJUOx7B8'
const secretAccessKey = 'ibrV5ZmezEAfAz2IzTGVCSaN1M97CX'

const uuid = require("uuid")

const mysql = require("mysql");
const sqlconfig = require("./config/sqlconfig.js")

var threadpool  = mysql.createPool({
  host     : sqlconfig.database.HOST,
  user     : sqlconfig.database.USERNAME,
  password : sqlconfig.database.PASSWORD,
  database : sqlconfig.database.DATABASE
});


let smsClient = new SMSClient({accessKeyId, secretAccessKey})

const mail= {
    from: {
      name: 'test',
     service: 'smtp.163.com',
      auth: {
        user: '18341323671@163.com',
       pass: 'hong22954914600'
     }
    },
    to: [
      '1174607294@qq.com'
    ]
  }

smtpTransport = nodemailer.createTransport(
 	{
 		 host: 'smtp.163.com',
    secureConnection: true,  // use SSL  
    port: 465,
    auth: {
        user: '18341323671@163.com',  // 邮箱地址
        pass: 'hong22954914600'  // 密码（163邮箱的话是设置smtp时的授权码）
    }
 	}
 );


const staticPath = './static';
var productdata

threadpool.query(`select * from PRODUCT_TYPE`, function (error, results, fields) {
  if (error) {
      throw error
  };
  const id_list = results.map(_=>_.id)
  const sql = `select * from PRODUCT_LIST where typeID in (${id_list.map(_=>`'${_}'`).join(',')})`
  threadpool.query(sql,function(error, results2, fields){
    if(error){
      throw error
    }
    results.forEach(_=>{
      _.list = results2.filter(__=>__.typeID == _.id);
    })
    productdata = results

    // productdata.forEach(_=>{
    //   threadpool.query(`update PRODUCT_TYPE set src = '${_.list[0].imgSrc}' where id = '${_.id}'`, function(error, result, fields) {
    //     if(error){
    //       console.log(error)
    //     }
    //     else{
    //       console.log("插入成功")
    //     }
    //   })
    // })
  })
  // console.log('The solution is: ', results[0].solution);
});




//var productdata=JSON.parse(fs.readFileSync('static/data/product.json','utf8'));



console.log(productdata)

// productdata.forEach((data,index)=>{
//   var id = uuid.v4()
//   threadpool.query(`insert into PRODUCT_TYPE values('${id}','0','${data[0].lastname}','${data[0].data}','${new Date().getTime()}',${index})`, function (error, results, fields) {
//       if (error) {
//           throw error
//       };
//       for(var i=0;i<data.length;i++){
//         threadpool.query(`insert into PRODUCT_LIST values('${uuid.v4()}','${id}','${data[i].url}','${data[i].data}','${new Date().getTime()}','${data[i].detail}','${data[i].head}')`, function (error, results, fields) {
//           if (error) {
//               throw error
//           };
//           // console.log('The solution is: ', results[0].solution);
//       });
//       }
//       // console.log('The solution is: ', results[0].solution);
//   });

// })
// return 

//
// app.use(convert(staticCache(path.join(__dirname, staticPath), {
//     maxAge: 24 * 60 * 60
// })));


app.use(static(
  path.join( __dirname,  staticPath)
))


app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

router.get("/",async ( ctx ) => {
	await ctx.render('sys1', {
		productdata,
        })
})

router.get("/product",async ( ctx ) => {
	await ctx.render('product', {
		productdata,
  })
})

router.get("/newproduct",async ( ctx ) => {
  var typeData
  await new Promise(function(res,rej){
    threadpool.query(`select * from PRODUCT_TYPE`, function (error, results, fields) {
      if (error) {
          throw error
      };
      typeData = results;
      console.log(typeData.length)
      typeData.forEach((item,index)=>{
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


router.get("/contact",async ( ctx ) => {
	await ctx.render('contact', {
		productdata,
        })
})


router.get("/service",async ( ctx ) => {
	await ctx.render('service', {
		productdata,
        })
})

router.get("/partener",async ( ctx ) => {
	await ctx.render('partener', {
		productdata,
        })
})



// 获取大类商品信息
router.get("/sproduct/:a",async ( ctx ) => {
  const type_id = ctx.params.a;
  // 获取当前分类下产品列表
  const gs_list = await new Promise((res,rej) =>{
    threadpool.query(`SELECT * FROM PRODUCT_LIST WHERE typeID = '${type_id}'`, (err, results, fields) =>{
      if(err){
        rej(err)
      }
      res(results)
    })
  })
  // 获取当前分类信息
  const gs_info = await new Promise((res,rej)=>{
    threadpool.query(`SELECT * FROM PRODUCT_TYPE WHERE id = '${type_id}'`, (err, results, fields)=>{
      if(err){
        rej(err)
      }
      res(results[0])
    })
  })
  // 找到当前分类信息后三个分类信息
  const gs_sort = gs_info.sort;

  const gs_type_length = await new Promise((res, rej)=>{
    threadpool.query(`SELECT COUNT(*) as length FROM PRODUCT_TYPE`, (err, results, fields)=>{
      if(err){
        rej(err)
      }
      res(results[0])
    })
  })

  const related_sort = [(gs_sort+1) % gs_type_length.length, (gs_sort+2) % gs_type_length.length, (gs_sort+3) % gs_type_length.length]

  const related_arry = await new Promise((res,rej)=>{
    threadpool.query(`SELECT type.id, type.name, list.imgSrc
                      FROM PRODUCT_TYPE type JOIN PRODUCT_LIST list 
                      ON type.id = list.typeID
                      WHERE type.sort IN (${related_sort.map(_=>`'${_}'`).join(',')})`, (err, results, fields)=>{
                        if(err){
                          rej(err)
                        }
                        res(results)
                      })
  })
  const related_arry_set = [];

  related_arry.forEach(_=>{
    if(!related_arry_set.map(__=>__.id).includes(_.id)){
      related_arry_set.push(_)
    }
  })

  await ctx.render('sproduct', {
    gs_list, productdata, related_arry_set
  })
})

// 获取小类商品信息
router.get("/sproduct/:a/:b",async ( ctx ) => {
  const typeID = ctx.params.a;
  const listID = ctx.params.b;

  // 获取商品信息
  const list_info = await new Promise((res,rej)=>{
    const sql = `SELECT * FROM PRODUCT_LIST 
                WHERE id = '${listID}'`

    threadpool.query(sql, (err, result, fields)=>{
      if(err){
        rej(err)
      }
      res(result[0])
    })
  })

  console.log(list_info)

  const other_list = await new Promise((res,rej)=>{
    const sql = `SELECT imgSrc, list_name, id
                FROM PRODUCT_LIST
                WHERE typeID = '${typeID}' AND id <> '${listID}'`
    
    threadpool.query(sql, (err, results, fields)=>{
      if(err){
        rej(err)
      }
      res(results)
    })
  })

  await ctx.render('deproduct', {
    list_info, other_list, productdata,
  })
})


router.post("/send",async ( ctx ) => {
	console.log('123');
	let postData = await parsePostData( ctx )
	console.log(parseQueryStr(postData).name)
	await sendMail('来自客户','<h1>姓名</h1>'+'<p>'+parseQueryStr(postData).name+'</p>'+'<h1>邮箱</h1>'+'<p>'+parseQueryStr(postData).email+'</p>'+'<h1>主题</h1>'+'<p>'+parseQueryStr(postData).subject+'</p>'+
	    '<h1>电话</h1>'+'<p>'+parseQueryStr(postData).phone+'</p>'+'<h1>公司</h1>'+'<p>'+parseQueryStr(postData).company+'</p>'+'<h1>内容</h1>'+'<p>'+parseQueryStr(postData).word+'</p>');
	
smsClient.sendSMS({
    PhoneNumbers: '15130058651',
    SignName: '网站留言通知',
    SignName:"瑞格",
    TemplateCode: 'SMS_107005112',
    TemplateParam:JSON.stringify({"a":parseQueryStr(postData).name,"c":parseQueryStr(postData).email.replace(".",""),"b":parseQueryStr(postData).subject,"d":parseQueryStr(postData).phone,"e":parseQueryStr(postData).company,"f":parseQueryStr(postData).word})
}).then(function (res) {
    let {Code}=res
    if (Code === 'OK') {
        //处理返回参数
        console.log(res)
    }
}, function (err) {
    console.log(err)
})
ctx.body=1
})


router.get("/houtai",async ( ctx ) => {
	console.log(__dirname)
	var products=await productdata[parseInt(ctx.params.a)];
	var index=parseInt(ctx.params.a);
			await ctx.render('index', {
				products,index,productdata,
        })
})


router.post("/deletebig",async ( ctx ) => {
	var which=  await parsePostData( ctx )-1
	productdata.splice(which,1)
	fs.writeFileSync('./static/data/product.json',JSON.stringify(productdata));
	 productdata=JSON.parse(fs.readFileSync('static/data/product.json','utf8'));
	  ctx.body=1;
})


router.post("/deletesmall",async ( ctx ) => {
	var which1=  await parsePostData( ctx )
	which1=parseQueryStr(which1)
	console.log(which1.out,which1.in)
	productdata[which1.out-1].splice(which1.in-1,1)
	fs.writeFileSync('./static/data/product.json',JSON.stringify(productdata));
	 productdata=JSON.parse(fs.readFileSync('static/data/product.json','utf8'));
	  ctx.body=1;
})

router.post("/upload",async ( ctx ) => {
		let result = { success: false }
    let serverFilePath = path.join( __dirname, './static' )
    console.log(serverFilePath)
       // 上传文件事件
    result = await uploadFile( ctx, {
      path: serverFilePath
    })
   productdata=JSON.parse(fs.readFileSync('static/data/product.json','utf8')); 
        await ctx.render('changesuccess', {
        })
})

router.post("/upload1",async ( ctx ) => {
		let result = { success: false }
    let serverFilePath = path.join( __dirname, './static' )
       // 上传文件事件
    result = await uploadFile1( ctx, {
      path: serverFilePath
    })
    productdata=JSON.parse(fs.readFileSync('static/data/product.json','utf8'));
        await ctx.render('changesuccess', {
        })
})


 app.use(router.routes())
    .use(router.allowedMethods());
    
    
   
   
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        resolve( postdata)
      })
    } catch ( err ) {
      reject(err)
    }
  })
}   

function sendMail(subject, html) {
  var mailOptions = {
    from: [mail.from.name, mail.from.auth.user].join(' '),
    to: mail.to.join(','),
    subject: subject,
    html: html
  };
  smtpTransport.sendMail(mailOptions, function(error, response){
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + response.message);
    }
    smtpTransport.close();
  });
};


function parseQueryStr( queryStr ) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  for (  let [ index, queryStr ] of queryStrList.entries()  ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}
//app.use( async ( ctx ) => {
//	console.log(ctx.url);
//	if(ctx.url=="/"){
//	await ctx.render('sys1', {
//      })
//	}
//	else if(ctx.url=="/product"){
//		console.log("123");
//			await ctx.render('product', {
//      })
//	}
//		else if(ctx.url=="/sproduct"){
//			console.log(ctx)
//			var products=await JSON.parse(fs.readFileSync('static/data/product.json','utf8'));
//			await ctx.render('sproduct', {
//				products,
//      })
//	}
//		else if(ctx.url=="/contact"){
//			await ctx.render('contact', {
//      })
//		}
//		else if(ctx.url=="/service"){
//			await ctx.render('service', {
//      })
//		}
//			else if(ctx.url=="/partener"){
//			await ctx.render('partener', {
//      })
//		}
//})

app.listen(sqlconfig.PORT)
console.log('[demo] start-quick is starting at port 3000')