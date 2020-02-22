import axios from 'axios'
import cookies from 'js-cookie'

export const authentication = {
  state: {
    user: null,
    roles: null,
    hasPermissions: false,
    permissions: null,
    tokens: null,
  },
  mutations: {
    LOGIN_SUCCESS (state, data) {
      state.user = data.user
      state.roles = data.roles
      state.hasPermissions = data.permissions.has
      state.permissions = data.permissions.data
      state.token = data.token
    },
    RESET (state) {
      state.user = null
      state.roles = null
      state.hasPermissions = false
      state.permissions = null
      state.token = null
      delete axios.defaults.headers.common.Authorization
    },
  },
  actions: {
    login ({ commit }, data) {
      return axios.post('auth/login', data)
        .then(res => {
          commit('LOGIN_SUCCESS', res.data)
          axios.defaults.headers.common.Authorization = 'Bearer ' + res.data.token
          cookies.set('x-access-token', res.data.token, { expires: data.rememberMe ? 365 : 1 })
          return res
        })
    },
    logout ({ commit }) {
      commit('RESET')
      delete axios.defaults.headers.common.Authorization
      cookies.remove('x-access-token')
    },
  },
}
