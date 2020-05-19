<template lang="pug">
  .content-wrapper
    section
    .container
      .auth
        .auth__form
          span.ui-title-2 My StartUp
        .buttons-list
          .button.button--round.button-default(
            @click="filter = 'active'"
          ) Active
          .button.button--round.button-default(
            @click="filter = 'completed'"
          ) Completed
          .button.button--round.button-default(
            @click="filter = 'all'"
          ) All
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="startups in startupFilter"
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
                        v-if="startups.completed !== true"
                        @click="startupDone(startups.id, startups.title)"
                        ).button--round.button-primary Done
        .auth__bot
          button.button-primary(
            v-if="checkActiveStartup === 0"
            @click="addStartUp"
            ) Add startup
    .ui-messageBox__wrapper(
      v-if="done"
      :class="{active: done}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Warning!
          span.button-close(@click="cancelStartupDone")
        .ui-messageBox__content
          p Are you sure you want to close "{{ titleDone }}"
        .ui-messageBox__footer
          .button.button-light(@click="cancelStartupDone") Cancel
          .button.button-primary(@click="finishStartupDone") OK
</template>

<script>
export default {
  data () {
    return {
      OpStartup: null,
      filter: 'active',
      done: false,
      titleDone: '',
      srtpId: null
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.openstartup).length) {
      await this.$store.dispatch('fetchActiveStartup')
    }
    if (!Object.keys(this.$store.getters.startupsUser).length) {
      await this.$store.dispatch('fetchStartupsUser')
    }
  },
  methods: {
    startupDone (id, title) {
      this.done = !this.done
      // console.log({id, title})
      this.srtpId = id
      this.titleDone = title
    },
    // Cancel button (POPUP)
    cancelStartupDone () {
      this.done = !this.done
      // Reset
      this.srtpId = null
      this.titleDone = ''
    },
    // Done button
    finishStartupDone () {
      // console.log(this.titleEditing)
      this.$store.dispatch('completeStartup', {
        id: this.srtpId,
        completed: true
      })
      this.done = !this.done
    },
    addStartUp () {
      this.$router.push('/addStartUp')
    }
  },
  computed: {
    checkActiveStartup () {
      return this.$store.getters.openstartup
    },
    startupFilter () {
      if (this.filter === 'active') {
        return this.$store.getters.startupNotCompleted
      } else if (this.filter === 'completed') {
        return this.$store.getters.startupCompleted
      } else if (this.filter === 'all') {
        return this.$store.getters.startupsUser
      }
      return this.filter === 'active'
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="stylus">
  .auth
    display flex
    flex-wrap wrap
  .auth__banner,
  .auth__form
    display right
    width 100%
  .button-add
    text-align right
    color #fc5c65
  .button-done
    text-align right

.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px
</style>
