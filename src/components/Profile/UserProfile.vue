<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 User profile
      .auth
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 Name
              span.ui-title-5 {{ userInf.fname }}  {{ userInf.sname }}
            .form-item
              span.ui-title-4 Email
              span.ui-title-5 {{ userInf.email }}
            .form-item
              span.ui-title-4 Date of birth
              span.ui-title-5 {{ userInf.dayofbirth }}.{{ userInf.monthofbirth }}.{{ userInf.yearofbirth }}
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 Phone number
              p.ui-title-5 {{ userInf.phone }}
            .form-item
              span.ui-title-4 About me
              p.ui-title-5 {{ userInf.aboutme }}
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
.form-title
  text-align center

.auth
  display flex
  justify-content center

.auth__form1,
.auth__form2
  width 30%
  padding 10px

.form-date
  width 100%
  display flex
  padding 0px 0px 0px 0px
  justify-content left

.form-item
  margin-bottom 15px
  display block

a
  color #444ce0
</style>
