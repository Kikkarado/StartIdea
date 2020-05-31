<template lang="pug">
  .wrapper
    header
      .navbar
        .container
          .navbar-content
            router-link.header-logo(
              to="/"
            ) Start Idea
            .button-burger(
              @click = "menuShow = !menuShow"
              :class="{ active: menuShow }"
            )
              span.line.line-1
              span.line.line-2
              span.line.line-3
            .navbar-list__wrapper(
              :class="{ active: menuShow }"
            )
              ul.navbar-list
                li.navbar-item(
                  v-for="link in linkMenu"
                  :key="link.title"
                  @click = "menuShow = false"
                )
                  router-link.navbar-link(
                    :to="`${link.url}`"
                  ) {{ link.title }}
                li.navbar-item(
                  v-if="checkUser"
                  @click="logout"
                )
                  span.navbar-link Вихід
    router-view
</template>

<script>

export default {
  data () {
    return {
      menuShow: false
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.status).length) {
      await this.$store.dispatch('fetchStatus')
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logoutUser')
      this.$router.push('/login')
    }
  },
  computed: {
    checkUser () {
      return this.$store.getters.checkUser
    },
    checkStatus () {
      return this.$store.getters.status
    },
    linkMenu () {
      if (this.checkUser && this.checkStatus === 'Startuper') {
        return [
          {title: 'Головна', url: '/'},
          {title: 'Користувачі', url: '/users'},
          {title: 'Мої стартапи', url: '/myStartUps'},
          {title: 'Профіль', url: '/profile'}
        ]
      } else if ((this.checkUser && this.checkStatus === 'Investor') || (this.checkUser && this.checkStatus === 'Specialist')) {
        return [
          {title: 'Головна', url: '/'},
          {title: 'Користувачі', url: '/users'},
          {title: 'Профіль', url: '/profile'}
        ]
      } else if ((this.checkUser && this.checkStatus === 'Admin')) {
        return [
          {title: 'Головна', url: '/'},
          {title: 'Не схвалені стартапи', url: '/approvedStartups'},
          {title: 'Профіль', url: '/profile'}
        ]
      }
      return [
        {title: 'Вхід', url: '/login'},
        {title: 'Зареєструватися', url: '/registration'}
      ]
    }
  }
}
</script>

<style lang="stylus">
</style>
