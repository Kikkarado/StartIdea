<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Settings Profile
      .auth
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.fname.$error }")
              span First Name
              input(
                type="text"
                placeholder="First Name"
                v-model="fname"
                :class="{ error: $v.fname.$error }"
                @change="$v.fname.$touch()"
              )
              .error(v-if="!$v.fname.required") Field is required
            .form-item(:class="{ errorInput: $v.sname.$error }")
              span Surmame
              input(
                type="text"
                placeholder="Surmame"
                v-model="sname"
                :class="{ error: $v.sname.$error }"
                @change="$v.sname.$touch()"
              )
              .error(v-if="!$v.sname.required") Field is required
            .form-date
              .form-date
                p Day
              .form-date
                p Month
              .form-date
                p Year
            .form-date
              .form-date(:class="{ errorInput: $v.dayofbirth.$error }")
                input(
                  type="text"
                  placeholder="(01-31)"
                  v-model.number="dayofbirth"
                  :class="{ error: $v.dayofbirth.$error }"
                  @change="$v.dayofbirth.$touch()"
                )
                .error(v-if="!$v.dayofbirth.required")
                .error(v-if="!$v.dayofbirth.minValue")
                  | {{ $v.dayofbirth.$params.minValue.min }}
                .error(v-if="!$v.dayofbirth.maxValue")
                  | {{ $v.dayofbirth.$params.maxValue.max }}
              .form-date(:class="{ errorInput: $v.monthofbirth.$error }")
                input(
                  type="text"
                  placeholder="(01-12)"
                  v-model.number="monthofbirth"
                  :class="{ error: $v.monthofbirth.$error }"
                  @change="$v.monthofbirth.$touch()"
                )
                .error(v-if="!$v.monthofbirth.required")
                .error(v-if="!$v.monthofbirth.minValue")
                  | {{ $v.monthofbirth.$params.minValue.min }}
                .error(v-if="!$v.monthofbirth.maxValue")
                  | {{ $v.monthofbirth.$params.maxValue.max }}
              .form-date(:class="{ errorInput: $v.yearofbirth.$error }")
                input(
                  type="text"
                  placeholder="(1900-2020)"
                  v-model.number="yearofbirth"
                  :class="{ error: $v.yearofbirth.$error }"
                  @change="$v.yearofbirth.$touch()"
                )
                .error(v-if="!$v.yearofbirth.required")
                .error(v-if="!$v.yearofbirth.minValue")
                  | {{ $v.yearofbirth.$params.minValue.min }}
                .error(v-if="!$v.yearofbirth.maxValue")
                  | {{ $v.yearofbirth.$params.maxValue.max }}
            .form-item(:class="{ errorInput: $v.email.$error }")
              span Contact email
              input(
                type="email"
                placeholder="Email"
                v-model="email"
                :class="{ error: $v.email.$error }"
                @change="$v.email.$touch()"
              )
              .error(v-if="!$v.email.required") Field is required
              .error(v-if="!$v.email.email") Email is not correct
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.phone.$error }")
              span Your phone number
              input(
                type="tel"
                placeholder="+38 (999) 999-99-99"
                v-mask="'+38 (999) 999-99-99'"
                v-model.tel="phone"
                :class="{ error: $v.phone.$error }"
                @change="$v.phone.$touch()"
              )
              .error(v-if="!$v.phone.required") Field is required
            .form-item(:class="{ errorInput: $v.aboutme.$error }")
              span About you
              textarea(
                type="text"
                placeholder="About me"
                v-model="aboutme"
                :class="{ error: $v.aboutme.$error }"
                @change="$v.aboutme.$touch()"
              )
              .error(v-if="!$v.aboutme.required") Field is required
              .error(v-if="!$v.aboutme.minLength")
                | Description must have at least {{ $v.aboutme.$params.minLength.min }} letters.
              .error(v-if="!$v.aboutme.maxLength")
                | Description must have at least {{ $v.aboutme.$params.maxLength.max }} letters.
            .buttons-list
              button.button.button-light(@click="cancelAdd", name="cancel") Cancel
              button.button.button-primary(
                type="submit"
              )
                span(v-if="loading") Loading...
                span(v-else) Add profile
            .buttons-list.buttons-list--info
              p.typo__p(v-if="submitStatus === 'OK'") Thanks for your submission!
              p.typo__p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
              p.typo__p(v-else) {{ submitStatus }}
</template>

<script>
import { required, email, minValue, maxValue, maxLength, minLength } from 'vuelidate/lib/validators'
import Vue from 'vue'
const VueInputMask = require('vue-inputmask').default

Vue.use(VueInputMask)

export default {
  data () {
    return {
      fname: '',
      sname: '',
      dayofbirth: null,
      monthofbirth: null,
      yearofbirth: null,
      email: '',
      phone: null,
      aboutme: '',
      submitStatus: null
    }
  },
  created: function () {
    this.fname = this.profFil.fname
    this.sname = this.profFil.sname
    this.dayofbirth = this.profFil.dayofbirth
    this.monthofbirth = this.profFil.monthofbirth
    this.yearofbirth = this.profFil.yearofbirth
    this.email = this.profFil.email
    this.phone = this.profFil.phone
    this.aboutme = this.profFil.aboutme
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
  },
  validations: {
    fname: {
      required
    },
    sname: {
      required
    },
    dayofbirth: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(31)
    },
    monthofbirth: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(12)
    },
    yearofbirth: {
      required,
      minValue: minValue(1900),
      maxValue: maxValue(2020)
    },
    email: {
      required,
      email
    },
    phone: {
      required
    },
    aboutme: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(250)
    }
  },
  methods: {
    cancelAdd () {
      this.$router.push('/profile')
    },
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.$store.dispatch('addUserData', {
          fname: this.fname,
          sname: this.sname,
          dayofbirth: this.dayofbirth,
          monthofbirth: this.monthofbirth,
          yearofbirth: this.yearofbirth,
          email: this.email,
          phone: this.phone,
          aboutme: this.aboutme
        })
          .then(() => {
            console.log('Added!')
            this.submitStatus = 'OK'
            this.$router.push('/profile')
            window.location.reload('/profile')
          })
          .catch(err => {
            this.submitStatus = err.message
          })
      }
    }
  },
  computed: {
    profFil () {
      return this.$store.getters.info
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus" scoped>
.form-title
  text-align center

.auth
  display flex
  text-align left
  justify-content center

.auth__form1,
.auth__form2
  width 30%
  padding 10px

.form-date
  width 100%
  display flex
  padding 0px 3px
  justify-content center
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color #fc5c65
  &.errorInput
    .error
      display block

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
textarea,
input
  &.error
    border-color #fc5c65

.button
  margin 0px 12px

.buttons-list
  text-align center
  margin 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0
</style>
