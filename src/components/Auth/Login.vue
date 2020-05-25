<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__banner
          img(src='https://cdn.dribbble.com/users/1568450/screenshots/5419750/work_1_dribbble-01.png')
        .auth__form
          span.ui-title-2.ceneter Вхід
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.email.$error }")
              span Пошта
              input(
                type="email"
                placeholder="Електронна пошта"
                v-model="email"
                :maxlength="25"
                :class="{ error: $v.email.$error }"
                @change="$v.email.$touch()"
              )
              .error(v-if="!$v.email.required") Поле обов&acuteязкове.
              .error(v-if="!$v.email.email") Адреса електронної пошти введена некоректно
            .form-item(:class="{ errorInput: $v.password.$error }")
              span Пароль
              input(
                type="password"
                placeholder="Пароль"
                v-model="password"
                :maxlength="36"
                :class="{ error: $v.password.$error }"
                @change="$v.password.$touch()"
              )
              .error(v-if="!$v.password.required") Поле обов&acuteязкове.
              .error(v-if="!$v.password.minLength")
                | У паролі має бути не менше {{ $v.password.$params.minLength.min }} літер.
            .buttons-list
              button.button.button-primary(
                type="submit"
              )
                span(v-if="loading") Завантаження...
                span(v-else) Увійти
            .buttons-list.buttons-list--info
              p.typo__p(v-if="submitStatus === 'OK'") Ви увійшли до системи!
              p.typo__p(v-if="submitStatus === 'ERROR'") Будь ласка, заповніть форму правильно.
              p.typo__p(v-else) {{ submitStatus }}
            .buttons-list.buttons-list--info
              span Потрібен обліковий запис?
                router-link(to="/registration")  Натисніть тут
            .buttons-list.buttons-list--info
              span Забули пароль?
                router-link(to="/resetPassword")  Натисніть тут
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  data () {
    return {
      status: '',
      email: '',
      password: '',
      repeatPassword: '',
      submitStatus: null
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    }
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('loginUser', user)
          .then(() => {
            console.log('LOGIN!')
            this.submitStatus = 'OK'
            this.$router.push('/')
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
  width 50%

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color #fc5c65
  &.errorInput
    .error
      display block

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

.ceneter
  display flex
  justify-content center
</style>
