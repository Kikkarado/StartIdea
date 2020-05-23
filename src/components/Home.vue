<template lang="pug">
  .content-wrapper
    section
    .container
      input(
          type="text"
          v-model="search"
          placeholder="Search"
        )
      .auth
        .auth__form
          span.ui-title-2 Home {{ nt }}
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="startups in allStartups"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow.margin
              .task-item__info
                .task-item__main-info
                  p.typo__p(v-if="startups.completed === true") Completed
                  span Collected {{ startups.raisedfunds }} : {{ startups.cost }}
                .task-item__content
                  .task-item__header
                    span.ui-title-2 {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular {{ startups.shortdescription }}
                  .task-item__foter
                    router-link.router-link(
                      v-if="checkStatus === 'Investor'"
                      :to="{ name: 'startup', params: { id: startups.id } }"
                      ) Read more
</template>

<script>
export default {
  data () {
    return {
      search: '',
      nt: ''
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.startupsAll).length) {
      await this.$store.dispatch('fetchAllStartups')
    }
  },
  methods: {
    notFound () {
      console.log('Not Found')
      this.nt = 'Not Found'
    }
  },
  computed: {
    allStartups () {
      if (this.search === '') {
        return this.$store.getters.startupsAll
      } else {
        return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()))
      }
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
.router-link
  color #444ce0

.margin
  margin-bottom 12px
</style>
