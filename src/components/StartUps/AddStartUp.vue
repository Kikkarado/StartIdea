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
            .form-item(:class="{ errorInput: $v.shortdescription.$error }")
              textarea(
                type="text"
                placeholder="Description"
                v-model="shortdescription"
                :class="{ error: $v.shortdescription.$error }"
                @change="$v.shortdescription.$touch()"
              )
              .error(v-if="!$v.shortdescription.required") Field is required
              .error(v-if="!$v.shortdescription.maxLength")
                | Description must have at least {{ $v.shortdescription.$params.maxLength.max }} letters.
            .form-item(:class="{ errorInput: $v.fulldescription.$error }")
              textarea.textarea(
                type="text"
                placeholder="Description"
                v-model="fulldescription"
                :class="{ error: $v.fulldescription.$error }"
                @change="$v.fulldescription.$touch()"
              )
              .error(v-if="!$v.fulldescription.required") Field is required
              .error(v-if="!$v.fulldescription.minLength")
                | Description must have at least {{ $v.fulldescription.$params.minLength.min }} letters.
              .error(v-if="!$v.fulldescription.maxLength")
                | Description must have at least {{ $v.fulldescription.$params.maxLength.max }} letters.
            .form-item(:class="{ errorInput: $v.cost.$error }")
              input(
                type="number"
                placeholder="Cost in $"
                v-model.number="cost"
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
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      title: '',
      shortdescription: '',
      fulldescription: '',
      cost: 1000
    }
  },
  validations: {
    title: {
      required
    },
    shortdescription: {
      required,
      maxLength: maxLength(300)
    },
    fulldescription: {
      required,
      minLength: minLength(500),
      maxLength: maxLength(15000)
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
          shortdescription: this.shortdescription,
          fulldescription: this.fulldescription,
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
            window.location.reload('/myStartUps')
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
  justify-content center
.auth__banner,
.auth__form
  width 70%

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color #fc5c65
  &.errorInput
    .error
      display block

.textarea
  height 350px
  &.error
    border-color #fc5c65

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
