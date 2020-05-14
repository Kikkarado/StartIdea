import firebase from 'firebase/app'
import Startup from './startup_help'

export default {
  state: {
    profileInfo: {},
    statusUs: null,
    startupsOn: null,
    startups: []
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
    },
    setOpStatrup (state, startupsOn) {
      state.startupsOn = startupsOn
    },
    setStartups (state, payload) {
      state.startups = payload
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
    },
    async fetchActiveStartup ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const userID = firebase.auth().currentUser.uid
        const startupsOn = (await firebase.database().ref('Users/' + userID + '/openstartup/').once('value')).val()
        commit('setOpStatrup', startupsOn)
        commit('setLoading', false)
        console.log('openstartup ' + startupsOn)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async fetchStartups ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const startup = await firebase.database().ref('startups').once('value')
        const startups = startup.val()
        const userID = firebase.auth().currentUser.uid
        const startupsArray = []
        Object.keys(startups).forEach(key => {
          const s = startups[key]
          if (s.user === userID) {
            startupsArray.push(
              new Startup(
                s.title,
                s.description,
                s.cost,
                s.completed,
                s.raisedfunds,
                s.user,
                key
              )
            )
          }
        })
        commit('setStartups', startupsArray)
        commit('setLoading', false)
        console.log(startupsArray)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    }
  },
  getters: {
    info: s => s.profileInfo,
    status: s => s.statusUs,
    openstartup: s => s.startupsOn,
    startups (state, getters) {
      return state.startups.filter(stups => {
        return stups.user === getters.user.id
      })
    },
    startupNotCompleted (state, getters) {
      return getters.startups.filter(task => {
        return task.completed
      })
    },
    startupCompleted (state, getters) {
      return getters.startups.filter(task => {
        return task.completed === false
      })
    }
  }
}
