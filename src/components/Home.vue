<template lang="pug">
  .content-wrapper
    .container.margin-top
      .search-form
        span.margin-right Пошук
        input.search(
            type="text"
            v-model="search"
            placeholder="Введіть те, що хочете знайти."
          )
      .auth
        .auth__form
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="startups in allStartups"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow.margin-bottom
              .task-item__info
                .task-item__main-info
                  .donation
                    span.ui-label.ui-label--light Зібрано:  {{ startups.raisedfunds }}$
                    span.ui-label.ui-label--primary Потрібно:  {{ startups.cost }}$
                .task-item__content
                  .task-item__header
                     router-link.router-link.ui-title-2(
                      :to="{ name: 'startup', params: { id: startups.id } }"
                      ) {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular {{ startups.shortdescription }}
                  .task-item__foter
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.startupsAll).length) {
      await this.$store.dispatch('fetchAllStartups')
    }
  },
  methods: {},
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
.content-wrapper
  min-height 100%

.router-link
  color #444ce0

.dots
  display flex
  font-size 20px
.donation
  width 100%
  display flex
  padding 0px 3px
  max-height 50px

.task-item__body
  white-space pre-line

.margin-top
  margin-top 32px

.margin-bottom
  margin-bottom 32px

.margin-right
  margin-right 12px

.search
  width 25%
</style>
