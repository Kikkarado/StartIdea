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
                  span Collected {{ startup.raisedfunds }} : {{ startup.cost }}
                .task-item__content
                  .task-item__header
                    span.ui-title-3 {{ startup.title }}
                  .task-item__body
                    p.ui-text-regular.font {{ startup.shortdescription }}
                  .task-item__body
                    p.ui-text-regular.font {{ startup.fulldescription }}
                  .task-iten__footer
                    router-link.router-link(
                      :to="{ name: 'userprofile', params: { id: startup.user } }"
                      ) About author
                    .buttons-list
                      .button(
                        v-if="checkStatus === 'Investor'"
                        @click="startupDonation(startup.title, startup.user)"
                        ).button--round.button-primary Donation
    .ui-messageBox__wrapper(
      v-if="done"
      :class="{active: done}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Donation
          span.button-close(@click="cancelStartupDonation")
        .ui-messageBox__content
          p {{ titleDonation }}
          p Enter the amount of donation
        .form-item(:class="{ errorInput: $v.raisedfundsDonation.$error }")
          input(
            type="number"
            placeholder="Amount"
            v-model.number="raisedfundsDonation"
            :class="{ error: $v.raisedfundsDonation.$error }"
            @change="$v.raisedfundsDonation.$touch()"
          )
          .error(v-if="!$v.raisedfundsDonation.required") Field is required
          .error(v-if="!$v.raisedfundsDonation.minValue")
            | The minimum amount must be equal {{ $v.raisedfundsDonation.$params.minValue.min }}.
          .error(v-if="!$v.raisedfundsDonation.maxValue")
            | The maximum amount must be equal {{ $v.raisedfundsDonation.$params.maxValue.max }}.
        .ui-messageBox__footer
          .button.button-light(@click="cancelStartupDonation") Cancel
          .button.button-primary(@click="finishStartupDonation")
            span(v-if="loading") Loading...
            span(v-else) Donation
</template>

<script>
import { required, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      done: false,
      titleDonation: '',
      srtpId: null,
      userStartaper: '',
      raisedfundsDonation: null,
      submitStatus: null
    }
  },
  validations: {
    raisedfundsDonation: {
      required,
      minValue: minValue(10),
      maxValue: maxValue(1000000)
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
    startupDonation (title, user) {
      this.done = !this.done
      // console.log({id, title})
      this.srtpId = this.$route.params.id
      this.titleDonation = title
      this.userStartaper = user
    },
    // Cancel button (POPUP)
    cancelStartupDonation () {
      this.done = !this.done
      // Reset
      this.srtpId = null
      this.titleDonation = ''
      this.userStartaper = ''
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
          user: this.userStartaper
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
    openInfoStartup () {
      const startupId = this.$route.params.id
      this.$store.dispatch('infoStartup', {
        id: startupId
      })
    }
  },
  computed: {
    startup () {
      return this.$store.getters.infoS
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
.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px
.buttons-list
  text-align right

.router-link
  color #444ce0

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
</style>
