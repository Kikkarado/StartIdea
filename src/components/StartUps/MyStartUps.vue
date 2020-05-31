<template lang="pug">
  .content-wrapper
    .container.margin-top
      .auth
        .auth__form
        .buttons-list
          .button.button--round.button-default.margin-right.button-ok(
            @click="filter = 'active', used1=true, butActive()"
            :class="{used: used1}"
          ) Активні
          .button.button--round.button-default.margin-right.button-ok(
            @click="filter = 'completed', used2=true, butCompleted()"
            :class="{used: used2}"
          ) Завершені
          .button.button--round.button-default.button-ok(
            @click="filter = 'all', used3=true, butAll()"
            :class="{used: used3}"
          ) Усі
      .startup-list.margin-top
        transition-group(name="startupList")
        .task-item(
          v-for="startups in startupFilter"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow.margin-bottom
              .task-item__info.overflow
                .task-item__main-info
                  p.typo__p(v-if="startups.completed === true") Завершено
                  span(v-if="startups.approved === 'nonApproved'").ui-label.ui-label--light Проходе модерацію
                  span(v-if="startups.approved === 'denied'").ui-label.ui-label--denied Відмовлено
                  span(v-if="startups.approved === 'approved'").ui-label.ui-label--success Ухвалено
                  br
                  br
                  span(v-if="startups.raisedfunds < startups.cost").ui-label.ui-label--light Зібрано: {{ startups.raisedfunds }}&#8372
                  span(v-if="startups.raisedfunds >= startups.cost").ui-label.ui-label--success Зібрано: {{ startups.raisedfunds }}&#8372
                  span.ui-label.ui-label--primary Потрібно: {{ startups.cost }}&#8372
                .task-item__content
                  .task-item__header
                    router-link.router-link.ui-title-2(
                      :to="{ name: 'startup', params: { id: startups.id } }"
                      ) {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular.margin-bottom {{ startups.shortdescription }}
                  .task-item__foter
                    .buttons-list
                      .button(
                        v-if="startups.completed !== true && startups.approved === 'approved' && (Math.round((new Date(startups.deadline) - new Date(deadDate)) / (1000 * 60 * 60 * 24)) < 30)"
                        @click="startupDone(startups.id, startups.title)"
                        ).button--round.button-primary Завершити достроково
                      .button(
                        v-if="startups.approved === 'denied'"
                        @click="startupDelete(startups.id, startups.title)"
                        ).button--round.button-primary Видалити
        .auth__bot
          .buttons-list
            button.button-primary(
              v-if="checkActiveStartup === 0 && filter === 'active'"
              @click="addStartUp"
              ) Додати стартап
    .ui-messageBox__wrapper(
      v-if="done"
      :class="{active: done}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Увага!
          span.button-close(@click="cancelStartupDone")
        .ui-messageBox__content
          p Ви впевнені, що хочете завершити стартап "{{ titleDone }}"?
        .ui-messageBox__footer
          .button.button-light(@click="cancelStartupDone") Ні
          .button.button-primary(@click="finishStartupDone") Так
    .ui-messageBox__wrapper(
      v-if="deleted"
      :class="{active: deleted}"
    )
      .ui-messageBox.fadeInDown
        .ui-messageBox__header
          span.messageBox-title Увага!
          span.button-close(@click="cancelStartupDelete")
        .ui-messageBox__content
          p Ви впевнені, що хочете видалити стартап "{{ titleDelete }}"?
        .ui-messageBox__footer
          .button.button-light(@click="cancelStartupDelete") Ні
          .button.button-primary(@click="finishStartupDelete") Так
</template>

<script>
export default {
  data () {
    return {
      OpStartup: null,
      filter: 'active',
      done: false,
      titleDone: '',
      titleDelete: '',
      srtpId: null,
      used1: true,
      used2: false,
      used3: false,
      deadDate: '',
      deleted: false
    }
  },
  created: function () {
    this.dateDead()
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
    dateDead () {
      const date = new Date()
      this.deadDate = date.getUTCFullYear() + '.' + date.getUTCMonth() + '.' + date.getUTCDate() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
    },
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
    },
    startupDelete (id, title) {
      this.deleted = !this.deleted
      // console.log({id, title})
      this.srtpId = id
      this.titleDelete = title
    },
    // Cancel button (POPUP)
    cancelStartupDelete () {
      this.deleted = !this.deleted
      // Reset
      this.srtpId = null
      this.titleDelete = ''
    },
    // Done button
    finishStartupDelete () {
      // console.log(this.titleEditing)
      this.$store.dispatch('deleteStartup', {
        id: this.srtpId
      })
      this.deleted = !this.deleted
      window.location.reload('/myStartUps')
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

.router-link
  color #444ce0

.auth
  display flex
  flex-wrap wrap

.img_form
  display inline-block
  text-align right
  flex 0 1 auto
  width 200px
  height 200px
  padding 10px
  justify-content right

.auth__banner,
.auth__form
  display right
  width 100%

.overflow
 overflow-x hidden

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

.ui-label--denied
  background #fc5c65

.margin-top
  margin-top 32px

.margin-bottom
  margin-bottom 32px

.margin-bottom-16
  margin-bottom 16px

.margin-right
  margin-right 12px

.scale
  transition 1s

.scale:hover
  transform scale(2)

.image_avatar
  object-fit cover
  flex 0 1 auto
  border 3px solid #999999
  width 100%
  height 100%
  border-radius 50%
</style>
