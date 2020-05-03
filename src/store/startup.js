import firebase from 'firebase/app'

import Startup from './startup_help'

export default {
  state: {
    startup: {}
  },
  mutations: {
    newStartUp (state, payload) {
      state.startup = payload
    }
  },
  actions: {
    async newStartUp ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const newStartUp = new Startup(
          payload.title,
          payload.description,
          payload.cost,
          payload.comleted,
          payload.raisedfunds,
          getters.user.id
        )
        const startup = await firebase.database().ref('startups').push(newStartUp)
        const userID = firebase.auth().currentUser.uid
        await firebase.database().ref('Users').child(userID).child('openstartup').set(1)
        // Send mutation
        commit('newStartUp', {
          ...newStartUp,
          id: startup.key
        })
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
    startup (state, getters) {
      return state.startup.filter(prof => {
        return prof.user === getters.user.id
      })
    }
  }
}
