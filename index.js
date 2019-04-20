const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static')
const convert = require('koa-convert');
const staticCache = require('koa-static-cache');
const path = require('path')
const app = new Koa()
const fs= require("fs")
const router = require('koa-router')();
const { uploadFile } = require('./static/js/upload.js')
const { uploadFile1 } = require('./static/js/upload1.js')
const nodemailer = require('nodemailer');


const SMSClient = require('@alicloud/sms-sdk')

const accessKeyId = 'LTAISnXsHJUOx7B8'
const secretAccessKey = 'ibrV5ZmezEAfAz2IzTGVCSaN1M97CX'

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


const staticPath = './static'

var productdata=JSON.parse(fs.readFileSync('static/data/product.json','utf8'));

//
app.use(convert(staticCache(path.join(__dirname, staticPath), {
    maxAge: 24 * 60 * 60
})));


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
  await ctx.render('newproduct',{
    productdata
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




router.get("/sproduct/:a",async ( ctx ) => {
	var products=await productdata[parseInt(ctx.params.a)];
	var index=parseInt(ctx.params.a);
			await ctx.render('sproduct', {
				products,index,productdata,
        })
})


router.get("/sproduct/:a/:b",async ( ctx ) => {
	var product=await productdata[parseInt(ctx.params.a)];
	var products=product[parseInt(ctx.params.b)]
	console.log(products)
			await ctx.render('deproduct', {
				products,product,productdata,
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

app.listen(3001)
console.log('[demo] start-quick is starting at port 3000')