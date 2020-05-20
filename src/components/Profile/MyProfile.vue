<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__form
          span.ui-title-2 Profile
          form
            p Name: {{ profFil.fname }}
            p Surname: {{ profFil.sname }}
            p Status: {{ profFil.status }}
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
