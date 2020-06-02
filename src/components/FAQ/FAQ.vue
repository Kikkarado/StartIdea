<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 FAQ
      .auth
      .auth__form2
        form(@submit.prevent="onSubmit")
          .form-item
            .content
              span.ui-title-4 Про сайт
              span.ui-text-regular {{ aboutsite }}
          .form-item
            .content
              span.ui-title-4 Для авторів стартапів
              span.ui-text-regular {{ forauthor }}
          .form-item
            .content
              span.ui-title-4 Для інвесторів
              span.ui-text-regular {{ forinvestor }}
          .form-item
            .content
              span.ui-title-4 Для спеціалістів
              span.ui-text-regular {{ forspecialist }}
</template>

<script>
import messages from '@/utils/messages'

export default {
  data () {
    return {
      aboutsite: messages.aboutsite,
      forauthor: messages.forauthor,
      forinvestor: messages.forinvestor,
      forspecialist: messages.forspecialist
    }
  },
  async mounted () {},
  methods: {},
  computed: {
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

span
  color #000

.auth__form2
  display flex
  width 100%
  padding 10px
  justify-content left

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
</style>
