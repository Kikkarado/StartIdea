// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(
  Vuelidate,
  Uimini
)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    var firebaseConfig = {
      apiKey: 'AIzaSyCIEfQCll5EPybsu2zR8vngIxHYRbme86Q',
      authDomain: 'start-idea-37f3a.firebaseapp.com',
      databaseURL: 'https://start-idea-37f3a.firebaseio.com',
      projectId: 'start-idea-37f3a',
      storageBucket: 'gs://start-idea-37f3a.appspot.com',
      messagingSenderId: '270112436901',
      appId: '1:270112436901:web:7cdcd6b692bc95a7c7d34c'
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('loggedUser', user)
        this.$store.dispatch('fetchInfo')
        this.$store.dispatch('fetchStatus')
        this.$store.dispatch('fetchActiveStartup')
        this.$store.dispatch('fetchStartupsUser')
        this.$store.dispatch('fetchDonations')
        this.$store.dispatch('infoStartup')
        this.$store.dispatch('infoUser')
        this.$store.dispatch('fetchAllUsers')
      }
      this.$store.dispatch('fetchAllStartups')
    })
  }
})
