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
import './plugins/leaflet.canvas-markers'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VuetifyConfirm from 'vuetify-confirm'
import VueClipboard from 'vue-clipboard2'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen'
import 'leaflet-easybutton/src/easy-button.css'
import 'leaflet-easybutton/src/easy-button'
import 'leaflet-velocity/dist/leaflet-velocity.min.css'
import 'leaflet-velocity/dist/leaflet-velocity.min'

import axios from 'axios'
import cookies from 'js-cookie'

axios.defaults.baseURL = 'https://cdt-api-dev.httpsolutions.com/api/'
const token = cookies.get('x-access-token')
if (token) {
  store.dispatch('check', token)
    .then(() => {
      store.dispatch('initMenuItems')
    })
}

Vue.config.productionTip = false

Vue.use(VuetifyConfirm, { vuetify })
Vue.use(VueClipboard)
Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)
Vue.component('v-rotated-marker', Vue2LeafletRotatedMarker)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
