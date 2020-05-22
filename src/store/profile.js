import firebase from 'firebase/app'

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
    async addUserData ({commit}, {fname, sname, dayofbirth, monthofbirth, yearofbirth, email, phone, aboutme}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const userID = firebase.auth().currentUser.uid
        const addProf = await firebase.database().ref('Users').child(userID).update({fname, sname, dayofbirth, monthofbirth, yearofbirth, email, phone, aboutme})
        // Send mutation
        commit('addUserData', addProf)
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
