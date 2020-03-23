const fs = require("fs")
const uuid = require("uuid")
const path = require("path")


module.exports = function(router, threadpool, reload, al_client){
    const db = {
        query: function(sql){
            console.info(`'${sql}'`)
            return new Promise((res,rej)=>{
                threadpool.query(sql, function(error, results, fields){
                    if(error){
                        throw error
                    }
                    res(results)
                })
            })
        },
        connection: function(sql){
            console.info(`'${sql}'`)
            return new Promise((res,rej)=>{
                threadpool.getConnection(async function(err, connection){
                    if(err) throw err;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            throw error
                        };
                        res([results,connection])
                    });
                })
            })
        },
        use_connection: function(connection, sql){
            console.info(`'${sql}'`)
            return new Promise((res,rej)=>{
                connection.query(sql, function(error, results, fields){
                    if(error) throw error
                    res([results, connection])
                })
            })
        }
    }

    router.get('/houtai/productmanage/get_type_list', async (ctx) =>{
        try{
            const {page = 1, perpage = 10, name = '', descript = '', sort = ''} = ctx.query;
            const sql = `SELECT * FROM PRODUCT_TYPE
                        WHERE name like '%${name}%' AND descript like '%${descript}%' ${sort?`AND sort = ${sort}`:''}
                        order by sort
                        limit ${(page-1)*perpage},${perpage}`
            const sql1 = `select FOUND_ROWS()`

            const list_with_count = await new Promise((reso,reje)=>{
                threadpool.getConnection(async function(err, connection) {
                    if (err) throw err; // not connected!
    
                    const type_list = await Promise.all((await new Promise((res,rej) =>{
                        connection.query(sql, function (error, results, fields) {
                            if (error) {
                                throw error
                            };
                            res(results)
                        });
                    }))
                    .map(async _=>{
                        return{
                            ..._,
                            src: _.src
                        }
                    }))
        
                    const count = await new Promise((res,rej)=>{
                        connection.query(sql1, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    })

                    connection.release();

                    reso({
                        list: type_list,
                        count: count[0]['FOUND_ROWS()']
                    })
                });
            })
            

            ctx.body = JSON.stringify({
                code: 200,
                total:list_with_count.count,
                data: list_with_count.list
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
                    await al_client.put(nextPath.slice(nextPath.lastIndexOf('/')+1), file.path)
                    src = await al_client.generateObjectUrl(nextPath.slice(nextPath.lastIndexOf('/')+1))
                    await fs.unlinkSync(file.path) //删除临时存储文件
                    
                    const old_src = await new Promise((res,rej)=>{
                        const sql = `select src from PRODUCT_TYPE where id = '${id}'`
                        threadpool.query(sql, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    })
                    if(old_src&&old_src[0]){
                        await al_client.delete(old_src[0].src.slice(old_src[0].src.lastIndexOf('/')+1))
                    }
                }
            }
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
            reload()
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
            await al_client.delete(src.slice(src.lastIndexOf('/')+1))
            ctx.body = JSON.stringify({
                code: 200,
                data:1
            })
            reload()
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
            const sql1 = `select FOUND_ROWS()`

            const list_with_count = await new Promise((reso,reje)=>{
                threadpool.getConnection(async function(err, connection) {
                    if (err) throw err; // not connected!
    
                    const product_list = await Promise.all((await new Promise((res,rej)=>{
                        connection.query(sql, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    }))
                    .map(async _=>{
                        return{
                            ..._,
                            imgSrc: _.imgSrc
                        }
                    }))
        
                    const count = await new Promise((res,rej)=>{
                        connection.query(sql1, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    })

                    connection.release();

                    reso({
                        list: product_list,
                        count: count[0]['FOUND_ROWS()']
                    })
                });
            })

            ctx.body = JSON.stringify({
                code: 200,
                total: list_with_count.count,
                data: list_with_count.list
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

    
    // 修改时初始化商品详情
    router.get('/houtai/productmanage/get_product_detail', async (ctx) =>{
        try{
            const { id } = ctx.query;

            const product_detail = (await db.query(`select * from product_list where id = '${id}'`))[0];

            const spec_data = (await db.query(`select * from product_sku where p_id = '${id}' and is_used = 1`)).map(_=>{
                return {
                    ..._,
                    spec_comp: JSON.parse(_.spec_data)
                }
            });

            const spec_name_list = (await db.query(`select spec_name_id, value as spec_name from spec_name where p_id = '${id}' and is_used = 1`));

            const spec_value_list = await db.query(`select value as spec_value, spec_value_id, spec_name_id from spec_value where spec_name_id in (${spec_name_list.reduce((pre,cur)=>pre+ ',' + cur.spec_name_id, 0)}) and is_used = 1`)
            
            spec_name_list.forEach(_=>{
                _.spec_value_arr = spec_value_list.filter(__=>__.spec_name_id == _.spec_name_id)
            })

            ctx.body = JSON.stringify({
                code: 200,
                data: {
                    product_detail,
                    spec_data,
                    spec_name_list
                }
            })
        }
        catch(err){
            throw err
            ctx.body = JSON.stringify({
                code: 500,
                data: err
            })
        }
    })

    // 增加和修改商品
    router.post('/houtai/productmanage/change_product_info', async (ctx) =>{ // 添加和修改某分类下产品
        try{
            const file = ctx.request.files && ctx.request.files.file
            const {fenleiItem} = ctx.request.body

            const requestData = JSON.parse(fenleiItem)
            console.log(requestData)

            let src = requestData.file

            const p_id = requestData.id || uuid.v4()
            if(file){
                var path = file.path.replace(/\\/g, '/');
                var fname = file.name;
                var nextPath = '';
                if(file.size>0&&path){
                    var extArr = fname.split('.');
                    var ext = extArr[extArr.length-1]
                    nextPath = path + '.' +ext;
                    await al_client.put(nextPath.slice(nextPath.lastIndexOf('/')+1), file.path)
                    src = al_client.generateObjectUrl(nextPath.slice(nextPath.lastIndexOf('/')+1))
                    await fs.unlinkSync(file.path) //删除临时存储文件
                    
                    const old_src = await new Promise((res,rej)=>{
                        const sql = `select imgSrc from PRODUCT_LIST where id = '${requestData.id }'`
                        threadpool.query(sql, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    })
                    if(old_src&&old_src[0]){
                        await al_client.delete(old_src[0].imgSrc.slice(old_src[0].imgSrc.lastIndexOf('/')+1))
                    }
                }
            }

            // 插入和替换新的产品表数据
            await new Promise((res,rej)=>{
                const sql = `replace into PRODUCT_LIST(id, typeID, imgSrc, descript, updateTime, detail, list_name, recommend, seo_con, has_spec, stock, price)
                            values('${p_id}','${requestData.typeId}','${src}','${requestData.descript}','${new Date().getTime()}', '${requestData.detail}', '${requestData.list_name}', 0, '${requestData.seo_con}', ${requestData.has_spec}, ${requestData.stock}, ${requestData.price})`
                threadpool.query(sql, function (error, results, fields) {
                    if (error) {
                        throw error
                    };
                    res(results)
                });
            })

            // 旧的产品表关联所有规格关闭
            await db.query(`update spec_name set is_used = 0 where p_id = '${p_id}'`)
            // 旧的规格表对应所有规格选项关闭
            await db.query(`update spec_value set is_used = 0 where spec_name_id in (${requestData.spec_arr.reduce((pre,cur)=> pre + ',' + cur.spec_name_id, 0)})`)
            // 旧的产品表关联所有sku关闭
            await db.query(`update product_sku set is_used = 0 where p_id = '${p_id}'`)

            //  如果不含有规格
            if(!requestData.has_spec){
                ctx.body = JSON.stringify({
                    code: 200,
                    data: 1
                })
                reload()
                return
            }
            
            // 插入新的规格数据
            for(var i=0; i<requestData.spec_arr.length; i++){
                const spec_name_id = requestData.spec_arr[i].spec_name_id || 0

                if(spec_name_id){
                    await db.query(`update spec_name set value = '${requestData.spec_arr[i].spec_name}', is_used = 1 where spec_name_id = ${spec_name_id}`)
                    for(var j=0; j<requestData.spec_arr[i].spec_value_arr.length; j++){
                        const __ = requestData.spec_arr[i].spec_value_arr[j]
                        if(__.spec_value_id){
                             await db.query(`update spec_value set value = '${__.spec_value}', is_used = 1 where spec_value_id = ${__.spec_value_id}`)
                        }
                        else{
                             const [results, connection] = await db.connection(`insert into spec_value(spec_name_id, value) values(${spec_name_id}, '${__.spec_value}')`);
                             const [results1, connection1] = await db.use_connection(connection,`SELECT LAST_INSERT_ID() as id`);
                             connection1.release();
                             const ID = results1[0].id;
                             __.spec_value_id = ID
                        }
                    }
                }
                else{

                    const [results, connection] = await db.connection(`insert into spec_name(p_id, value) values('${p_id}', '${requestData.spec_arr[i].spec_name}')`);
                    const [results1, connection1] = await db.use_connection(connection,`SELECT LAST_INSERT_ID() as id`);
                    connection1.release();
                    const ID = results1[0].id
                    requestData.spec_arr[i].spec_name_id = ID
                    for(var j=0; j<requestData.spec_arr[i].spec_value_arr.length; j++){
                        const __ = requestData.spec_arr[i].spec_value_arr[j]
                        const [results, connection] = await db.connection(`insert into spec_value(spec_name_id, value) values(${ID}, '${__.spec_value}')`);
                        const [results1, connection1] = await db.use_connection(connection,`SELECT LAST_INSERT_ID() as id`);
                        connection1.release();
                        const ID2 = results1[0].id
                        __.spec_value_id = ID2
                    }
                }
            };

            // 插入sku 组合数据
            for(var i=0; i<requestData.spec_data.length; i++){
                const item = requestData.spec_data[i];

                item.spec_comp.forEach(_=>{
                    if(!_.spec_name_id || !_.spec_value_id){
                        for(var i=0; i<requestData.spec_arr.length; i++){
                            if(requestData.spec_arr[i].spec_name == _.spec_name){
                                _.spec_name_id = requestData.spec_arr[i].spec_name_id;
                                for(var j=0; j<requestData.spec_arr[i].spec_value_arr.length; j++){
                                    if(requestData.spec_arr[i].spec_value_arr[j].spec_value == _.spec_value){
                                        _.spec_value_id = requestData.spec_arr[i].spec_value_arr[j].spec_value_id
                                    }
                                }
                            }
                        }
                    }
                })

                if(item.sku_id){
                    await db.query(`update product_sku set price = ${item.price}, stock = ${item.stock}, spec_data = '${JSON.stringify(item.spec_comp)}', is_used = 1 where sku_id = ${item.sku_id}`)
                }
                else {
                    await db.query(`insert into product_sku(p_id, price, stock, spec_data) values('${p_id}', ${item.price}, ${item.stock}, '${JSON.stringify(item.spec_comp)}')`)
                }
            }

            ctx.body = JSON.stringify({
                code: 200,
                data: 1
            })
            reload()
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

            await al_client.delete(imgSrc.slice(imgSrc.lastIndexOf('/')+1))
            ctx.body = JSON.stringify({
                code: 200,
                data:1
            })
            reload()
        }
        catch(err){
            console.log(err)
            ctx.body = JSON.stringify({
                code: 500,
                data: ''
            })
        }
    })

    // ———————————————————————————————————推荐相关分割线————————————————————————————————————————————————————————————————
    
    /**
     * 获取所有产品列表进行选择推荐
     */
    router.get('/houtai/recommendmanage/get_all_product_list', async (ctx) =>{ 
        try{
            const { list_name, descript, detail, page, perpage } = ctx.request.query
            const sql = `SELECT SQL_CALC_FOUND_ROWS * from product_list
                        where list_name like '%${list_name}%' AND descript like '%${descript}%' AND detail like '%${detail}%' 
                        limit ${(page-1)*perpage},${perpage}`

            const list_with_count = await new Promise((reso,reje)=>{
                threadpool.getConnection(async function(err, connection) {
                    if (err) throw err; // not connected!
    
                    const product_list = await new Promise((res,rej)=>{
                        connection.query(sql, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                        
                    })
        
                    const count = await new Promise((res,rej)=>{
                        connection.query('select FOUND_ROWS()', function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    })

                    connection.release();
                    reso({
                        list: product_list,
                        count: count[0]['FOUND_ROWS()']
                    })
                });
            })

            ctx.body = JSON.stringify({
                code: 200,
                total: list_with_count.count,
                data: list_with_count.list
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

    /**
     * 获取推荐商品的列表，现在只有6个
     */
    router.get('/houtai/recommendmanage/get_recommend_product_list', async (ctx) =>{
        try{
            const { list_name, descript, detail, page, perpage } = ctx.request.query
            const sql = `SELECT SQL_CALC_FOUND_ROWS * from product_list
                        where list_name like '%${list_name}%' AND descript like '%${descript}%' AND detail like '%${detail}%' AND recommend = 1 
                        limit ${(page-1)*perpage},${perpage}`

            const list_with_count = await new Promise((reso,reje)=>{
                threadpool.getConnection(async function(err, connection) {
                    if (err) throw err; // not connected!
    
                    const product_list = await new Promise((res,rej)=>{
                        connection.query(sql, function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                        
                    })
        
                    const count = await new Promise((res,rej)=>{
                        connection.query('select FOUND_ROWS()', function(error, results, fields){
                            if(error){
                                throw error
                            }
                            res(results)
                        })
                    })

                    connection.release();
                    reso({
                        list: product_list,
                        count: count[0]['FOUND_ROWS()']
                    })
                });
            })

            ctx.body = JSON.stringify({
                code: 200,
                total: list_with_count.count,
                data: list_with_count.list
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
    
    /**
     * 改变某一商品的推荐状态
     */
    router.post('/houtai/recommendmanage/change_recommend_status', async (ctx) =>{
        try{
            const {id, flag} = ctx.request.body

            if(flag == 1){
                const judge_sql = `select count(*) as count from product_list where recommend = 1`
                
                const count  = await new Promise((res,rej)=>{
                    threadpool.query(judge_sql, function(error, results, fields){
                        if(error){
                            throw error
                        }
                        res(results)
                    })
                })
                if(count[0].count > 5){
                    ctx.body = JSON.stringify({
                        code: 3,
                        data:0,
                        msg:'最多添加6个推荐商品'
                    })
                    return
                }

            }

            const sql = `update product_list set recommend = ${flag} where id = '${id}'`
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
            reload()
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