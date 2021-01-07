import VueRouter from "vue-router"

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/houtai/productmanage'
        },
        {
            path: '/houtai',
            component: () => import("houtai/components/houtai.vue"),
            children: [
                {
                    path: '/houtai/productmanage',
                    component: () => import('houtai/components/productmanage/product_type_list.vue')
                },
                {
                    path: '/houtai/recommendmanage',
                    component: () => import('houtai/components/recommendmanage/recommend_manage_list.vue')
                },
                {
                    path: '/houtai/newsmanage',
                    component: () => import('houtai/components/news/news_list.vue')
                },
                {
                    path: '/houtai/userRecord',
                    component: () => import('houtai/components/userRecord/user_record.vue')
                },{
                    path: '/houtai/producttypemanage',
                    component: () => import('houtai/components/producttypemanage/product_type_list.vue')
                }
            ]
        },
        {
            path: '/login',
            component: () => import("houtai/components/admin/login.vue")
        }
    ]
})