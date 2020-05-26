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
        const date = new Date()
        var month = date.getUTCMonth() + 2
        var year
        var add
        if (month > 11) {
          add = Math.round(2 / 11)
          month = Math.round(11 % 2)
          year = date.getUTCFullYear() + add
        } else {
          year = date.getUTCFullYear()
        }
        const deadline = year + '.' + month + '.' + (date.getUTCDate()) + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
        // Use helped class
        const newStartUp = new Startup(
          payload.title,
          payload.shortdescription,
          payload.fulldescription,
          payload.cost,
          payload.completed,
          payload.raisedfunds,
          deadline,
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
