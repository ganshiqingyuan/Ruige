module.exports = function(router, threadpool){
    console.log("接口注册")
    router.get('/houtai/productmanage/get_type_list', async (ctx) =>{
        console.log(123)
        try{
            const {page = 1, perpage = 10, name = '', descript = '', sort = ''} = ctx.query;
            const sql = `SELECT * FROM PRODUCT_TYPE
                        WHERE name like '%${name}%' AND descript like '%${descript}%' ${sort?`AND sort = ${sort}`:''}
                        limit ${(page-1)*perpage},${perpage}`
            const type_list = await new Promise((res,rej) =>{
                threadpool.query(sql, function (error, results, fields) {
                    if (error) {
                        throw error
                    };
                    res(results)
                });
            })

            ctx.body = JSON.stringify({
                code: 200,
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
}