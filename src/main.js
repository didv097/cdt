// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

import axios from 'axios'
// import cookies from 'js-cookie'

axios.defaults.baseURL = 'http://35.184.79.169/api/'
axios.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8zNS4xODQuNzkuMTY5XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNTgwMzA5Nzk4LCJleHAiOjE1ODgxOTM3OTgsIm5iZiI6MTU4MDMwOTc5OCwianRpIjoiTlBXRHRrOEpjRDZQOGkwbSIsInN1YiI6MSwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.ZS2RroktCTAbuo5ReQCg2L0Jl9Jk04yu24-IT8YT7j4'
// console.log(cookies)
// const token = cookies.get('x-access-token')
// console.log(token)
// if (token) {
//   axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
// } else {
//   delete axios.defaults.headers.common['Authorization']
// }

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
