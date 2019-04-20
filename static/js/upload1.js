const inspect = require('util').inspect
const path = require('path')
const os = require('os')
const fs = require('fs')
const Busboy = require('busboy')

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName( fileName ) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}         
 */
function uploadFile1( ctx, options) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({headers: req.headers})

  // 获取类型
  let filePath = path.join( options.path,  'img')
  console.log(options.path);
  let mkdirResult = mkdirsSync( filePath )
  console.log(mkdirResult)
  
  return new Promise((resolve, reject) => {
    console.log('文件上传中...')
    let result = { 
      success: false,
      formData: [],
      changedate:{
		        "url": " url(/img/FIRSTone.jpg)",
		        "head": "KVET-500",
		        "data": "Classic veterinary x ray machine, easy to upgraded to be DR in the future. ",
		        "detail":[
		]
			}
    }
     // 解析表单中其他字段信息
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      result.formData.push(val) ;
    });
    // 解析请求文件事件
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    	console.log("123");
      let fileName = filename;
      result.changedate.url="url(/img/"+fileName+")"
      console.log(fileName)
      let _uploadFilePath = path.join( filePath, fileName )
      let saveTo = path.join(_uploadFilePath)
     console.log(saveTo);
      // 文件保存到制定路径
   file.pipe(fs.createWriteStream(saveTo))

      // 文件写入事件结束
      file.on('end', function() {
        result.success = true
        result.message = '文件上传成功'

        console.log('文件上传成功！')
        resolve(result)
      })
    })


    // 解析结束事件
    busboy.on('finish', function( ) {
      console.log('文件上结束')
      console.log(result.formData)
      which=result.formData[0]
      result.changedate.head=result.formData[1]
      result.changedate.data=result.formData[2]
      result.changedate.detail=result.formData[3].split(",")
      console.log(result.changedate)
    var indata=JSON.parse(fs.readFileSync('./static/data/product.json','utf8'))
    indata[which-1].push(result.changedate);
//    console.log(JSON.stringify(indata))
    fs.writeFileSync('./static/data/product.json',JSON.stringify(indata));
      resolve(result)
    })

    // 解析错误事件
    busboy.on('error', function(err) {
      console.log('文件上出错')
      reject(result)
    })

    req.pipe(busboy)
  })
    
} 


module.exports =  {
  uploadFile1
}