import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/components/Home'
import MyProfile from '@/components/Profile/MyProfile'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'
import ResetPassword from '@/components/Auth/ResetPassword'
import AddDataProfile from '@/components/Profile/AddDataProfile'
import MyStartUps from '@/components/StartUps/MyStartUps'
import AddStartUp from '@/components/StartUps/AddStartUp'
import Startup from '@/components/StartUps/Startup'
import UserProfile from '@/components/Profile/UserProfile'
import Users from '@/components/Users/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/startup/:id',
      name: 'startup',
      component: Startup,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next('/login')
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: MyProfile,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next('/login')
      }
    },
    {
      path: '/userprofile/:id',
      name: 'userprofile',
      component: UserProfile,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next('/login')
      }
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
      component: AddDataProfile,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next('/login')
      }
    },
    {
      path: '/myStartUps',
      name: 'myStartUps',
      component: MyStartUps,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next('/login')
      }
    },
    {
      path: '/addStartUp',
      name: 'addStartUp',
      component: AddStartUp,
      beforeEnter (to, from, next) {
        store.getters.checkUser ? next() : next('/login')
        store.getters.openstartup === 0 ? next() : next('/myStartUps')
      }
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    }
  ]
})
