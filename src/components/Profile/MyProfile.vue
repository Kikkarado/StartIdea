<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Мій профіль
      .auth
        .img_form
          img.image_avatar(:src='profFil.imageUrl' class="scale" v-if="profFil.imageUrl")
          img.image_avatar(src='https://image.flaticon.com/icons/svg/2960/2960006.svg' v-else)
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item
              .content
                span.ui-title-4 І&acuteмя
                span.ui-title-3 {{ profFil.fname }}  {{ profFil.sname }}
              .content(style="margin-left: 10px; text-align: center")
                span.ui-title-4 Дата народження
                p.ui-title-3 {{ profFil.dayofbirth }}.{{ profFil.monthofbirth }}.{{ profFil.yearofbirth }}
            .form-item
              .content
                span.ui-title-4 Електронна адреса
                span.ui-title-3 {{ profFil.email }}
              .content
                span.ui-title-4 Телефон
                p.ui-title-3 {{ profFil.phone }}
      .auth__form2
        form(@submit.prevent="onSubmit")
          .form-item
            .content
              span.ui-title-4 Про мене
              p.ui-title-3 {{ profFil.aboutme }}
      .buttons-list.button-list--info
        span Для оновлення даних
          router-link(to="/addDataProfile")  натисніть тут
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="donats in donat"
          :key="donats.uid"
          :class="{ completed: donats.uid }"
        )
          .ui-card.ui-card--shadow.margin-bottom-16
              .task-item__info
                .task-item__main-info
                  .donation
                    span.ui-label.ui-label--primary Всього пожертвувано :  {{ donats.donation }}$
                .task-item__content
                  .task-item__header
                    router-link.router-link.ui-title-2(
                      :to="{ name: 'startup', params: { id: donats.idstartup } }"
                      ) {{ donats.title }}
</template>

<script>
export default {
  data () {
    return {
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
    if (!Object.keys(this.$store.getters.donations).length) {
      await this.$store.dispatch('fetchDonations')
    }
  },
  methods: {},
  computed: {
    profFil () {
      console.log(this.$store.getters.info)
      return this.$store.getters.info
    },
    donat () {
      console.log(this.$store.getters.donations)
      return this.$store.getters.donations
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

.auth__form1
  display block
  width 50%
  padding 10px
  justify-content left

.auth__form2
  display flex
  width 100%
  padding 10px
  justify-content center

.form-date
  width 100%
  display flex
  padding 0px 0px 0px 0px
  justify-content left

.form-item
  margin-bottom 5px
  display flex
  white-space pre-line

.content
 padding 10px

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
