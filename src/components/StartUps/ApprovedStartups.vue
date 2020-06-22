<template lang="pug">
  .content-wrapper
    .container.margin-top
      .search-form
        span.margin-right Пошук
        input.search(
            type="text"
            v-model="search"
            placeholder="..."
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
                    p.ui-text-regular.margin-bottom-8 {{ startups.shortdescription }}
                  .task-item__foter
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  },
  created: function () {},
  async mounted () {
    if (!Object.keys(this.$store.getters.nonApprovedStartups).length) {
      await this.$store.dispatch('fetchAllStartups')
    }
  },
  methods: {},
  computed: {
    allStartups () {
      if (this.search === '') {
        const all = this.$store.getters.nonApprovedStartups
        return all.sort(sortByDate)
      } else {
        return this.$store.getters.nonApprovedStartups.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()))
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
var sortByDate = function (d1, d2) { return (new Date(d1.deadline) > new Date(d2.deadline)) ? 1 : -1 }
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

.margin-bottom-8
  margin-bottom 8px

.margin-right
  margin-right 12px

.search
  width 25%
</style>
