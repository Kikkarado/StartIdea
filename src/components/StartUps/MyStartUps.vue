<template lang="pug">
  .content-wrapper
    section
    .container
      .auth
        .auth__form
          span.ui-title-2 My StartUp
          button-add
              button.button-primary(@click="addStartUp") Add startup
          p {{ OpStartup }}
          form(@submit.prevent="onSubmit")
</template>

<script>
export default {
  data () {
    return {
      OpStartup: null
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.openstartup).length) {
      await this.$store.dispatch('fetchStartup')
    }
  },
  methods: {
    addStartUp () {
      if (this.checkStartup === 1) {
        this.OpStartup = 'You already have open StartUp'
      } else {
        this.$router.push('/addStartUp')
      }
    }
  },
  computed: {
    checkStartup () {
      return this.$store.getters.openstartup
    }
  }
}
</script>

<style lang="stylus">
  .button-add
    text-align right
    color #fc5c65
</style>
