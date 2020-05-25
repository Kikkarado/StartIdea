<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__form
          span.ui-title-2 Оновлення паролю
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.email.$error }")
              span Ваша електронна адреса на яку ви реєстрували обліковий запис
              input(
                type="email"
                placeholder="Електронна адреса"
                v-model="email"
                :maxlength="25"
                :class="{ error: $v.email.$error }"
                @change="$v.email.$touch()"
              )
              .error(v-if="!$v.email.required") Поле обов&acuteязкове.
              .error(v-if="!$v.email.email") Адреса електронної пошти введена некоректно
            .buttons-list
              button.button.button-primary(
                type="submit"
              )
                span(v-if="loading") Оновлення...
                span(v-else) Оновити пароль
            .buttons-list.buttons-list--info
              p.typo__p(v-if="submitStatus === 'OK'") Перевірте вашу електронну пошту!
              p.typo__p(v-if="submitStatus === 'ERROR'") Будь ласка, заповніть форму правильно.
              p.typo__p(v-else) {{ submitStatus }}
            .buttons-list.buttons-list--info
              span Передумали?
                router-link(to="/login")  Натисніть тут
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  data () {
    return {
      email: '',
      submitStatus: null
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const user = {
          email: this.email
        }
        this.$store.dispatch('resetPassword', user)
          .then(() => {
            console.log('RESET!')
            this.submitStatus = 'OK'
          })
          .catch(err => {
            this.submitStatus = messages[err.code]
          })
      }
    }
  },
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

.auth
  display flex
.auth__banner,
.auth__form
  width 30%

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color #fc5c65
  &.errorInput
    .error
      display block

select,
input
  &.error
    border-color #fc5c65

.buttons-list
  text-align right
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0
</style>
