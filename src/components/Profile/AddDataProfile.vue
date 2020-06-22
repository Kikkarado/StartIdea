<template lang="pug">
 .content-wrapper
   section
    .container
      .form-title
        span.ui-title-2 Налаштування даних профілю
      .auth
        .img_form
          img.image_avatar(:src='imageUrl' class="scale" v-if="imageUrl")
          img.image_avatar(src='https://image.flaticon.com/icons/svg/2960/2960006.svg' v-else)
          button.button-img.button-primary(
            @click="onPickFile"
          )
            span(v-if="loading")
            span(v-else)
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
                p Рік {{ this.corectDate }}
              .form-date
                p Місяць
              .form-date
                p День
            .form-date
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
              .form-date(:class="{ errorInput: $v.monthofbirth.$error }")
                input(
                  :disabled="!this.yearofbirth"
                  type="text"
                  placeholder="1-12"
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
              .form-date(:class="{ errorInput: $v.dayofbirth.$error }")
                input(
                  :disabled="!this.monthofbirth"
                  type="text"
                  :placeholder="this.dayplaceholde"
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
                span.ui-text-smaller(v-if="aboutme.length < 70" style="color: #000")  (Необхідно ще мінімум {{this.counmedescmin - aboutme.length}} символів)
                span.ui-text-smaller(v-if="aboutme.length >= 70" style="color: #000")  (Залишилось {{this.counmedescmax - aboutme.length}} символів)
              textarea.textarea(
                type="text"
                placeholder="Про мене (Максимум 800 літер, мінімум 70 літер)"
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
      image: null,
      dayplaceholde: '',
      dayAmount: null,
      counmedescmin: 70,
      counmedescmax: 800
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
  validations () {
    return {
      fname: {
        required
      },
      sname: {
        required
      },
      dayofbirth: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(this.dayAmount)
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
        minLength: minLength(this.counmedescmin),
        maxLength: maxLength(this.counmedescmax)
      }
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
    },
    corDate (dayplaceholde, dayAmount) {
      this.dayplaceholde = dayplaceholde
      this.dayAmount = dayAmount
    }
  },
  computed: {
    checkStatus () {
      return this.$store.getters.status
    },
    profFil () {
      return this.$store.getters.info
    },
    corectDate () {
      const cYear = !((this.yearofbirth % 4) || (!(this.yearofbirth % 100) && (this.yearofbirth % 400)))
      if (this.monthofbirth === 1 || this.monthofbirth === 3 || this.monthofbirth === 5 || this.monthofbirth === 7 || this.monthofbirth === 8 || this.monthofbirth === 10 || this.monthofbirth === 12) {
        const dayplaceholde = '(1-31)'
        const dayAmount = 31
        return this.corDate(dayplaceholde, dayAmount)
      } else if (this.monthofbirth === 4 || this.monthofbirth === 6 || this.monthofbirth === 9 || this.monthofbirth === 11) {
        const dayplaceholde = '(1-30)'
        const dayAmount = 30
        return this.corDate(dayplaceholde, dayAmount)
      }
      if (cYear === true && this.monthofbirth === 2) {
        const dayplaceholde = '(1-29)'
        const dayAmount = 29
        return this.corDate(dayplaceholde, dayAmount)
      } else if (cYear !== true && this.monthofbirth === 2) {
        const dayplaceholde = '(1-28)'
        const dayAmount = 28
        return this.corDate(dayplaceholde, dayAmount)
      }
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

.auth__form
  flex 0 1 auto
  width 18.4%
  height 100%
  padding 10px

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

.button-img
  min-width 48px
  min-height 48px
  background-image url("https://img.icons8.com/fluent/48/000000/stack-of-photos.png")

.button
  margin-right 50px
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

.img_form
  display inline-block
  text-align right
  flex 0 1 auto
  width 200px
  height 200px
  padding 10px
  justify-content right

.image_avatar
  object-fit cover
  flex 0 1 auto
  border 3px solid #999999
  width 100%
  height 100%
  border-radius 50%
</style>
