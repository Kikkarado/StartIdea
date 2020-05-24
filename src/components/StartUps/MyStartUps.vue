<template lang="pug">
  .content-wrapper
    .container.margin-top
      .auth
        .auth__form
          span.ui-title-2 My StartUp
        .buttons-list
          .button.button--round.button-default.margin-right.button-ok(
            @click="filter = 'active', used1=true, butActive()"
            :class="{used: used1}"
          ) Active
          .button.button--round.button-default.margin-right.button-ok(
            @click="filter = 'completed', used2=true, butCompleted()"
            :class="{used: used2}"
          ) Completed
          .button.button--round.button-default.button-ok(
            @click="filter = 'all', used3=true, butAll()"
            :class="{used: used3}"
          ) All
      .startup-list.margin-top
        transition-group(name="startupList")
        .task-item(
          v-for="startups in startupFilter"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow.margin-bottom
              .task-item__info
                .task-item__main-info
                  p.typo__p(v-if="startups.completed === true") Completed
                  span(v-if="startups.raisedfunds < startups.cost").ui-label.ui-label--light {{ startups.raisedfunds }}$
                  span(v-if="startups.raisedfunds >= startups.cost").ui-label.ui-label--success {{ startups.raisedfunds }}$
                  span.ui-label.ui-label--primary {{ startups.cost }}$
                .task-item__content
                  .task-item__header
                    span.ui-title-2 {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular.margin-bottom {{ startups.shortdescription }}
                  .task-item__body
                    p.ui-text-regular.margin-bottom-16 {{ startups.fulldescription }}
                  .task-item__foter
                    .buttons-list
                      .button(
                        v-if="startups.completed !== true"
                        @click="startupDone(startups.id, startups.title)"
                        ).button--round.button-primary Done
        .auth__bot
          .buttons-list
            button.button-primary(
              v-if="checkActiveStartup === 0 && filter === 'active'"
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
      srtpId: null,
      used1: true,
      used2: false,
      used3: false
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
    butActive () {
      this.used2 = false
      this.used3 = false
    },
    butCompleted () {
      this.used1 = false
      this.used3 = false
    },
    butAll () {
      this.used1 = false
      this.used2 = false
    },
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
.content-wrapper
  min-height 100%

.auth
  display flex
  flex-wrap wrap

.auth__banner,
.auth__form
  display right
  width 100%

.button-ok
  &.used
    background-color: #444ce0
    color #fff

.button-add
  color #fc5c65

.buttons-list
  display block
  text-align right

.task-item__body
  white-space pre-line

.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px

.margin-top
  margin-top 32px

.margin-bottom
  margin-bottom 32px

.margin-bottom-16
  margin-bottom 16px

.margin-right
  margin-right 12px
</style>
