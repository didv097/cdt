import axios from 'axios'
import cookies from 'js-cookie'

export const authentication = {
  state: {
    user: {},
    roles: [],
    hasPermissions: false,
    permissions: {},
    tokens: null,
  },
  mutations: {
    SET_USER (store, data) {
      store.user = data
      if (data) {
        store.user.full_name = data.first_name + ' ' + data.last_name
      }
    },
    SET_ROLES (store, data) {
      store.roles = data
    },
    SET_PERMISSIONS (store, data) {
      store.hasPermissions = data.has
      store.permissions = data.data
    },
    SET_TOKEN (store, data) {
      store.token = data
    },
    RESET (state) {
      state.user = {}
      state.roles = []
      state.hasPermissions = false
      state.permissions = {}
      state.token = null
      delete axios.defaults.headers.common.Authorization
    },
  },
  actions: {
    async login ({ commit }, data) {
      const res = await axios.post('auth/login', data)
      commit('SET_USER', res.data.user)
      commit('SET_ROLES', res.data.roles)
      commit('SET_PERMISSIONS', res.data.permissions)
      commit('SET_TOKEN', res.data.token)
      axios.defaults.headers.common.Authorization = 'Bearer ' + res.data.token
      cookies.set('x-access-token', res.data.token, { expires: data.rememberMe ? 365 : 1 })
      return res
    },
    logout ({ commit }) {
      commit('RESET')
      delete axios.defaults.headers.common.Authorization
      cookies.remove('x-access-token')
    },
    check ({ commit }, token) {
      if (token) {
        axios.defaults.headers.common.Authorization = 'Bearer ' + token
        axios.post('auth/me')
          .then(res => {
            commit('SET_USER', res.data.user)
            commit('SET_ROLES', res.data.roles)
            commit('SET_PERMISSIONS', res.data.permissions)
            commit('SET_TOKEN', token)
            return res
          }).catch(error => {
            commit('RESET')
            return error
          })
      }
    },
  },
}
