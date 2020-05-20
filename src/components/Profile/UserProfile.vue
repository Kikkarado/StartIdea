<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__form
          span.ui-title-2 Profile
          form(
            v-if="userInf"
          )
            p Name: {{ userInf.fname }}
            p Surname: {{ userInf.sname }}
            p Status: {{ userInf.status }}
</template>

<script>
export default {
  data () {
    return {}
  },
  created: function () {
    this.openInfoUser()
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.infoU).length) {
      await this.$store.dispatch('infoUser')
    }
  },
  methods: {
    openInfoUser () {
      const userId = this.$route.params.id
      console.log('ku ' + userId)
      this.$store.dispatch('infoUser', {
        id: userId
      })
    }
  },
  computed: {
    userInf () {
      return this.$store.getters.infoU
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus" scoped>
.auth
  display flex
.auth__banner,
.auth__form
  width 30%

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color #fc5c65
  &.errorInput
    .error
      display block

select,
input
  &.error
    border-color #fc5c65

.buttons-list
  text-align right
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0
</style>
