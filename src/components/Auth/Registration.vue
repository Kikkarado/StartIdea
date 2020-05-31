<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Registration
      .auth
        .auth__banner
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.email.$error }")
              span Пошта
              input(
                type="email"
                placeholder="Електронна адреса"
                v-model="email"
                :maxlength="36"
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
            .form-item(:class="{ errorInput: $v.repeatPassword.$error }")
              span Повторіть пароль
              input(
                type="password"
                placeholder="Повторіть пароль"
                v-model="repeatPassword"
                :maxlength="36"
                :class="{ error: $v.repeatPassword.$error }"
                @change="$v.repeatPassword.$touch()"
              )
              .error(v-if="!$v.repeatPassword.sameAsPassword") Паролі повинні співпадати.
        .auth__form
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.fname.$error }")
              span Ваше і&acuteмя
              input(
                type="text"
                placeholder="Ваше і'мя"
                v-model="fname"
                :maxlength="20"
                :class="{ error: $v.fname.$error }"
                @change="$v.fname.$touch()"
              )
              .error(v-if="!$v.fname.required") Поле обов&acuteязкове.
            .form-item(:class="{ errorInput: $v.sname.$error }")
              span Ваше прізвище
              input(
                type="text"
                placeholder="Ваше прізвище"
                v-model="sname"
                :maxlength="20"
                :class="{ error: $v.sname.$error }"
                @change="$v.sname.$touch()"
              )
              .error(v-if="!$v.sname.required") Поле обов&acuteязкове.
            .form-item(:class="{ errorInput: $v.status.$error }")
              span Ваш стутас
              select(v-model='status'
                :class="{ error: $v.status.$error }"
                )
                option(disabled='', value='') Оберіть статус. (Ви не зможете потім його змінити)
                option Investor
                option Startuper
                option Specialist
              span Ви обрали: {{ status }}
              .error(v-if="!$v.status.required") Поле обов&acuteязкове.
      form(@submit.prevent="onSubmit")
        .buttons-list
          button.button.button-primary(
            type="submit"
          )
            span(v-if="loading") Завантаження...
            span(v-else) Реєстрація
        .buttons-list.buttons-list--info
          .error(v-if="submitStatus === 'OK'") Дякуємо за ваше реєстрацію!
          .error(v-if="submitStatus === 'ERROR'") Будь ласка, заповніть форму правильно.
          .error(v-else) {{ submitStatus }}
        .buttons-list.buttons-list--info
          span Вже маєте обліковий запис?
            router-link(to="/login")  Натисніть тут
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  data () {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      fname: '',
      sname: '',
      status: '',
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
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    },
    fname: {
      required
    },
    sname: {
      required
    },
    status: {
      required
    }
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        console.log('submit!')
        const user = {
          email: this.email,
          password: this.password,
          fname: this.fname,
          sname: this.sname,
          status: this.status,
          openstartup: 0
        }
        this.$store.dispatch('registerUser', user)
          .then(() => {
            console.log('REGISTER!')
            this.submitStatus = 'OK'
            this.$router.push('/addDataProfile')
          })
          .catch(err => {
            this.submitStatus = messages[err.code]
          })
        // do your submit logic here
        // setTimeout(() => {
        //   this.submitStatus = 'OK'
        // }, 500)
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

.form-title
  text-align center

.auth
  display flex
  flex-wrap wrap
  justify-content center
.auth__banner,
.auth__form
  width 40%
  padding-right 15px
  padding-left 15px
  @media screen and (max-width: 768px)
    width 100%
    margin-bottom 30px
    &:last-child
      margin-bottom 0px

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
  text-align center
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0
</style>
