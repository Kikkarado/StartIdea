import Vue from 'vue'
import Vuex from 'vuex'

import common from './common'
import user from './user'
import profile from './profile'
import info from './info'
import startup from './startup'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    profile,
    info,
    startup
  }
})
