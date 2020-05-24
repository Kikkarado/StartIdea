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
                  span.navbar-link Logout
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
          {title: 'Home', url: '/'},
          {title: 'MyStartUps', url: '/myStartUps'},
          {title: 'Profile', url: '/profile'}
        ]
      } else if ((this.checkUser && this.checkStatus === 'Investor') || (this.checkUser && this.checkStatus === 'Specialist')) {
        return [
          {title: 'Home', url: '/'},
          {title: 'Users', url: '/users'},
          {title: 'Profile', url: '/profile'}
        ]
      }
      return [
        {title: 'Login', url: '/login'},
        {title: 'Registration', url: '/registration'}
      ]
    }
  }
}
</script>

<style lang="stylus">
</style>
