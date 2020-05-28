<template lang="pug">
  .content-wrapper
    .container.margin-top
      span Оберіть статус корисутвачів для відображення
      .selector.margin-top-8
        select.select.margin-right(v-model="usStatus")
          option(v-for="(item, key) in reasons", :value='key', select="item") {{ item }}
        span Ви обрали: {{ usStatus }}
      .search-form
        span.margin-right Пошук
        input.search(
            type="text"
            v-model="search"
            placeholder="Введіть те, що хочете знайти."
          )
      .auth
        .auth__form
      .user-list
        transition-group(name="userList")
        .task-item(
          v-for="users in usersFilter"
          :key="users.id"
        )
          .ui-card.ui-card--shadow.margin-bottom
              .task-item__info
                .task-item__main-info
                  span.ui-label.ui-label--light {{ users.status }}
                .task-item__content
                  .task-item__header
                    router-link.router-link(
                      :to="{ name: 'userprofile', params: { id: users.id } }"
                    ).ui-title-2 {{ users.fname }} {{ users.sname }}
                  .task-item__body
                    p.ui-text-regular {{ users.aboutme }}
</template>

<script>
export default {
  data () {
    return {
      search: '',
      usStatus: 'Всі',
      reasons: {
        'Всі': 'Всі',
        'Стартапери': 'Стартапери',
        'Інвестори': 'Інвестори',
        'Спеціалісти': 'Спеціалісти'
      }
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.usersAll).length) {
      await this.$store.dispatch('fetchAllUsers')
    }
  },
  methods: {},
  computed: {
    usersFilter () {
      if (this.usStatus === 'Стартапери') {
        if (this.search === '') {
          return this.$store.getters.usersStartupers
        } else {
          return this.$store.getters.usersStartupers.filter(item => item.fname.toLowerCase().includes(this.search.toLowerCase()) || item.sname.toLowerCase().includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Інвестори') {
        if (this.search === '') {
          return this.$store.getters.usersInvestors
        } else {
          return this.$store.getters.usersInvestors.filter(item => item.fname.toLowerCase().includes(this.search.toLowerCase()) || item.sname.toLowerCase().includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Спеціалісти') {
        if (this.search === '') {
          return this.$store.getters.usersSpecialists
        } else {
          return this.$store.getters.usersSpecialists.filter(item => item.fname.toLowerCase().includes(this.search.toLowerCase()) || item.sname.toLowerCase().includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Всі') {
        if (this.search === '') {
          return this.$store.getters.usersAll
        } else {
          return this.$store.getters.usersAll.filter(item => item.fname.toLowerCase().includes(this.search.toLowerCase()) || item.sname.toLowerCase().includes(this.search.toLowerCase()))
        }
      }
      return this.usStatus === 'Всі'
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

.margin-top-8
  margin-top 8px

.margin-top
  margin-top 32px

.margin-bottom
  margin-bottom 32px

.margin-right
  margin-right 12px

.margin-left
  margin-left 12px

.height
  height 30px
.select
  width 8%

.search
  width 25%
</style>
