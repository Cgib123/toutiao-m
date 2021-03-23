import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 一个对象储存当前登陆用户信息（token等数据）
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 防止刷新后数据丢失，将数据备份到本地储存
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  }
})
