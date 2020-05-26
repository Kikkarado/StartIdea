import firebase from 'firebase/app'
import Startup from './startup_help'
import Profile from './profile_help'
import Donation from './donation_help'

export default {
  state: {
    profileInfo: {},
    statusUs: null,
    startupsOn: null,
    startupsUser: [],
    startupsAll: [],
    infoStr: {},
    infoUs: {},
    usersAll: [],
    donations: []
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
    },
    infoStartup (state, infoStr) {
      state.infoStr = infoStr
    },
    infoUser (state, infoUs) {
      state.infoUs = infoUs
    },
    setAllUsers (state, payload) {
      state.usersAll = payload
    },
    setDonations (state, payload) {
      state.donations = payload
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
                s.shortdescription,
                s.fulldescription,
                s.cost,
                s.completed,
                s.raisedfunds,
                s.deadline,
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
        window.location.reload('/myStartUps')
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
          const date = new Date()
          const dateDead = date.getUTCFullYear() + '.' + date.getUTCMonth() + '.' + date.getUTCDate() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
          if (new Date(dateDead) >= new Date(s.deadline)) {
            const completed = true
            firebase.database().ref('startups').child(key).update({completed})
            firebase.database().ref('Users').child(s.user).child('openstartup').set(0)
            console.log(s.user)
          }
          const toDeath = Math.round((new Date(s.deadline) - new Date(dateDead)) / (1000 * 60 * 60 * 24))
          allStartupsArray.push(
            new Startup(
              s.title,
              s.shortdescription,
              s.fulldescription,
              s.cost,
              s.completed,
              s.raisedfunds,
              toDeath,
              s.user,
              key
            )
          )
          console.log(Math.round((new Date(s.deadline) - new Date(dateDead)) / (1000 * 60 * 60 * 24)))
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
    async donationStartup ({commit}, {id, raisedfunds, user, title}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const raisedfundsStart = (await firebase.database().ref('startups').child(id).child('raisedfunds').once('value')).val()
        const comp = (await firebase.database().ref('startups').child(id).child('cost').once('value')).val()
        const userID = firebase.auth().currentUser.uid
        const don = await firebase.database().ref('donation').once('value')
        const dons = don.val()
        if (dons === null) {
          const infoDonation = new Donation(
            userID,
            id,
            raisedfunds,
            title
          )
          const donat = firebase.database().ref('donation').push(infoDonation)
          raisedfunds += raisedfundsStart
          firebase.database().ref('startups').child(id).update({raisedfunds})
          if (raisedfunds >= comp) {
            const completed = true
            firebase.database().ref('startups').child(id).update({completed})
            firebase.database().ref('Users').child(user).child('openstartup').set(0)
            console.log({user})
          }
          window.location.reload('/startup/')
          // Send mutation
          commit('donationStartup', {id, raisedfunds})
          commit('donationStartup', {
            ...infoDonation,
            id: donat.key
          })
        } else {
          var find = false
          var Dona = 0
          var keyid = null
          Object.keys(dons).forEach(key => {
            const d = dons[key]
            if (d.uid === userID && d.idstartup === id) {
              find = true
              Dona = d.donation
              keyid = key
            }
          })
          if (find) {
            find = true
            var donation = Dona
            donation += raisedfunds
            firebase.database().ref('donation').child(keyid).update({donation})
            raisedfunds += raisedfundsStart
            firebase.database().ref('startups').child(id).update({raisedfunds})
            if (raisedfunds >= comp) {
              const completed = true
              firebase.database().ref('startups').child(id).update({completed})
              firebase.database().ref('Users').child(user).child('openstartup').set(0)
              console.log({user})
            }
            window.location.reload('/startup/')
            // Send mutation
            commit('donationStartup', {id, raisedfunds})
          } else {
            const infoDonation = new Donation(
              userID,
              id,
              raisedfunds,
              title
            )
            const donat = firebase.database().ref('donation').push(infoDonation)
            raisedfunds += raisedfundsStart
            firebase.database().ref('startups').child(id).update({raisedfunds})
            if (raisedfunds >= comp) {
              const completed = true
              firebase.database().ref('startups').child(id).update({completed})
              firebase.database().ref('Users').child(user).child('openstartup').set(0)
              console.log({user})
            }
            window.location.reload('/startup/')
            // Send mutation
            commit('donationStartup', {id, raisedfunds})
            commit('donationStartup', {
              ...infoDonation,
              id: donat.key
            })
          }
        }
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async infoStartup ({commit}, {id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const infoStr = (await firebase.database().ref('startups').child(id).once('value')).val()
        // Send mutation
        commit('infoStartup', infoStr)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async infoUser ({commit}, {id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const infoUs = (await firebase.database().ref('Users/' + id).once('value')).val()
        console.log(infoUs)
        // Send mutation
        commit('infoUser', infoUs)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchAllUsers ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.database().ref('Users').once('value')
        const users = user.val()
        const allUsersArray = []
        Object.keys(users).forEach(key => {
          const s = users[key]
          allUsersArray.push(
            new Profile(
              s.fname,
              s.sname,
              s.status,
              s.openstartup,
              s.aboutme,
              s.email,
              s.phone,
              s.dayofbirth,
              s.monthofbirth,
              s.yearofbirth,
              s.id,
              key
            )
          )
        })
        commit('setAllUsers', allUsersArray)
        commit('setLoading', false)
        console.log(allUsersArray)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async fetchDonations ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const donat = await firebase.database().ref('donation').once('value')
        const donats = donat.val()
        const userID = firebase.auth().currentUser.uid
        const donatsArray = []
        Object.keys(donats).forEach(key => {
          const d = donats[key]
          if (d.uid === userID) {
            donatsArray.push(
              new Donation(
                d.uid,
                d.idstartup,
                d.donation,
                d.title
              )
            )
          }
        })
        commit('setDonations', donatsArray)
        commit('setLoading', false)
        console.log('ku' + donatsArray)
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
    },
    infoS: s => s.infoStr,
    infoU: s => s.infoUs,
    usersAll (state, getters) {
      return state.usersAll
    },
    usersStartupers (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Startuper'
      })
    },
    usersInvestors (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Investor'
      })
    },
    usersSpecialists (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Specialist'
      })
    },
    donations (state) {
      return state.donations
    }
  }
}
