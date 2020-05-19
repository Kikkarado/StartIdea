import firebase from 'firebase/app'
import Startup from './startup_help'

export default {
  state: {
    profileInfo: {},
    statusUs: null,
    startupsOn: null,
    startupsUser: [],
    startupsAll: []
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
      state.startupsUser = payload
    },
    completeStartup (state, {id, completed}) {
      const strp = state.startupsUser.find(t => {
        return t.id === id
      })
      strp.completed = completed
    },
    setAllStartups (state, payload) {
      state.startupsAll = payload
    },
    donationStartup (state, {id, raisedfunds}) {
      const strp = state.startupsAll.find(t => {
        return t.id === id
      })
      strp.raisedfunds = raisedfunds
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
    async fetchStartupsUser ({commit}) {
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
    },
    async completeStartup ({commit}, {id, completed}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        await firebase.database().ref('startups').child(id).update({completed})
        const userID = firebase.auth().currentUser.uid
        await firebase.database().ref('Users').child(userID).child('openstartup').set(0)
        // Send mutation
        commit('completeStartup', {id, completed})
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchAllStartups ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const startup = await firebase.database().ref('startups').once('value')
        const startups = startup.val()
        const allStartupsArray = []
        Object.keys(startups).forEach(key => {
          const s = startups[key]
          allStartupsArray.push(
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
        })
        commit('setAllStartups', allStartupsArray)
        commit('setLoading', false)
        console.log(allStartupsArray)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async donationStartup ({commit}, {id, raisedfunds}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const raisedfundsStart = (await firebase.database().ref('startups').child(id).child('raisedfunds').once('value')).val()
        const comp = (await firebase.database().ref('startups').child(id).child('cost').once('value')).val()
        raisedfunds += raisedfundsStart
        await firebase.database().ref('startups').child(id).update({raisedfunds})
        if (raisedfunds >= comp) {
          const completed = true
          await firebase.database().ref('startups').child(id).update({completed})
        }
        // Send mutation
        commit('donationStartup', {id, raisedfunds})
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    info: s => s.profileInfo,
    status: s => s.statusUs,
    openstartup: s => s.startupsOn,
    startupsUser (state, getters) {
      return state.startupsUser
    },
    startupNotCompleted (getters) {
      return getters.startupsUser.filter(stups => {
        return stups.completed === false
      })
    },
    startupCompleted (getters) {
      return getters.startupsUser.filter(stups => {
        return stups.completed
      })
    },
    startupsAll (getters) {
      return getters.startupsAll.filter(stups => {
        return stups.completed === false
      })
    }
  }
}
