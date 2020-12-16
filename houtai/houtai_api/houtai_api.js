const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

module.exports = function (router, threadpool, reload, al_client) {
      router.get('/houtai/productmanage/get_type_list', async (ctx) => {
            try {
                  const { page = 1, perpage = 10, name = '', descript = '', sort = '' } = ctx.query;
                  const sql = `SELECT * FROM PRODUCT_TYPE
                        WHERE name like '%${name}%' AND descript like '%${descript}%' ${sort ? `AND sort = ${sort}` : ''}
                        order by sort
                        limit ${(page - 1) * perpage},${perpage}`
                  const sql1 = `select FOUND_ROWS()`

                  const list_with_count = await new Promise((reso, reje) => {
                        threadpool.getConnection(async function (err, connection) {
                              if (err) throw err; // not connected!

                              const type_list = await Promise.all((await new Promise((res, rej) => {
                                    connection.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          };
                                          res(results)
                                    });
                              }))
                                    .map(async _ => {
                                          return {
                                                ..._,
                                                src: _.src
                                          }
                                    }))

                              const count = await new Promise((res, rej) => {
                                    connection.query(sql1, function (error, results, fields) {
                                          if (error) {
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
                        total: list_with_count.count,
                        data: list_with_count.list
                  })
            }
            catch (err) {
                  ctx.body = JSON.stringify({
                        code: 500,
                        data: ''
                  })
            }
      })
      router.post('/houtai/productmanage/change_type_info', async (ctx) => {
            try {
                  const file = ctx.request.files && ctx.request.files.file
                  const { name, descript, sort, id } = ctx.request.body
                  let src = ctx.request.body.file
                  if (file) {
                        var path = file.path.replace(/\\/g, '/');
                        var fname = file.name;
                        var nextPath = '';
                        if (file.size > 0 && path) {
                              var extArr = fname.split('.');
                              var ext = extArr[extArr.length - 1]
                              nextPath = path + '.' + ext;
                              await al_client.put(nextPath.slice(nextPath.lastIndexOf('/') + 1), file.path)
                              src = await al_client.generateObjectUrl(nextPath.slice(nextPath.lastIndexOf('/') + 1)).replace('http', 'https')
                              await fs.unlinkSync(file.path) //删除临时存储文件

                              const old_src = await new Promise((res, rej) => {
                                    const sql = `select src from PRODUCT_TYPE where id = '${id}'`
                                    threadpool.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })
                              })
                              if (old_src && old_src[0]) {
                                    await al_client.delete(old_src[0].src.slice(old_src[0].src.lastIndexOf('/') + 1))
                              }
                        }
                  }
                  console.log(id, src)
                  await new Promise((res, rej) => {
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
            catch (err) {
                  console.log(err)
                  ctx.body = JSON.stringify({
                        code: 500,
                        data: ''
                  })
            }
      }),
            router.post('/houtai/productmanage/delete_type', async (ctx) => {
                  try {
                        const { id, src } = ctx.request.body
                        const sql = `delete from product_type where id = '${id}'`;

                        await new Promise((res, rej) => {
                              threadpool.query(sql, function (error, results, fields) {
                                    if (error) {
                                          throw error
                                    }
                                    res(results)
                              })
                        })
                        await al_client.delete(src.slice(src.lastIndexOf('/') + 1))


                        const products = await new Promise((res, rej) => {
                              const sql = `select imgSrc from product_list where typeID = '${id}'`;
                              threadpool.query(sql, function (error, results, fields) {
                                    if (error) {
                                          throw error
                                    }
                                    res(results)
                              })
                        })

                        console.log(products);

                        products.forEach(async _ => {
                              await al_client.delete(_.imgSrc.slice(src.lastIndexOf('/') + 1))
                        })

                        await new Promise((res, rej) => {
                              const sql = `delete from product_list where typeId = '${id}'`;
                              threadpool.query(sql, function (error, results, fields) {
                                    if (error) {
                                          throw error
                                    }
                                    res(results)
                              })
                        })


                        ctx.body = JSON.stringify({
                              code: 200,
                              data: 1
                        })
                        reload()
                  }
                  catch (err) {
                        console.log(err)
                        ctx.body = JSON.stringify({
                              code: 500,
                              data: ''
                        })
                  }
            })


      // 子分类相关接口
      router.get('/houtai/productmanage/get_product_list', async (ctx) => { // 子产品列表
            try {
                  const { typeId, list_name = '', descript = '', beginTime = 0, endTime = 9999999999999, page = 1, perpage = 10 } = ctx.query;

                  const sql = `SELECT SQL_CALC_FOUND_ROWS * FROM PRODUCT_LIST
                        WHERE typeID = '${typeId}' AND list_name like '%${list_name}%' AND descript like '%${descript}%'
                        AND updateTime BETWEEN ${beginTime || 0} AND ${endTime || 9999999999999}
                        limit ${(page - 1) * perpage},${perpage}`
                  const sql1 = `select FOUND_ROWS()`

                  const list_with_count = await new Promise((reso, reje) => {
                        threadpool.getConnection(async function (err, connection) {
                              if (err) throw err; // not connected!

                              const product_list = await Promise.all((await new Promise((res, rej) => {
                                    connection.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })
                              }))
                                    .map(async _ => {
                                          return {
                                                ..._,
                                                imgSrc: _.imgSrc
                                          }
                                    }))

                              const count = await new Promise((res, rej) => {
                                    connection.query(sql1, function (error, results, fields) {
                                          if (error) {
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
            catch (err) {
                  console.log(err)
                  ctx.body = JSON.stringify({
                        code: 500,
                        data: err
                  })
            }
      })

      router.post('/houtai/productmanage/change_product_info', async (ctx) => { // 添加和修改某分类下产品
            try {
                  const file = ctx.request.files && ctx.request.files.file
                  const { list_name = '', descript = '', detail = '', id = '', typeId = '' } = ctx.request.body
                  let src = ctx.request.body.file
                  if (file) {
                        var path = file.path.replace(/\\/g, '/');
                        var fname = file.name;
                        var nextPath = '';
                        if (file.size > 0 && path) {
                              var extArr = fname.split('.');
                              var ext = extArr[extArr.length - 1]
                              nextPath = path + '.' + ext;
                              await al_client.put(nextPath.slice(nextPath.lastIndexOf('/') + 1), file.path)
                              src = al_client.generateObjectUrl(nextPath.slice(nextPath.lastIndexOf('/') + 1)).replace('http', 'https')
                              await fs.unlinkSync(file.path) //删除临时存储文件

                              const old_src = await new Promise((res, rej) => {
                                    const sql = `select imgSrc from PRODUCT_LIST where id = '${id}'`
                                    threadpool.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })
                              })
                              if (old_src && old_src[0]) {
                                    await al_client.delete(old_src[0].imgSrc.slice(old_src[0].imgSrc.lastIndexOf('/') + 1))
                              }
                        }
                  }

                  await new Promise((res, rej) => {
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
                  reload()
            }
            catch (err) {
                  console.log(err)
                  ctx.body = JSON.stringify({
                        code: 500,
                        data: err
                  })
            }
      })

      router.post('/houtai/productmanage/delete_product', async (ctx) => { // 删除某分类id 下的产品
            try {
                  const { id, typeId, imgSrc } = ctx.request.body
                  const sql = `delete from product_list where id = '${id}' AND typeID = '${typeId}'`;

                  await new Promise((res, rej) => {
                        threadpool.query(sql, function (error, results, fields) {
                              if (error) {
                                    throw error
                              }
                              res(results)
                        })
                  })

                  await al_client.delete(imgSrc.slice(imgSrc.lastIndexOf('/') + 1))
                  ctx.body = JSON.stringify({
                        code: 200,
                        data: 1
                  })
                  reload()
            }
            catch (err) {
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
      router.get('/houtai/recommendmanage/get_all_product_list', async (ctx) => {
            try {
                  const { list_name, descript, detail, page, perpage } = ctx.request.query
                  const sql = `SELECT SQL_CALC_FOUND_ROWS * from product_list
                        where list_name like '%${list_name}%' AND descript like '%${descript}%' AND detail like '%${detail}%'
                        limit ${(page - 1) * perpage},${perpage}`

                  const list_with_count = await new Promise((reso, reje) => {
                        threadpool.getConnection(async function (err, connection) {
                              if (err) throw err; // not connected!

                              const product_list = await new Promise((res, rej) => {
                                    connection.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })

                              })

                              const count = await new Promise((res, rej) => {
                                    connection.query('select FOUND_ROWS()', function (error, results, fields) {
                                          if (error) {
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
            catch (err) {
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
      router.get('/houtai/recommendmanage/get_recommend_product_list', async (ctx) => {
            try {
                  const { list_name, descript, detail, page, perpage } = ctx.request.query
                  const sql = `SELECT SQL_CALC_FOUND_ROWS * from product_list
                        where list_name like '%${list_name}%' AND descript like '%${descript}%' AND detail like '%${detail}%' AND recommend != 0 order by recommend desc
                        limit ${(page - 1) * perpage},${perpage}`

                  const list_with_count = await new Promise((reso, reje) => {
                        threadpool.getConnection(async function (err, connection) {
                              if (err) throw err; // not connected!

                              const product_list = await new Promise((res, rej) => {
                                    connection.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })

                              })

                              const count = await new Promise((res, rej) => {
                                    connection.query('select FOUND_ROWS()', function (error, results, fields) {
                                          if (error) {
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
            catch (err) {
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
      router.post('/houtai/recommendmanage/change_recommend_status', async (ctx) => {
            try {
                  const { id, flag } = ctx.request.body

                  if (flag == 1) {
                        const judge_sql = `select count(*) as count from product_list where recommend = 1`

                        const count = await new Promise((res, rej) => {
                              threadpool.query(judge_sql, function (error, results, fields) {
                                    if (error) {
                                          throw error
                                    }
                                    res(results)
                              })
                        })
                        if (count[0].count > 5) {
                              ctx.body = JSON.stringify({
                                    code: 3,
                                    data: 0,
                                    msg: '最多添加6个推荐商品'
                              })
                              return
                        }

                  }

                  const sql = `update product_list set recommend = ${flag} where id = '${id}'`
                  await new Promise((res, rej) => {
                        threadpool.query(sql, function (error, results, fields) {
                              if (error) {
                                    throw error
                              }
                              res(results)
                        })
                  })

                  ctx.body = JSON.stringify({
                        code: 200,
                        data: 1
                  })
                  reload()
            }
            catch (err) {
                  console.log(err)
                  ctx.body = JSON.stringify({
                        code: 500,
                        data: ''
                  })
            }
      })


      /**新闻相关分割线———————————————————————————————————————————————————— */
      /**
       * 获取所有产品列表进行选择推荐
       */
      router.get('/houtai/newsmanage/get_news_list', async (ctx) => {
            try {
                  console.log('进入')
                  const { title, content, beginTime, endTime, page, perpage } = ctx.request.query
                  const sql = `SELECT SQL_CALC_FOUND_ROWS * from  news
                        where title like '%${title}%' AND content like '%${content}%' AND creationTimestamp between ${beginTime} and ${endTime}
                        limit ${(page - 1) * perpage},${perpage}`

                  const list_with_count = await new Promise((reso, reje) => {
                        threadpool.getConnection(async function (err, connection) {
                              if (err) throw err; // not connected!

                              const news_list = await new Promise((res, rej) => {
                                    connection.query(sql, function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })

                              })

                              const count = await new Promise((res, rej) => {
                                    connection.query('select FOUND_ROWS()', function (error, results, fields) {
                                          if (error) {
                                                throw error
                                          }
                                          res(results)
                                    })
                              })

                              connection.release();
                              reso({
                                    list: news_list,
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
            catch (err) {
                  console.log(err)
                  ctx.body = JSON.stringify({
                        code: 500,
                        data: ''
                  })
            }
      })

}