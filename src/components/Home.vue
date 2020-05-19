<template lang="pug">
  .content-wrapper
    section
    .container
      .auth
        .auth__form
          span.ui-title-2 Home
        .buttons-list
          .button.button--round.button-default(
            @click="filter = 'complete'"
          ) Active
          .button.button--round.button-default(
            @click="filter = 'notcomplete'"
          ) Completed
          .button.button--round.button-default(
            @click="filter = 'all'"
          ) All
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="startups in allStartups"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow
              .task-item__info
                .task-item__main-info
                  p.typo__p(v-if="startups.completed === true") Completed
                  span Cost: {{ startups.raisedfunds }} : {{ startups.cost }}
                .task-item__content
                  .task-item__header
                    span.ui-title-2 {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular {{ startups.description }}
                  .task-item__foter
                    .buttons-list
                      .button(
                        v-if="checkStatus === 'Investor'"
                        @click="startupDonation(startups.id, startups.title)"
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
      raisedfundsDonation: 0
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.startupsAll).length) {
      await this.$store.dispatch('fetchAllStartups')
    }
  },
  methods: {
    startupDonation (id, title) {
      this.done = !this.done
      // console.log({id, title})
      this.srtpId = id
      this.titleDonation = title
    },
    // Cancel button (POPUP)
    cancelStartupDonation () {
      this.done = !this.done
      // Reset
      this.srtpId = null
      this.titleDonation = ''
    },
    // Done button
    finishStartupDonation () {
      // console.log(this.titleEditing)
      this.$store.dispatch('donationStartup', {
        id: this.srtpId,
        raisedfunds: this.raisedfundsDonation
      })
      this.done = !this.done
    }
  },
  computed: {
    allStartups () {
      return this.$store.getters.startupsAll
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
</style>
