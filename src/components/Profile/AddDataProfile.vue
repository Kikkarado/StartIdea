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
              input(
                type="text"
                placeholder="First Name"
                v-model="profFil.fname"
                :class="{ error: $v.fname.$error }"
                @change="$v.fname.$touch()"
              )
              .error(v-if="!$v.fname.required") Field is required
            .form-item(:class="{ errorInput: $v.sname.$error }")
              input(
                type="text"
                placeholder="Surame"
                v-model="profFil.sname"
                :class="{ error: $v.sname.$error }"
                @change="$v.sname.$touch()"
              )
              .error(v-if="!$v.sname.required") Field is required
            .form-date
              .form-date(:class="{ errorInput: $v.day.$error }")
                input(
                  type="number"
                  placeholder="Day"
                  v-model.number="profFil.day"
                  :class="{ error: $v.day.$error }"
                  @change="$v.day.$touch()"
                )
                .error(v-if="!$v.day.required")
                .error(v-if="!$v.day.minValue")
                  | {{ $v.day.$params.minValue.min }}
                .error(v-if="!$v.day.maxValue")
                  | {{ $v.day.$params.maxValue.max }}
              .form-date(:class="{ errorInput: $v.month.$error }")
                input(
                  type="number"
                  placeholder="Month"
                  v-model.number="profFil.month"
                  :class="{ error: $v.month.$error }"
                  @change="$v.month.$touch()"
                )
                .error(v-if="!$v.month.required")
                .error(v-if="!$v.month.minValue")
                  | {{ $v.month.$params.minValue.min }}
                .error(v-if="!$v.month.maxValue")
                  | {{ $v.month.$params.maxValue.max }}
              .form-date(:class="{ errorInput: $v.year.$error }")
                input(
                  type="number"
                  placeholder="Year"
                  v-model.number="profFil.year"
                  :class="{ error: $v.year.$error }"
                  @change="$v.year.$touch()"
                )
                .error(v-if="!$v.year.required")
                .error(v-if="!$v.year.minValue")
                  | {{ $v.year.$params.minValue.min }}
                .error(v-if="!$v.year.maxValue")
                  | {{ $v.year.$params.maxValue.max }}
            .form-item(:class="{ errorInput: $v.email.$error }")
              input(
                type="email"
                placeholder="Email"
                v-model="profFil.email"
                :class="{ error: $v.email.$error }"
                @change="$v.email.$touch()"
              )
              .error(v-if="!$v.email.required") Field is required
              .error(v-if="!$v.email.email") Email is not correct
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.number.$error }")
              input(
                type="text"
                placeholder="+38 (999) 999-99-99"
                v-mask="'+38 (999) 999-99-99'"
                v-model="profFil.number"
                :class="{ error: $v.number.$error }"
                @change="$v.number.$touch()"
              )
              .error(v-if="!$v.number.required") Field is required
            .form-item(:class="{ errorInput: $v.description.$error }")
              textarea(
                type="text"
                placeholder="Description"
                v-model="description"
                :class="{ error: $v.description.$error }"
                @change="$v.description.$touch()"
              )
              .error(v-if="!$v.description.required") Field is required
              .error(v-if="!$v.description.minLength")
                | Description must have at least {{ $v.description.$params.minLength.min }} letters.
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
import { required, email, minValue, maxValue, minLength } from 'vuelidate/lib/validators'
import Vue from 'vue'
const VueInputMask = require('vue-inputmask').default

Vue.use(VueInputMask)

export default {
  data () {
    return {
      fname: '',
      sname: '',
      day: null,
      month: null,
      year: null,
      email: '',
      number: null,
      description: '',
      submitStatus: null
    }
  },
  created: function () {
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
    day: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(31)
    },
    month: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(12)
    },
    year: {
      required,
      minValue: minValue(1900),
      maxValue: maxValue(2020)
    },
    email: {
      required,
      email
    },
    number: {
      required
    },
    description: {
      required,
      minLength: minLength(100)
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
        const user = {
          fname: this.fname,
          sname: this.sname
        }
        this.$store.dispatch('addUserData', user)
          .then(() => {
            console.log('Added!')
            this.submitStatus = 'OK'
            this.$router.push('/profile')
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
  text-align center
  justify-content center

.auth__form1,
.auth__form2
  width 30%
  padding 10px

.form-date
  width 100%
  display flex
  padding 0px 3px
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
