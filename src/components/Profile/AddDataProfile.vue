<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__form
          span.ui-title-2 Settings Profile
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
                placeholder="Surame"
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
            .buttons-list
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
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      fname: '',
      sname: '',
      status: '',
      submitStatus: null
    }
  },
  validations: {
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
        const user = {
          fname: this.fname,
          sname: this.sname,
          status: this.status
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
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus" scoped>
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
