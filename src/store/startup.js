import firebase from 'firebase/app'

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
        let imageUrl1
        let imageUrl2
        let imageUrl3
        let filename1
        let filename2
        let filename3
        let key
        const approved = 'nonApproved'
        const deadline = ''
        const userID = firebase.auth().currentUser.uid
        // Use helped class
        const newStartUp = {
          title: payload.title,
          shortdescription: payload.shortdescription,
          fulldescription: payload.fulldescription,
          cost: payload.cost,
          completed: payload.completed,
          raisedfunds: payload.raisedfunds,
          percent: payload.percent,
          deadline: deadline,
          approved: approved,
          user: getters.user.id
        }
        await firebase.database().ref('startups').push(newStartUp)
          .then(data => {
            key = data.key
            return key
          })
          .then(() => {
            commit('newStartUp', {...newStartUp, imageUrl1: imageUrl1, imageUrl2: imageUrl2, imageUrl3: imageUrl3, id: key})
          })
          .catch((error) => {
            console.log(error)
          })
        await firebase.database().ref('Users').child(userID).child('openstartup').set(1)
        // Send mutation
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
