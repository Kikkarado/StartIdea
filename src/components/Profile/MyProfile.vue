<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Мій профіль
      .auth
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 І&acuteмя
              span.ui-title-5 {{ profFil.fname }}  {{ profFil.sname }}
            .form-item
              span.ui-title-4 Електронна адреса
              span.ui-title-5 {{ profFil.email }}
            .form-item
              span.ui-title-4 Дата народження
              span.ui-title-5 {{ profFil.dayofbirth }}.{{ profFil.monthofbirth }}.{{ profFil.yearofbirth }}
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item
              span.ui-title-4 Телефон
              p.ui-title-5 {{ profFil.phone }}
            .form-item
              span.ui-title-4 Про мене
              p.ui-title-5 {{ profFil.aboutme }}
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
    return {}
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

.auth__form1,
.auth__form2
  display flex
  width 50%
  padding 10px
  justify-content center

.form-date
  width 100%
  display flex
  padding 0px 0px 0px 0px
  justify-content left

.form-item
  margin-bottom 15px
  display block
  white-space pre-line

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
</style>
