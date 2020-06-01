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
        const date = new Date()
        var month = date.getUTCMonth() + 2
        var year
        var add
        let imageUrl1
        let imageUrl2
        let imageUrl3
        let filename1
        let filename2
        let filename3
        let key
        const approved = 'nonApproved'
        if (month > 11) {
          add = Math.round(2 / 11)
          month = Math.round(11 % 2)
          year = date.getUTCFullYear() + add
        } else {
          year = date.getUTCFullYear()
        }
        const deadline = year + '.' + month + '.' + (date.getUTCDate()) + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
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
            console.log(key)
            return key
          })
          .then(async (key) => {
            if (payload.image1 !== null && payload.image2 !== null && payload.image3 !== null) {
              filename1 = payload.image1.name
              const img1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').put(payload.image1)
              filename2 = payload.image2.name
              const img2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').put(payload.image2)
              filename3 = payload.image3.name
              const img3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').put(payload.image3)
              console.log('ok')
              return img1 && img2 && img3
            } else {
              if (payload.image1 !== null && payload.image2 !== null && payload.image3 === null) {
                filename1 = payload.image1.name
                const img1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').put(payload.image1)
                filename2 = payload.image2.name
                const img2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').put(payload.image2)
                filename3 = 'none'
                console.log('ok')
                return img1 && img2
              } else {
                if (payload.image1 !== null && payload.image2 === null && payload.image3 === null) {
                  filename1 = payload.image1.name
                  const img1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').put(payload.image1)
                  filename2 = 'none'
                  filename3 = 'none'
                  console.log('ok')
                  return img1
                } else {
                  if (payload.image1 === null && payload.image2 === null && payload.image3 === null) {
                    filename1 = 'none'
                    filename2 = 'none'
                    filename3 = 'none'
                    console.log('ok')
                  } else {
                    if (payload.image1 === null && payload.image2 === null && payload.image3 !== null) {
                      filename3 = payload.image3.name
                      const img3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').put(payload.image3)
                      filename1 = 'none'
                      filename2 = 'none'
                      console.log('ok')
                      return img3
                    } else {
                      if (payload.image1 === null && payload.image2 !== null && payload.image3 !== null) {
                        filename2 = payload.image2.name
                        const img2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').put(payload.image2)
                        filename3 = payload.image3.name
                        const img3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').put(payload.image3)
                        filename1 = 'none'
                        console.log('ok')
                        return img2 && img3
                      } else {
                        if (payload.image1 === null && payload.image2 !== null && payload.image3 === null) {
                          filename2 = payload.image2.name
                          const img2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').put(payload.image2)
                          filename1 = 'none'
                          filename3 = 'none'
                          console.log('ok')
                          return img2
                        } else {
                          if (payload.image1 !== null && payload.image2 === null && payload.image3 !== null) {
                            filename1 = payload.image1.name
                            const img1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').put(payload.image1)
                            filename3 = payload.image3.name
                            const img3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').put(payload.image3)
                            filename2 = 'none'
                            console.log('ok')
                            return img1 && img3
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          })
          .then(async (fileData) => {
            if (filename1 !== 'none' && filename2 !== 'none' && filename3 !== 'none') {
              imageUrl1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').getDownloadURL()
              imageUrl2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').getDownloadURL()
              imageUrl3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').getDownloadURL()
            } else {
              if (filename1 !== 'none' && filename2 !== 'none' && filename3 === 'none') {
                imageUrl1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').getDownloadURL()
                imageUrl2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').getDownloadURL()
                imageUrl3 = 'none'
              } else {
                if (filename1 !== 'none' && filename2 === 'none' && filename3 === 'none') {
                  imageUrl1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').getDownloadURL()
                  imageUrl2 = 'none'
                  imageUrl3 = 'none'
                } else {
                  if (filename1 === 'none' && filename2 === 'none' && filename3 === 'none') {
                    imageUrl1 = 'none'
                    imageUrl2 = 'none'
                    imageUrl3 = 'none'
                  } else {
                    if (filename1 === 'none' && filename2 === 'none' && filename3 !== 'none') {
                      imageUrl3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').getDownloadURL()
                      imageUrl1 = 'none'
                      imageUrl2 = 'none'
                    } else {
                      if (filename1 === 'none' && filename2 !== 'none' && filename3 !== 'none') {
                        imageUrl2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').getDownloadURL()
                        imageUrl3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').getDownloadURL()
                        imageUrl1 = 'none'
                      } else {
                        if (filename1 === 'none' && filename2 !== 'none' && filename3 === 'none') {
                          imageUrl2 = await firebase.storage().ref('startupsImg').child(key).child(userID + '2').getDownloadURL()
                          imageUrl1 = 'none'
                          imageUrl3 = 'none'
                        } else {
                          if (filename1 !== 'none' && filename2 === 'none' && filename3 !== 'none') {
                            imageUrl1 = await firebase.storage().ref('startupsImg').child(key).child(userID + '1').getDownloadURL()
                            imageUrl3 = await firebase.storage().ref('startupsImg').child(key).child(userID + '3').getDownloadURL()
                            imageUrl2 = 'none'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            firebase.database().ref('startups').child(key).update({imageUrl1: imageUrl1, imageUrl2: imageUrl2, imageUrl3: imageUrl3})
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
