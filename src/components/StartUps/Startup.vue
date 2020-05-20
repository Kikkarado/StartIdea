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
                    span.ui-title-2 {{ startup.title }}
                  .task-item__body
                    p.ui-text-regular {{ startup.description }}
                  .task-iten__footer
                    router-link(
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
          input(
            type="number"
            v-model.number="raisedfundsDonation"
          )
        .ui-messageBox__footer
          .button.button-light(@click="cancelStartupDonation") Cancel
          .button.button-primary(@click="finishStartupDonation") OK
</template>

<script>
export default {
  data () {
    return {
      done: false,
      titleDonation: '',
      srtpId: null,
      userStartaper: ''
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
      this.$store.dispatch('donationStartup', {
        id: this.srtpId,
        raisedfunds: this.raisedfundsDonation,
        user: this.userStartaper
      })
      this.done = !this.done
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
</style>
