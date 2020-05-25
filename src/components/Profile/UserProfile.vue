<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Профіль користувача
      .auth
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 І&acuteмя
              span.ui-title-5 {{ userInf.fname }}  {{ userInf.sname }}
            .form-item
              span.ui-title-4 Електронна адреса
              span.ui-title-5 {{ userInf.email }}
            .form-item
              span.ui-title-4 Дата народження
              span.ui-title-5 {{ userInf.dayofbirth }}.{{ userInf.monthofbirth }}.{{ userInf.yearofbirth }}
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 Телефон
              p.ui-title-5 {{ userInf.phone }}
            .form-item
              span.ui-title-4 Про користувача
              span.ui-title-5 {{ userInf.aboutme }}
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
.content-wrapper
  min-height 100%

.form-title
  text-align center

.auth
  display flex
  justify-content center

.auth__form1,
.auth__form2
  display flex
  width 50%
  padding 10px
  justify-content center

.form-date
  width 100%
  display flex
  padding 0px 0px 0px 0px
  justify-content left

.form-item
  margin-bottom 15px
  display block
  white-space pre-line

a
  color #444ce0
</style>
