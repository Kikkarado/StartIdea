<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Профіль користувача
      .auth
        .img_form
          img.image_avatar(:src='userInf.imageUrl' class="scale" v-if="userInf.imageUrl")
          img.image_avatar(src='https://image.flaticon.com/icons/svg/2960/2960006.svg' v-else)
        .auth__form1
          .content
            span.ui-title-4 І&acuteмя
            span.ui-title-3 {{ userInf.fname }}  {{ userInf.sname }}
          .content()
            span.ui-title-4 Дата народження
            p.ui-title-3 {{ userInf.dayofbirth }}.{{ userInf.monthofbirth }}.{{ userInf.yearofbirth }}
        .auth__form1
          .content
            span.ui-title-4 Електронна адреса
            span.ui-title-3 {{ userInf.email }}
          .content
            span.ui-title-4 Телефон
            p.ui-title-3 {{ userInf.phone }}
      .auth__form2
        form(@submit.prevent="onSubmit")
          .form-item
            .content
              span.ui-title-4 Про мене
              p.ui-title-3 {{ userInf.aboutme }}
</template>

<script>
export default {
  data () {
    return {}
  },
  created: function () {
    this.openInfoUser()
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.infoU).length) {
      await this.$store.dispatch('infoUser')
    }
  },
  methods: {
    openInfoUser () {
      const userId = this.$route.params.id
      this.$store.dispatch('infoUser', {
        id: userId
      })
    }
  },
  computed: {
    userInf () {
      return this.$store.getters.infoU
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

.form-title
  text-align center

.auth
  display flex
  justify-content center

.startup-list
  width 100%
  text-align center
  justify-content center

.width
  display block
  width 33%
  justify-content center

.img_form
  display inline-block
  text-align right
  flex 0 1 auto
  width 200px
  height 200px
  padding 10px
  justify-content right

.auth__form2
  display flex
  width 100%
  padding 10px
  justify-content center

.form-item
  margin-bottom 5px
  display flex
  white-space pre-line

.content
  margin 10px
  padding 10px
  border-bottom 2px solid #C0C4CC
  border-left 1px solid #C0C4CC
  border-radius 25px

.buttons-list
  text-align center
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0

.margin-bottom-16
  margin-bottom 16px

.width-33
  width 33%

.scale
  transition 1s

.scale:hover
  transform scale(2)

.image_avatar
  object-fit cover
  flex 0 1 auto
  border 3px solid #999999
  width 100%
  height 100%
  border-radius 50%
</style>
