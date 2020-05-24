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
              input(
                type="email"
                placeholder="Email"
                v-model="email"
                :class="{ error: $v.email.$error }"
                @change="$v.email.$touch()"
              )
              .error(v-if="!$v.email.required") Field is required
              .error(v-if="!$v.email.email") Email is not correct
            .form-item(:class="{ errorInput: $v.password.$error }")
              input(
                type="password"
                placeholder="Password"
                v-model="password"
                :class="{ error: $v.password.$error }"
                @change="$v.password.$touch()"
              )
              .error(v-if="!$v.password.required") Password is required.
              .error(v-if="!$v.password.minLength")
                | Password must have at least {{ $v.password.$params.minLength.min }} letters.
            .form-item(:class="{ errorInput: $v.repeatPassword.$error }")
              input(
                type="password"
                placeholder="Repeat password"
                v-model="repeatPassword"
                :class="{ error: $v.repeatPassword.$error }"
                @change="$v.repeatPassword.$touch()"
              )
              .error(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical.
        .auth__form
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.fname.$error }")
              input(
                type="text"
                placeholder="First Name"
                v-model="fname"
                :class="{ error: $v.fname.$error }"
                @change="$v.fname.$touch()"
              )
              .error(v-if="!$v.fname.required") Field is required
            .form-item(:class="{ errorInput: $v.sname.$error }")
              input(
                type="text"
                placeholder="Surname"
                v-model="sname"
                :class="{ error: $v.sname.$error }"
                @change="$v.sname.$touch()"
              )
              .error(v-if="!$v.sname.required") Field is required
            .form-item(:class="{ errorInput: $v.status.$error }")
              select(v-model='status')
                option(disabled='', value='') Who are you?
                option Investor
                option Startuper
                option Specialist
              span Choose: {{ status }}
              .error(v-if="!$v.status.required") Field is required
      form(@submit.prevent="onSubmit")
        .buttons-list
          button.button.button-primary(
            type="submit"
          )
            span(v-if="loading") Loading...
            span(v-else) Registration
        .buttons-list.buttons-list--info
          p.typo__p(v-if="submitStatus === 'OK'") Thanks for your submission!
          p.typo__p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
          p.typo__p(v-else) {{ submitStatus }}
          // p.typo__p(v-if="submitStatus === 'PENDING'") Sending...
        .buttons-list.buttons-list--info
          span Do you have an account?
            router-link(to="/login")  Enter Here
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

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
            this.submitStatus = err.message
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
