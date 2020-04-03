import firebase from 'firebase/app'

import Profile from './profile_help'

export default {
  state: {
    profile: {}
  },
  mutations: {
    addUserData (state, payload) {
      state.profile = payload
    }
  },
  actions: {
    async addUserData ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const addUserData = new Profile(
          payload.fname,
          payload.sname,
          payload.status
        )
        const rootRef = firebase.database().ref('Users')
        const userID = firebase.auth().currentUser.uid
        const usersRef = rootRef.child(userID)
        await usersRef.set(addUserData)
        // Send mutation
        commit('addUserData', new Profile(payload.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    // Get user All Tasks
    profile (state, getters) {
      return state.profile.filter(prof => {
        return prof.user === getters.user.id
      })
    }
  }
}
