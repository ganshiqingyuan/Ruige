module.exports = function(router){
    router.get('/houtai/productmanage/get_type_list', async (ctx) =>{
        const {page, perpage, name, descript, sort} = ctx.query;
        console.log(page,perpage,name,descript,sort)
    })
}