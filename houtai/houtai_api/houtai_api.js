const fs = require("fs")
const uuid = require("uuid")

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
            const {id} = ctx.request.body
            const sql = `delete from product_type where id = '${id}'`;
            
            await new Promise((res,rej)=>{
                threadpool.query(sql, function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results)
                })
            })
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