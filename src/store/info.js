import firebase from 'firebase/app'

export default {
  state: {
    profileInfo: {},
    statusUs: null
  },
  mutations: {
    setInfo (state, profileInfo) {
      state.profileInfo = profileInfo
    },
    clearInfo (state) {
      state.profileInfo = {}
    },
    setStatus (state, statusUs) {
      state.statusUs = statusUs
    }
  },
  actions: {
    async fetchInfo ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const userID = firebase.auth().currentUser.uid
        const profileInfo = (await firebase.database().ref('Users/' + userID).once('value')).val()
        commit('setInfo', profileInfo)
        commit('setLoading', false)
        console.log(profileInfo)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async fetchStatus ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const userID = firebase.auth().currentUser.uid
        const statusUs = (await firebase.database().ref('Users/' + userID + '/status/').once('value')).val()
        commit('setStatus', statusUs)
        commit('setLoading', false)
        console.log(statusUs)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    }
  },
  getters: {
    info: s => s.profileInfo,
    status: s => s.statusUs
  }
}
