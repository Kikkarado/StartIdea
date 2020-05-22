import firebase from 'firebase/app'

import Profile from './profile_help'

import User from './user_help'

export default {
  state: {
    user: ''
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    async registerUser ({commit}, {email, password, fname, sname, status, openstartup}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const aboutme = ''
        const phone = ''
        const dayofbirth = ''
        const monthofbirth = ''
        const yearofbirth = ''
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        const addUserData = new Profile(
          fname,
          sname,
          status,
          openstartup,
          aboutme,
          email,
          phone,
          dayofbirth,
          monthofbirth,
          yearofbirth
        )
        const userID = user.user.uid
        await firebase.database().ref('Users').child(userID).set(addUserData)
        // Send mutation
        commit('setUser', new User(user.user.uid))
        commit('setUser', addUserData)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async loginUser ({commit}, {email, password}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password)
        commit('setUser', new User(user.user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async resetPassword ({commit}, {email}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.auth().sendPasswordResetEmail(email)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    loggedUser ({commit}, payload) {
      commit('setUser', new User(payload.uid))
      console.log(payload.uid)
    },
    logoutUser ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      console.log('User ' + state.user)
      return state.user
    },
    checkUser (state) {
      console.log('User ' + state.user)
      return state.user !== null
    }
  }
}
