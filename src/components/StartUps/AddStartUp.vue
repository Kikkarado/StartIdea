<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__form
          span.ui-title-2 Add Start Up
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.title.$error }")
              input(
                type="text"
                placeholder="Title"
                v-model="title"
                :class="{ error: $v.title.$error }"
                @change="$v.title.$touch()"
              )
              .error(v-if="!$v.title.required") Field is required
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
            .form-item(:class="{ errorInput: $v.cost.$error }")
              input(
                type="text"
                placeholder="Cost in $"
                v-model="cost"
                :class="{ error: $v.cost.$error }"
                @change="$v.cost.$touch()"
              )
              .error(v-if="!$v.cost.required") Field is required
              .error(v-if="!$v.cost.minValue")
                | The minimum amount must be equal {{ $v.cost.$params.minValue.min }}.
              .error(v-if="!$v.cost.maxValue")
                | The maximum amount must be equal {{ $v.cost.$params.maxValue.max }}.
            .buttons-list
              button.button.button-primary(
                type="submit"
              )
                span(v-if="loading") Loading...
                span(v-else) Add startup
            .buttons-list.buttons-list--info
              p.typo__p(v-if="submitStatus === 'OK'") Thanks for your submission!
              p.typo__p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
              p.typo__p(v-else) {{ submitStatus }}
</template>

<script>
import { required, minLength, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      title: '',
      description: '',
      cost: ''
    }
  },
  validations: {
    title: {
      required
    },
    description: {
      required,
      minLength: minLength(10)
    },
    cost: {
      required,
      minValue: minValue(1000),
      maxValue: maxValue(100000000)
    }
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const startup = {
          title: this.title,
          description: this.description,
          cost: this.cost,
          completed: false,
          raisedfunds: 0
        }
        this.$store.dispatch('newStartUp', startup)
          .then(() => {
            console.log('Added!')
            console.log(startup)
            this.submitStatus = 'OK'
            this.$router.push('/myStartUps')
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
