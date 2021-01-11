import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      if (!payload) {
        state.user = payload
      } else {
        state.user = decode(payload).data
        router.push({ name: 'Notes' })
      }
    }
  },
  actions: {
    setToken({ commit }, token) {
      localStorage.setItem('token', token)
      commit('setToken', token)
    },
    logOut({ commit }) {
      localStorage.removeItem('token')
      commit('setToken', null)
      router.push({ name: 'Login' })
    },
    getToken({ commit }) {
      const token = localStorage.getItem('token')
      commit('setToken', token)
    }
  },
  getters: {
    activeUser: state => {
      return !!state.user;
    }
  },
  modules: {
  }
})
