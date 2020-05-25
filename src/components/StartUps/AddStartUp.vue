<template lang="pug">
 .content-wrapper
   section
    .container
      .auth
        .auth__form
          span.ui-title-2 Створення стартапу
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.title.$error }")
              span Назва стартапу
              input(
                type="text"
                placeholder="Назва"
                v-model="title"
                :maxlength="36"
                :class="{ error: $v.title.$error }"
                @change="$v.title.$touch()"
              )
              .error(v-if="!$v.title.required") Поле обов&acuteязкове.
            .form-item(:class="{ errorInput: $v.shortdescription.$error }")
              span Короткий опис стартапу
              textarea(
                type="text"
                placeholder="Короткий опис"
                v-model="shortdescription"
                :class="{ error: $v.shortdescription.$error }"
                @change="$v.shortdescription.$touch()"
              )
              .error(v-if="!$v.shortdescription.required") Поле обов&acuteязкове.
              .error(v-if="!$v.shortdescription.maxLength")
                | У короткому описі має бути не більше {{ $v.shortdescription.$params.maxLength.max }} літер.
            .form-item(:class="{ errorInput: $v.fulldescription.$error }")
              span Повний опис стартапу
              textarea.textarea(
                type="text"
                placeholder="Повний опис"
                v-model="fulldescription"
                :class="{ error: $v.fulldescription.$error }"
                @change="$v.fulldescription.$touch()"
              )
              .error(v-if="!$v.fulldescription.required") Поле обов&acuteязкове.
              .error(v-if="!$v.fulldescription.minLength")
                | У повному описі має бути не менше {{ $v.fulldescription.$params.minLength.min }} літер.
              .error(v-if="!$v.fulldescription.maxLength")
                | У повному описі має бути не більше {{ $v.fulldescription.$params.maxLength.max }} літер.
            .form-item(:class="{ errorInput: $v.cost.$error }")
              span Необхідна сума в $
              input(
                type="text"
                placeholder="Сума"
                v-model.number="cost"
                :maxlength="9"
                :class="{ error: $v.cost.$error }"
                @change="$v.cost.$touch()"
              )
              .error(v-if="!$v.cost.required") Поле обов&acuteязкове.
              .error(v-if="!$v.cost.minValue")
                | Мінімальна сума повинна дорівнювати {{ $v.cost.$params.minValue.min }}.
              .error(v-if="!$v.cost.maxValue")
                | Максимальна сума повинна дорівнювати {{ $v.cost.$params.maxValue.max }}.
            .buttons-list
              button.button.button-primary(
                type="submit"
              )
                span(v-if="loading") Завантаження...
                span(v-else) Додати стартап
            .buttons-list.buttons-list--info
              p.typo__p(v-if="submitStatus === 'OK'") Ваш стартап додан.
              p.typo__p(v-if="submitStatus === 'ERROR'") Будь ласка, заповніть форму правильно.
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
.content-wrapper
  min-height 100%

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

textarea,
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
