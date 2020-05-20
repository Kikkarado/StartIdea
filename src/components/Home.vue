<template lang="pug">
  .content-wrapper
    section
    .container
      .auth
        .auth__form
          span.ui-title-2 Home
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
          v-for="startups in allStartups"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow
              .task-item__info
                .task-item__main-info
                  p.typo__p(v-if="startups.completed === true") Completed
                  span Collected {{ startups.raisedfunds }} : {{ startups.cost }}
                .task-item__content
                  .task-item__header
                    span.ui-title-2 {{ startups.title }}
                  .task-item__body
                    p().ui-text-regular {{ startups.description }}
                  .task-item__foter
                    router-link(
                      v-if="checkStatus === 'Investor'"
                      :to="{ name: 'startup', params: { id: startups.id } }"
                      ) Read more
</template>

<script>
export default {
  data () {
    return {}
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.startupsAll).length) {
      await this.$store.dispatch('fetchAllStartups')
    }
  },
  methods: {},
  computed: {
    allStartups () {
      return this.$store.getters.startupsAll
    },
    checkStatus () {
      return this.$store.getters.status
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
