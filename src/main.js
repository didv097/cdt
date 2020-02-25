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
import store from './store/index'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VuetifyConfirm from 'vuetify-confirm'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker'

import axios from 'axios'
import cookies from 'js-cookie'

axios.defaults.baseURL = 'https://cdt-api-dev.httpsolutions.com/api/'
const token = cookies.get('x-access-token')
if (token) {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token
} else {
  delete axios.defaults.headers.common.Authorization
}

Vue.config.productionTip = false

Vue.use(VuetifyConfirm, { vuetify })
Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)
Vue.component('v-rotated-marker', Vue2LeafletRotatedMarker)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
