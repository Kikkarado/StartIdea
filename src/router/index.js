import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/components/Home'
import Profile from '@/components/Profile/Profile'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'
import ResetPassword from '@/components/Auth/ResetPassword'
import AddDataProfile from '@/components/Profile/AddDataProfile'
import MyStartUps from '@/components/StartUps/MyStartUps'
import AddStartUp from '@/components/StartUps/AddStartUp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next()
        // if (store.getters.sheckUser) {
        //   next()
        // } else {
        //   next('/login')
        // }
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next()
      }
    },
    {
      path: '/profile/:id', component: Profile
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      component: ResetPassword
    },
    {
      path: '/addDataProfile',
      name: 'addDataProfile',
      component: AddDataProfile
    },
    {
      path: '/myStartUps',
      name: 'myStartUps',
      component: MyStartUps
    },
    {
      path: '/addStartUp',
      name: 'addStartUp',
      component: AddStartUp
    }
  ]
})
