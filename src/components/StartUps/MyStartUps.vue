<template lang="pug">
  .content-wrapper
    section
    .container
      .auth
        .auth__form
          span.ui-title-2 My StartUp
        .buttons-list
          .button.button--round.button-default(
            @click="filter = 'complete'"
          ) Active
          .button.button--round.button-default(
            @click="filter = 'notcomplete'"
          ) Completed
          .button.button--round.button-default(
            @click="filter = 'all'"
          ) All
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="startups in startupFilter"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow
              .task-item__info
                .task-item__main-info
                  span Cost: {{ startups.raisedfunds }} : {{ startups.cost }}
                .task-item__content
                  .task-item__header
                    span.ui-title-2 {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular {{ startups.fname }}
                  .task-item__foter
                    .buttons-list
                      .button.button--round.button-primary Done
        .auth__bot
          button.button-primary(@click="addStartUp") Add startup
          p {{ OpStartup }}
          form(@submit.prevent="onSubmit")
</template>

<script>
export default {
  data () {
    return {
      OpStartup: null,
      filter: 'complete'
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.openstartup).length) {
      await this.$store.dispatch('fetchActiveStartup')
    }
    if (!Object.keys(this.$store.getters.startups).length) {
      await this.$store.dispatch('fetchStartups')
    }
  },
  methods: {
    addStartUp () {
      if (this.checkActiveStartup === 1) {
        this.OpStartup = 'You already have open StartUp'
      } else {
        this.$router.push('/addStartUp')
      }
    },
    clickme () {
      alert('Anchor tag is clicked')
    }
  },
  computed: {
    checkActiveStartup () {
      return this.$store.getters.openstartup
    },
    checkStartups () {
      return this.$store.getters.startups
    },
    startupFilter () {
      if (this.filter === 'notcomplete') {
        return this.$store.getters.startupNotCompleted
      } else if (this.filter === 'complete') {
        return this.$store.getters.startupCompleted
      } else if (this.filter === 'all') {
        return this.$store.getters.startups
      }
      return this.filter === 'complete'
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus">
  .auth
    display flex
    flex-wrap wrap
  .auth__banner,
  .auth__form
    display right
    width 100%
  .button-add
    text-align right
    color #fc5c65
  .button-done
    text-align right
</style>
