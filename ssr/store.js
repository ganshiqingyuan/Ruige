import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
import { getProductInfo } from './request'

export function createStore () {
  return new Vuex.Store({
    state: {
      items: {},
      p_data: ''
    },
    actions: {
      getProductInfo({commit}, id) {
        return getProductInfo({id: id}).then(res=>{
          commit('setProductInfo', res)
        })
      }
    },
    mutations: {
      setProductInfo(state, data){
        state.p_data = data.data
      }
    }
  })
}