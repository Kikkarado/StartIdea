<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Your profile
      .auth
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 Name
              span.ui-title-5 {{ profFil.fname }}  {{ profFil.sname }}
            .form-item
              span.ui-title-4 Email
              span.ui-title-5 {{ profFil.email }}
            .form-item
              span.ui-title-4 Date of birth
              span.ui-title-5 {{ profFil.dayofbirth }}.{{ profFil.monthofbirth }}.{{ profFil.yearofbirth }}
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 Phone number
              p.ui-title-5 {{ profFil.phone }}
            .form-item
              span.ui-title-4 About me
              p.ui-title-5 {{ profFil.aboutme }}
    .buttons-list.button-list--info
      span Edit account info?
        router-link(to="/addDataProfile")  Click Here
</template>

<script>
export default {
  data () {
    return {}
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
  },
  methods: {},
  computed: {
    profFil () {
      return this.$store.getters.info
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
  white-space pre-line

.buttons-list
  text-align center
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0
</style>
