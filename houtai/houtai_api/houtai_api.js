const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

module.exports = function(router, threadpool){
    router.get('/houtai/productmanage/get_type_list', async (ctx) =>{
        try{
            const {page = 1, perpage = 10, name = '', descript = '', sort = ''} = ctx.query;
            const sql = `SELECT * FROM PRODUCT_TYPE
                        WHERE name like '%${name}%' AND descript like '%${descript}%' ${sort?`AND sort = ${sort}`:''}
                        order by sort
                        limit ${(page-1)*perpage},${perpage}`
            const type_list = await new Promise((res,rej) =>{
                threadpool.query(sql, function (error, results, fields) {
                    if (error) {
                        throw error
                    };
                    res(results)
                });
            })

            const count = await new Promise((res,rej)=>{
                threadpool.query('select count(*) as count from PRODUCT_TYPE', function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results[0])
                })
            })

            ctx.body = JSON.stringify({
                code: 200,
                total:count.count,
                data: type_list
            })
        }
        catch(err){
            ctx.body = JSON.stringify({
                code: 500,
                data: ''
            })
        }
    })
    router.post('/houtai/productmanage/change_type_info', async (ctx) =>{
        try{
            const file = ctx.request.files && ctx.request.files.file
            const {name, descript, sort, id} = ctx.request.body
            let src = ctx.request.body.file
            if(file){
                var path = file.path.replace(/\\/g, '/');
                var fname = file.name;
                var nextPath = '';
                if(file.size>0&&path){
                    var extArr = fname.split('.');
                    var ext = extArr[extArr.length-1]
                    nextPath = path + '.' +ext;
                    fs.renameSync(path, nextPath)
                    src = `url(/img/${nextPath.slice(nextPath.lastIndexOf('/')+1)})`
                }
            }
            console.log(id, src)
            await new Promise((res,rej)=>{
                const sql = `replace into PRODUCT_TYPE(id, parentId, name, descript, updateTime, sort, src)
                            values('${id || uuid.v4()}','','${name}','${descript}','${new Date().getTime()}', ${sort}, '${src}')`
                threadpool.query(sql, function (error, results, fields) {
                    if (error) {
                        throw error
                    };
                    res(results)
                });
            })
            ctx.body = JSON.stringify({
                code: 200,
                data: 1
            })
        }
        catch(err){
            console.log(err)
            ctx.body = JSON.stringify({
                code: 500,
                data: ''
            })
        }
    }),
    router.post('/houtai/productmanage/delete_type', async (ctx) =>{
        try{
            const {id, src} = ctx.request.body
            const sql = `delete from product_type where id = '${id}'`;
            
            await new Promise((res,rej)=>{
                threadpool.query(sql, function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results)
                })
            })
            fs.unlinkSync(path.join(__dirname,'../../static',src.replace('url(','').replace(')','').trim()))
            ctx.body = JSON.stringify({
                code: 200,
                data:1
            })
        }
        catch(err){
            console.log(err)
            ctx.body = JSON.stringify({
                code: 500,
                data: ''
            })
        }
    })


    // 子分类相关接口   
    router.get('/houtai/productmanage/get_product_list', async (ctx) =>{ // 子产品列表
        try{
            const {typeId, list_name = '', descript = '', beginTime = 0, endTime = 9999999999999, page = 1, perpage = 10 } = ctx.query;

            const sql = `SELECT SQL_CALC_FOUND_ROWS * FROM PRODUCT_LIST
                        WHERE typeID = '${typeId}' AND list_name like '%${list_name}%' AND descript like '%${descript}%'
                        AND updateTime BETWEEN ${beginTime || 0} AND ${endTime || 9999999999999}
                        limit ${(page-1)*perpage},${perpage}`
            
            const product_list = await new Promise((res,rej)=>{
                threadpool.query(sql, function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results)
                })
            })

            const sql1 = `select FOUND_ROWS() as count`

            const count = await new Promise((res,rej)=>{
                threadpool.query(sql1, function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results)
                })
            })

            ctx.body = JSON.stringify({
                code: 200,
                total: count[0].count,
                data: product_list
            })
        }
        catch(err){
            console.log(err)
            ctx.body = JSON.stringify({
                code: 500,
                data: err
            })
        }
    })

    router.post('/houtai/productmanage/change_product_info', async (ctx) =>{ // 添加和修改某分类下产品
        try{
            const file = ctx.request.files && ctx.request.files.file
            const {list_name = '', descript = '', detail = '', id = '', typeId = ''} = ctx.request.body
            let src = ctx.request.body.file
            if(file){
                var path = file.path.replace(/\\/g, '/');
                var fname = file.name;
                var nextPath = '';
                if(file.size>0&&path){
                    var extArr = fname.split('.');
                    var ext = extArr[extArr.length-1]
                    nextPath = path + '.' +ext;
                    fs.renameSync(path, nextPath)
                    src = `url(/img/${nextPath.slice(nextPath.lastIndexOf('/')+1)})`
                }
            }
            console.log(id, src)
            await new Promise((res,rej)=>{
                const sql = `replace into PRODUCT_LIST(id, typeID, imgSrc, descript, updateTime, detail, list_name)
                            values('${id || uuid.v4()}','${typeId}','${src}','${descript}','${new Date().getTime()}', '${detail}', '${list_name}')`
                threadpool.query(sql, function (error, results, fields) {
                    if (error) {
                        throw error
                    };
                    res(results)
                });
            })
            ctx.body = JSON.stringify({
                code: 200,
                data: 1
            })
        }
        catch(err){
            console.log(err)
            ctx.body = JSON.stringify({
                code: 500,
                data: err
            })
        }
    })

    router.post('/houtai/productmanage/delete_product', async (ctx) =>{ // 删除某分类id 下的产品
        try{
            const {id, typeId, imgSrc} = ctx.request.body
            const sql = `delete from product_list where id = '${id}' AND typeID = '${typeId}'`;
            
            await new Promise((res,rej)=>{
                threadpool.query(sql, function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results)
                })
            })

            fs.unlinkSync(path.join(__dirname,'../../static',imgSrc.replace('url(','').replace(')','').trim()))
            ctx.body = JSON.stringify({
                code: 200,
                data:1
            })
        }
        catch(err){
            console.log(err)
            ctx.body = JSON.stringify({
                code: 500,
                data: ''
            })
        }
    })
}