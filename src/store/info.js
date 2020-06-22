import firebase from 'firebase/app'
import Startup from './startup_help'
import Profile from './profile_help'
import Donation from './donation_help'

export default {
  state: {
    profileInfo: {},
    statusUs: '',
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
    setStatus (state, payload) {
      state.statusUs = payload
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
    deleteStartup (state, {id}) {
      state.startupsUser.find(t => {
        return t.id === id
      })
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
    clearAllUsers (state) {
      state.usersAll = []
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
                s.approved,
                s.imageUrl1,
                s.imageUrl2,
                s.imageUrl3,
                s.percent,
                s.user,
                key
              )
            )
          }
        })
        commit('setStartups', startupsArray)
        commit('setLoading', false)
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
    async deleteStartup ({commit}, {id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const userID = firebase.auth().currentUser.uid
        await firebase.database().ref('startups').child(id).remove()
          .then(await firebase.database().ref('Users').child(userID).child('openstartup').set(0))
        const img1 = await firebase.storage().ref('startupsImg/' + id + '/' + userID + '1')
        const img2 = await firebase.storage().ref('startupsImg/' + id + '/' + userID + '2')
        const img3 = await firebase.storage().ref('startupsImg/' + id + '/' + userID + '3')
        if (img1 && img2 && img3) {
          return img1.delete() && img2.delete() && img3.delete()
        } else {
          if (img1 && img2 && !img3) {
            return img1.delete() && img2.delete()
          } else {
            if (img1 && !img2 && !img3) {
              return img1.delete()
            } else {
              if (!img1 && !img2 && !img3) {
                return 'Nothing delete'
              } else {
                if (!img1 && !img2 && img3) {
                  return img2.delete()
                } else {
                  if (!img1 && img2 && img3) {
                    return img2.delete() && img3.delete()
                  } else {
                    if (!img1 && img2 && !img3) {
                      return img2.delete()
                    } else {
                      if (img1 && !img2 && img3) {
                        return img1.delete() && img3.delete()
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // Send mutation
        window.location.reload('/myStartUps')
        commit('completeStartup', {id})
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        console.log(error.message)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchAllStartups ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.storage().ref('startupsImg').bucket
        const startup = await firebase.database().ref('startups').once('value')
        const startups = startup.val()
        const allStartupsArray = []
        Object.keys(startups).forEach(async (skey) => {
          const s = startups[skey]
          const date = new Date()
          const dateDead = date.getUTCFullYear() + '.' + date.getUTCMonth() + '.' + date.getUTCDate() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
          if (new Date(dateDead) >= new Date(s.deadline)) {
            const completed = true
            firebase.database().ref('startups').child(skey).update({completed})
            const don = await firebase.database().ref('donation').once('value')
            const dons = don.val()
            var keyid = null
            Object.keys(dons).forEach(dkey => {
              const d = dons[dkey]
              if (d.idstartup === skey) {
                keyid = dkey
              }
            })
            const startupStatus = 'Провалився'
            firebase.database().ref('donation').child(keyid).update({startupStatus})
            firebase.database().ref('Users').child(s.user).child('openstartup').set(0)
          }
          var toDeath = Math.round((new Date(s.deadline) - new Date(dateDead)))
          allStartupsArray.push(
            new Startup(
              s.title,
              s.shortdescription,
              s.fulldescription,
              s.cost,
              s.completed,
              s.raisedfunds,
              toDeath,
              s.approved,
              s.imageUrl1,
              s.imageUrl2,
              s.imageUrl3,
              s.percent,
              s.user,
              skey
            )
          )
        })
        commit('setAllStartups', allStartupsArray)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async donationStartup ({commit}, {id, raisedfunds, user, title, profitDon}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const raisedfundsStart = (await firebase.database().ref('startups').child(id).child('raisedfunds').once('value')).val()
        const comp = (await firebase.database().ref('startups').child(id).child('cost').once('value')).val()
        const userID = firebase.auth().currentUser.uid
        const don = await firebase.database().ref('donation').once('value')
        const dons = don.val()
        var startupStatus = 'Продовжується'
        if (dons === null) {
          const infoDonation = new Donation(
            userID,
            id,
            raisedfunds,
            title,
            profitDon,
            startupStatus
          )
          const donat = firebase.database().ref('donation').push(infoDonation)
          raisedfunds += raisedfundsStart
          firebase.database().ref('startups').child(id).update({raisedfunds})
          if (raisedfunds >= comp) {
            const completed = true
            firebase.database().ref('startups').child(id).update({completed})
            firebase.database().ref('Users').child(user).child('openstartup').set(0)
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
          var Prof = 0
          var keyid = null
          Object.keys(dons).forEach(key => {
            const d = dons[key]
            if (d.uid === userID && d.idstartup === id) {
              find = true
              Dona = d.donation
              Prof = d.profit
              keyid = key
            }
          })
          if (find) {
            find = true
            var donation = Dona
            var profit = Prof
            donation += raisedfunds
            profit += profitDon
            firebase.database().ref('donation').child(keyid).update({donation, profit})
            raisedfunds += raisedfundsStart
            firebase.database().ref('startups').child(id).update({raisedfunds})
            if (raisedfunds >= comp) {
              const completed = true
              startupStatus = 'Успішний'
              firebase.database().ref('startups').child(id).update({completed})
              firebase.database().ref('donation').child(keyid).update({startupStatus})
              firebase.database().ref('Users').child(user).child('openstartup').set(0)
            }
            window.location.reload('/startup/')
            // Send mutation
            commit('donationStartup', {id, raisedfunds})
          } else {
            const infoDonation = new Donation(
              userID,
              id,
              raisedfunds,
              title,
              profitDon,
              startupStatus
            )
            const donat = firebase.database().ref('donation').push(infoDonation)
            raisedfunds += raisedfundsStart
            firebase.database().ref('startups').child(id).update({raisedfunds})
            if (raisedfunds >= comp) {
              const completed = true
              startupStatus = 'Успішний'
              firebase.database().ref('startups').child(id).update({completed})
              firebase.database().ref('donation').child(keyid).update({startupStatus})
              firebase.database().ref('Users').child(user).child('openstartup').set(0)
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
              s.imageUrl,
              s.id,
              key
            )
          )
        })
        commit('setAllUsers', allUsersArray)
        commit('setLoading', false)
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
        Object.keys(donats).forEach(async (key) => {
          const d = donats[key]
          if (d.uid === userID) {
            const strp = (await firebase.database().ref('startups').child(d.idstartup).once('value')).val()
            // eslint-disable-next-line no-unused-vars
            var startupStatus
            if (strp.completed === true && strp.cost <= strp.raisedfunds) {
              donatsArray.push(
                new Donation(
                  d.uid,
                  d.idstartup,
                  d.donation,
                  d.title,
                  d.profit,
                  d.startupStatus
                )
              )
            } else if (strp.completed === true && strp.cost >= strp.raisedfunds) {
              donatsArray.push(
                new Donation(
                  d.uid,
                  d.idstartup,
                  d.donation,
                  d.title,
                  d.profit,
                  d.startupStatus
                )
              )
            } else if (strp.completed === false) {
              donatsArray.push(
                new Donation(
                  d.uid,
                  d.idstartup,
                  d.donation,
                  d.title,
                  d.profit,
                  d.startupStatus
                )
              )
            }
          }
        })
        commit('setDonations', donatsArray)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async approvedStartup ({commit}, {id, approved}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        if (approved === 'approved') {
          const date = new Date()
          var month = date.getUTCMonth() + 2
          var year
          var add
          if (month > 11) {
            add = Math.round(month / 11)
            month = Math.round((month % 11) - 1)
            year = date.getUTCFullYear() + add
          } else {
            year = date.getUTCFullYear()
          }
          const deadline = year + '.' + month + '.' + (date.getUTCDate()) + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
          // Use helped class
          await firebase.database().ref('startups').child(id).update({approved, deadline})
          // Send mutation
          window.location.reload('/startup/')
          commit('completeStartup', {id, approved})
        } else {
          await firebase.database().ref('startups').child(id).update({approved})
          // Send mutation
          window.location.reload('/startup/')
          commit('completeStartup', {id, approved})
        }
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
    status (state) {
      return state.statusUs
    },
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
        return stups.completed === false && stups.approved === 'approved'
      })
    },
    nonApprovedStartups (getters) {
      return getters.startupsAll.filter(stups => {
        return stups.completed === false && stups.approved === 'nonApproved'
      })
    },
    infoS: s => s.infoStr,
    infoU: s => s.infoUs,
    usersAll (state, getters) {
      return state.usersAll.filter(users => {
        return users.status !== 'Admin' && users.id !== firebase.auth().currentUser.uid
      })
    },
    usersStartupers (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Startuper' && users.id !== firebase.auth().currentUser.uid
      })
    },
    usersInvestor (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Investor' && users.id !== firebase.auth().currentUser.uid
      })
    },
    usersSpecialists (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Specialist' && users.id !== firebase.auth().currentUser.uid
      })
    },
    usersAdmin (getters) {
      return getters.usersAll.filter(users => {
        return users.status === 'Admin' && users.id !== firebase.auth().currentUser.uid
      })
    },
    donations (state) {
      return state.donations
    }
  }
}
