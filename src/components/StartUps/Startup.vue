<template lang="pug">
 .content-wrapper
   section
    .container
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-if="startup"
        )
          .ui-card.ui-card--shadow
              .task-item__info
                .task-item__main-info
                  span(v-if="startup.raisedfunds < startup.cost").ui-label.ui-label--light Зібрано: {{ startup.raisedfunds.toFixed(2) }}$
                  span(v-if="startup.raisedfunds >= startup.cost").ui-label.ui-label--success Зібрано: {{ startup.raisedfunds.toFixed(2) }}$
                  span.ui-label.ui-label--primary Потрібно: {{ startup.cost }}$
                .task-item__content
                  .task-item__header
                    span.ui-title-3 {{ startup.title }}
                    span(v-if="startup.percent").ui-title-4 Відсоток прибутку {{ startup.percent }}
                    span(v-if="!startup.percent || startup.percent === 0").ui-title-4 Благодійний формат
                  .task-item__body.margin-bottom-16
                    span.ui-text-regular.font {{ startup.shortdescription }}
                  .img-form1
                    img.image-srtp(:src='startup.imageUrl1' @click="openImg(startup.imageUrl1)" v-if="startup.imageUrl1 !== 'none'")
                    img.image-srtp(:src='startup.imageUrl2' @click="openImg(startup.imageUrl2)" v-if="startup.imageUrl2 !== 'none'")
                    img.image-srtp(:src='startup.imageUrl3' @click="openImg(startup.imageUrl3)" v-if="startup.imageUrl3 !== 'none'")
                  .task-item__body
                    span.ui-text-regular.font {{ startup.fulldescription }}
                  .task-iten__footer
                    router-link.router-link(
                      :to="{ name: 'userprofile', params: { id: startup.user } }"
                      ) Про автора
                    .buttons-list
                      .button(
                        v-if="checkStatus === 'Investor' && startup.raisedfunds < startup.cost && startup.approved === 'approved'"
                        @click="startupDonation(startup.title, startup.user, startup.percent)"
                        ).button--round.button-primary Підтримати
                      .button(
                        v-if="checkStatus === 'Admin' && startup.approved === 'nonApproved'"
                        @click="nonApprovedThisStartup(startup.title)"
                        ).button--round.button-light Відмовити
                      .button(
                        v-if="checkStatus === 'Admin' && startup.approved === 'nonApproved'"
                        @click="approvedThisStartup(startup.title)"
                        ).button--round.button-primary Ухвалити
    .ui-messageBox__wrapper(
      v-if="done"
      :class="{active: done}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Підтримати {{ titleDonation }}
          span.button-close(@click="cancelStartupDonation")
        .ui-messageBox__content
          p Введіть суму вказану в доларах $
        .ui-messageBox__content
          span.ui-text-smaller(style="color: #000") 1(один) відсоток з вказаної суми буде перераховано на рахунок "Start Idea"
        .form-item(:class="{ errorInput: $v.raisedfundsDonation.$error }")
          input(
            type="text"
            placeholder="Сума"
            v-model.number="raisedfundsDonation"
            :maxlength="8"
            @keypress="onlyForCurrency"
            :class="{ error: $v.raisedfundsDonation.$error }"
            @change="$v.raisedfundsDonation.$touch()"
          )
          p З вас зніме плату в розмірі {{ this.comis }} доларів $
          span Прибуток складе {{ this.invest }} доларів $
          .error(v-if="!$v.raisedfundsDonation.required") Поле обов&acuteязкове.
          .error(v-if="!$v.raisedfundsDonation.minValue")
            | Мінімальна сума підтримки = {{ $v.raisedfundsDonation.$params.minValue.min }}.
          .error(v-if="!$v.raisedfundsDonation.maxValue")
            | Максимальна сума підтримки = {{ $v.raisedfundsDonation.$params.maxValue.max }}.
        .ui-messageBox__footer
          .button.button-light(@click="cancelStartupDonation") Відміна
          .button.button-primary(@click="finishStartupDonation")
            span(v-if="loading") Завантаження...
            span(v-else) Підтримати
    .ui-messageBox__wrapper(
      v-if="open"
      :class="{active: open}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.button-close(@click="cancelOpenImg")
        .ui-messageBox__content
          img.image_popup(:src='imageUrl' @click="cancelOpenImg")
    .ui-messageBox__wrapper(
      v-if="approv"
      :class="{active: approv}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Ухвалити "{{ titleDonation }}"
          span.button-close(@click="cancelApprovedStartup")
        .ui-messageBox__content
          p Ви дійсно хочете ухвалити стартап "{{titleDonation}}"?
        .ui-messageBox__footer
          .button.button-light(@click="cancelApprovedStartup") Відміна
          .button.button-primary(@click="finishApprovedStartup")
            span(v-if="loading") Завантаження...
            span(v-else) Ухвалити
    .ui-messageBox__wrapper(
      v-if="nonapprov"
      :class="{active: nonapprov}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Відмовити "{{ titleDonation }}"
          span.button-close(@click="cancelNonApprovedStartup")
        .ui-messageBox__content
          p Ви дійсно хочете відмовити у схваленні стартапу "{{titleDonation}}"?
        .ui-messageBox__footer
          .button.button-light(@click="cancelNonApprovedStartup") Відміна
          .button.button-primary(@click="finishNonApprovedStartup")
            span(v-if="loading") Завантаження...
            span(v-else) Відмовити
</template>

<script>
import { required, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      done: false,
      approv: false,
      nonapprov: false,
      titleDonation: '',
      srtpId: null,
      userStartaper: '',
      raisedfundsDonation: null,
      percentDonation: this.invest,
      submitStatus: null,
      open: false,
      imageUrl: ''
    }
  },
  validations () {
    return {
      raisedfundsDonation: {
        required,
        minValue: minValue(10),
        maxValue: maxValue(this.maxDonat)
      }
    }
  },
  created: function () {
    this.openInfoStartup()
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.infoS).length) {
      await this.$store.dispatch('infoStartup')
    }
  },
  methods: {
    onlyForCurrency ($event) {
      // console.log($event.keyCode); //keyCodes value
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      // only allow number and one dot
      if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.raisedfundsDonation.indexOf('.') !== -1)) { // 46 is dot
        $event.preventDefault()
      }
      // restrict to 2 decimal places
      if (this.raisedfundsDonation != null && this.raisedfundsDonation.indexOf('.') > -1 && (this.raisedfundsDonation.split('.')[1].length > 1)) {
        $event.preventDefault()
      }
    },
    openImg (imgUrl) {
      this.open = !this.open
      this.imageUrl = imgUrl
    },
    cancelOpenImg () {
      this.open = !this.open
      this.imageUrl = ''
    },
    startupDonation (title, user, percent) {
      this.done = !this.done
      // console.log({id, title})
      this.srtpId = this.$route.params.id
      this.titleDonation = title
      this.userStartaper = user
      this.percentDonation = percent
    },
    // Cancel button (POPUP)
    cancelStartupDonation () {
      this.done = !this.done
      // Reset
      this.srtpId = null
      this.titleDonation = ''
      this.userStartaper = ''
      this.percentDonation = null
    },
    // Done button
    finishStartupDonation () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        console.log('submit!')
        this.$store.dispatch('donationStartup', {
          id: this.srtpId,
          raisedfunds: this.raisedfundsDonation,
          user: this.userStartaper,
          title: this.titleDonation,
          profitDon: this.invest
        })
        this.done = !this.done
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
    },
    approvedThisStartup (title) {
      this.approv = !this.approv
      // console.log({id, title})
      this.srtpId = this.$route.params.id
      this.titleDonation = title
    },
    nonApprovedThisStartup (title) {
      this.nonapprov = !this.nonapprov
      // console.log({id, title})
      this.srtpId = this.$route.params.id
      this.titleDonation = title
    },
    cancelApprovedStartup () {
      this.approv = !this.approv
      // Reset
      this.srtpId = null
      this.titleDonation = ''
    },
    cancelNonApprovedStartup () {
      this.nonapprov = !this.nonapprov
      // Reset
      this.srtpId = null
      this.titleDonation = ''
    },
    finishApprovedStartup () {
      this.$store.dispatch('approvedStartup', {
        id: this.srtpId,
        approved: 'approved'
      })
      this.approv = !this.approv
    },
    finishNonApprovedStartup () {
      this.$store.dispatch('approvedStartup', {
        id: this.srtpId,
        approved: 'denied'
      })
      this.nonapprov = !this.nonapprov
    },
    openInfoStartup () {
      const startupId = this.$route.params.id
      this.$store.dispatch('infoStartup', {
        id: startupId
      })
    }
  },
  computed: {
    comis () {
      return parseFloat((this.raisedfundsDonation / 100 * 100.5).toFixed(2))
    },
    invest () {
      return parseFloat((this.raisedfundsDonation / 100 * this.$store.getters.infoS.percent).toFixed(2))
    },
    startup () {
      return this.$store.getters.infoS
    },
    maxDonat () {
      var difference = this.$store.getters.infoS.cost - this.$store.getters.infoS.raisedfunds
      return difference.toFixed(2)
    },
    checkStatus () {
      return this.$store.getters.status
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus">
.content-wrapper
  min-height 100%

.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px
.buttons-list
  text-align right

.ui-messageBox__content
  display flex
  justify-content center

.button
  margin 0px 8px

.router-link
  color #444ce0

.task-item__body
  white-space pre-line

.margin-bottom-16
  margin-bottom 16px

.image_popup
  display flex
  text-align center
  flex 0 1 auto
  max-width 1000px
  max-height 700px
  padding 10px
  justify-content center

.img-form1
  display flex
  text-align right
  flex 0 1 auto
  width 33%
  height auto
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

input
  &.error
    border-color #fc5c65

.font
  margin-bottom 10px
  color #000

.image-srtp
  object-fit cover
  flex 0 1 auto
  border 3px solid #999999
  width 100%
  height 100%
  margin 12px
</style>
