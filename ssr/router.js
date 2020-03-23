import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { 
        path: '/buy/:id', 
        redirect:'/buy/:id/contrast',
        component: () => import('./components/buy/buy.vue'),
        children:[
          { 
            name:'contrast', 
            path: '/buy/:id/contrast', 
            component: () => import('./components/buy/contrast.vue') 
          },
          { 
            name:'descript', 
            path: '/buy/:id/descript', 
            component: () => import('./components/buy/descript.vue') 
          },
        ]
      },
    ]
  })
}