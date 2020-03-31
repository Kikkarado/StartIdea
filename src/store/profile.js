import firebase from 'firebase/app'

import Profile from './profile_help'

export default {
  state: {
    profiles: null
  },
  mutations: {
    loadUserData (state, payload) {
      state.profiles = payload
    },
    addUserData (state, payload) {
      state.profiles.push(payload)
    }
  },
  actions: {
    async loadUserData ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const userID = firebase.auth().currentUser.uid
        const profile = await firebase.database().ref('Users/' + userID).once('value')
        const dataProfile = profile.val()
        const profArr = new Profile(
          this.fname = dataProfile.fname,
          dataProfile.sname,
          dataProfile.status,
          dataProfile.user,
          dataProfile.id
        )
        commit('loadUserData', profArr)
        console.log(dataProfile.fname)
        // Use helped class
        // const addUserData = new Profile(
        //   payload.sname,
        //   payload.fname,
        //   payload.status
        // )
        // Send mutation
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async addUserData ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const addUserData = new Profile(
          payload.sname,
          payload.fname,
          payload.status
        )
        const rootRef = await firebase.database().ref('Users')
        const userID = await firebase.auth().currentUser.uid
        const usersRef = await rootRef.child(userID)
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
    profiles (state, getters) {
      return state.profiles.filter(profile => {
        return profile.user === getters.user.id
      })
    },
    // Get user Completed Tasks
    taskCompleted (state, getters) {
      return getters.profiles.filter(task => {
        return task.completed
      })
    },
    // Get user Active Tasks
    taskNotCompleted (state, getters) {
      return getters.profiles.filter(task => {
        return task.completed === false
      })
    }
  }
}
