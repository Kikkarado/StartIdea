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
          .form_img
            .img_form
              img.image-startup(:src='imageUrl1' class="scale" v-if="imageUrl1")
              img.image-startup(src='https://image.flaticon.com/icons/svg/1948/1948547.svg' v-else)
            input(
              type="file"
              style="display: none"
              ref="fileInput1"
              accept="image/*"
              @change="onFilePicked1"
            )
            .img_form
              img.image-startup(:src='imageUrl2' class="scale" v-if="imageUrl2")
              img.image-startup(src='https://image.flaticon.com/icons/svg/1948/1948547.svg' v-else)
            input(
              type="file"
              style="display: none"
              ref="fileInput2"
              accept="image/*"
              @change="onFilePicked2"
            )
            .img_form
              img.image-startup(:src='imageUrl3' class="scale" v-if="imageUrl3")
              img.image-startup(src='https://image.flaticon.com/icons/svg/1948/1948547.svg' v-else)
            input(
              type="file"
              style="display: none"
              ref="fileInput3"
              accept="image/*"
              @change="onFilePicked3"
            )
          .form-button
            .button-list
            button.button-img.button-light(
              @click="onPickFile1"
            ) №1
            button.button-img.button-light(
              @click="onPickFile2"
            ) №2
            button.button-img.button-light(
              @click="onPickFile3"
            ) №3
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.cost.$error }")
              span Необхідна сума в гривнях &#8372
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
                :disabled='loading'
              )
                span(v-if="loading" ) Завантаження...
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
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      fulldescription: '',
      cost: 1000,
      image1: null,
      image2: null,
      image3: null
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
    onPickFile1 () {
      this.$refs.fileInput1.click()
    },
    onPickFile2 () {
      this.$refs.fileInput2.click()
    },
    onPickFile3 () {
      this.$refs.fileInput3.click()
    },
    onFilePicked1 (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Error')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl1 = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image1 = files[0]
    },
    onFilePicked2 (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Error')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl2 = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image2 = files[0]
    },
    onFilePicked3 (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Error')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl3 = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image3 = files[0]
    },
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const startup = {
          title: this.title,
          shortdescription: this.shortdescription,
          fulldescription: this.fulldescription,
          image1: this.image1,
          image2: this.image2,
          image3: this.image3,
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

.form_img,
.form-button,
.auth
  display flex
  justify-content center
.auth__banner,
.auth__form
  width 70%

.img_form
  display inline-block
  text-align right
  flex 0 1 auto
  max-width 100%
  max-height 400px
  padding 10px
  justify-content right

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

.button-img
  margin 0px 12px
  width 48px
  height 48px
  color #000
  background-image url("https://img.icons8.com/fluent/48/000000/stack-of-photos.png")

.scale
  transition 1s

.scale:hover
  transform scale(1.2)

.image-startup
  object-fit cover
  flex 0 1 auto
  border 3px solid #999999
  max-width 100%
  max-height 100%

</style>
