import VueRouter from "vue-router"

export default new VueRouter({
    routes:[
        {
            path: '/houtai',
            component: () => import("houtai/components/houtai.vue"),
            children:[
                {
                    path: '/houtai/productmanage',
                    component: () => import('houtai/components/productmanage/product_type_list.vue')
                }
            ]
        },
    ]
})