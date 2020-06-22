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
            placeholder="..."
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
                  .user_av
                    .img_form
                      img.image_avatar(:src='users.imageUrl' class="scale" v-if="users.imageUrl")
                      img.image_avatar(src='https://image.flaticon.com/icons/svg/2960/2960006.svg' class="scale" v-else)
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
        'Інвестор': 'Інвестор',
        'Спеціалісти': 'Спеціалісти',
        'Адміністратори': 'Адміністратори'
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
          return this.$store.getters.usersStartupers.filter(item => (item.fname.toLowerCase() + ' ' + item.sname.toLowerCase()).includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Інвестор') {
        if (this.search === '') {
          return this.$store.getters.usersInvestor
        } else {
          return this.$store.getters.usersInvestor.filter(item => (item.fname.toLowerCase() + ' ' + item.sname.toLowerCase()).includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Спеціалісти') {
        if (this.search === '') {
          return this.$store.getters.usersSpecialists
        } else {
          return this.$store.getters.usersSpecialists.filter(item => (item.fname.toLowerCase() + ' ' + item.sname.toLowerCase()).includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Адміністратори') {
        if (this.search === '') {
          return this.$store.getters.usersAdmin
        } else {
          return this.$store.getters.usersAdmin.filter(item => (item.fname.toLowerCase() + ' ' + item.sname.toLowerCase()).includes(this.search.toLowerCase()))
        }
      } else if (this.usStatus === 'Всі') {
        if (this.search === '') {
          return this.$store.getters.usersAll
        } else {
          return this.$store.getters.usersAll.filter(item => (item.fname.toLowerCase() + ' ' + item.sname.toLowerCase()).includes(this.search.toLowerCase()))
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

.scale
  transition 1s

.scale:hover
  transform scale(2)

.task-item__header
  display block
  width 50%
  padding 10px
  justify-content left

.user_av
  display flex
  width 100%
  padding 10px
  justify-content left

.img_form
  display inline-block
  text-align left
  flex 0 1 auto
  width 100px
  height 100px
  padding 10px
  justify-content left

.image_avatar
  object-fit cover
  flex 0 1 auto
  border 3px solid #999999
  width 100%
  height 100%
  border-radius 50%
</style>
