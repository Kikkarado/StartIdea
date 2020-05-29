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
    async addUserData ({commit}, {fname, sname, image, dayofbirth, monthofbirth, yearofbirth, email, phone, aboutme}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let imageUrl
        let ext
        const userID = firebase.auth().currentUser.uid
        const addProf = await firebase.database().ref('Users').child(userID).update({fname, sname, dayofbirth, monthofbirth, yearofbirth, email, phone, aboutme})
          .then(async () => {
            const filename = image.name
            ext = filename.slice(filename.lastIndexOf('.'))
            const img = await firebase.storage().ref('avatarUser/' + userID + ext).put(image)
            return img
          })
          .then(async (fileData) => {
            const imagePath = fileData.metadata.fullPath
            await firebase.storage().ref('avatarUser/' + userID + ext).getDownloadURL()
            return firebase.database().ref('Users').child(userID).update({imageUrl: imagePath})
          })
          .then(() => {
            commit('addUserData', {...addProf, imageUrl: imageUrl})
          })
          .catch((error) => {
            console.log(error)
          })
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
    profile (state, getters) {
      return state.profile.filter(prof => {
        return prof.user === getters.user.id
      })
    }
  }
}
