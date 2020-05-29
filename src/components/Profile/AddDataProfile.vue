<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Налаштування даних профілю
      .auth
        .auth__form1
          .img_fomr
            img.image_avatar(:src='imageUrl' class="scale")
          .buttons-list
            button.button.button-primary(
              @click="onPickFile"
              type="submit"
            )
              span(v-if="loading") Збереження...
              span(v-else) Завантажити зображення
            input(
              type="file"
              style="display: none"
              ref="fileInput"
              accept="image/*"
              @change="onFilePicked"
            )
        .auth__form1
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.fname.$error }")
              span І&acuteмя
              input(
                type="text"
                placeholder="І'мя"
                v-model="fname"
                :maxlength="20"
                :class="{ error: $v.fname.$error }"
                @change="$v.fname.$touch()"
              )
              .error(v-if="!$v.fname.required") Поле обов&acuteязкове.
            .form-item(:class="{ errorInput: $v.sname.$error }")
              span Прізвище
              input(
                type="text"
                placeholder="Прізвище"
                v-model="sname"
                :maxlength="20"
                :class="{ error: $v.sname.$error }"
                @change="$v.sname.$touch()"
              )
              .error(v-if="!$v.sname.required") Поле обов&acuteязкове.
            .form-date
              .form-date
                p День
              .form-date
                p Місяць
              .form-date
                p Рік
            .form-date
              .form-date(:class="{ errorInput: $v.dayofbirth.$error }")
                input(
                  type="text"
                  placeholder="(01-31)"
                  v-model.number="dayofbirth"
                  :maxlength="2"
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
                  :maxlength="2"
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
                  placeholder="(1900-2003)"
                  v-model.number="yearofbirth"
                  :maxlength="4"
                  :class="{ error: $v.yearofbirth.$error }"
                  @change="$v.yearofbirth.$touch()"
                )
                .error(v-if="!$v.yearofbirth.required")
                .error(v-if="!$v.yearofbirth.minValue")
                  | {{ $v.yearofbirth.$params.minValue.min }}
                .error(v-if="!$v.yearofbirth.maxValue")
                  | {{ $v.yearofbirth.$params.maxValue.max }}
            .form-item(:class="{ errorInput: $v.email.$error }")
              span Ваша контактна електронна адреса
              input(
                type="email"
                placeholder="Електронна адреса"
                v-model="email"
                :maxlength="25"
                :class="{ error: $v.email.$error }"
                @change="$v.email.$touch()"
              )
              .error(v-if="!$v.email.required") Поле обов&acuteязкове.
              .error(v-if="!$v.email.email") Email is not correct
        .auth__form2
          form(@submit.prevent="onSubmit")
            .form-item(:class="{ errorInput: $v.phone.$error }")
              span Ваш номер телефону
              input(
                type="tel"
                placeholder="+38 (999) 999-99-99"
                v-mask="'+38 (999) 999-99-99'"
                v-model.tel="phone"
                :class="{ error: $v.phone.$error }"
                @change="$v.phone.$touch()"
              )
              .error(v-if="!$v.phone.required") Поле обов&acuteязкове.
            .form-item(:class="{ errorInput: $v.aboutme.$error }")
              span Про вас
              textarea.textarea(
                type="text"
                placeholder="Про мене"
                v-model="aboutme"
                :class="{ error: $v.aboutme.$error }"
                @change="$v.aboutme.$touch()"
              )
              .error(v-if="!$v.aboutme.required") Поле обов&acuteязкове.
              .error(v-if="!$v.aboutme.minLength")
                | У описі має бути не менше {{ $v.aboutme.$params.minLength.min }} літер.
              .error(v-if="!$v.aboutme.maxLength")
                | У описі має бути не більше {{ $v.aboutme.$params.maxLength.max }} літер.
            .buttons-list
              button.button.button-light(@click="cancelAdd", name="cancel") Відміна
              button.button.button-primary(
                type="submit"
              )
                span(v-if="loading") Збереження...
                span(v-else) Зберегти
            .buttons-list.buttons-list--info
              p.typo__p(v-if="submitStatus === 'OK'") Дані оновлено.
              p.typo__p(v-if="submitStatus === 'ERROR'") Будь ласка, заповніть форму правильно.
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
      imageUrl: '',
      dayofbirth: null,
      monthofbirth: null,
      yearofbirth: null,
      email: '',
      phone: null,
      aboutme: '',
      submitStatus: null,
      image: null
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
    this.imageUrl = this.profFil.imageUrl
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
      maxValue: maxValue(2003)
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
      minLength: minLength(70),
      maxLength: maxLength(800)
    }
  },
  methods: {
    cancelAdd () {
      this.$router.push('/profile')
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Error')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.$store.dispatch('addUserData', {
          fname: this.fname,
          sname: this.sname,
          image: this.image,
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
    checkStatus () {
      return this.$store.getters.status
    },
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
.content-wrapper
  min-height 100%

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

.textarea
  height 145px
  &.error
    border-color #fc5c65

select,
input
  &.error
    border-color #fc5c65

.button
  margin 0px 12px

.buttons-list
  text-align center
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0

.scale
  transition 1s

.scale:hover
  transform scale(2)

.image_avatar
  flex 0 1 auto
  border 3px solid #999999
  width 100%
  height auto
  border-radius 50%
</style>
