import Vue from 'vue'
import Vuex from 'vuex'

import { sidebar } from './sidebar.module'
import { authentication } from './authentication.module'
import { menuitems } from './menuitems.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sidebar,
    authentication,
    menuitems,
  },
})
