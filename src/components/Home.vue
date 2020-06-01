<template lang="pug">
  .content-wrapper
    .container.margin-top
      .search-form.selector_form
        .form-search
          span.search-sp.margin-right Пошук:
          input.search-inp.margin-right(
              type="text"
              v-model="search"
              placeholder="..."
              :maxlength="36"
            )
        .form-filter
          span.select-sp.margin-right Фільтр:
          select.select-inp(v-model="stFilter")
            option(v-for="(item, key) in reasonsFilter", :value='key', select="item") {{ item }}
        .form-item(:class="{ errorInput: $v.costfrom.$error }")
          span.margin-right Ціна від:
          input.fromto.margin-right(
            type="text"
            :maxlength="9"
            oninput="this.value=this.value.replace(/[^0-9]/g, '')"
            v-model.number="costfrom"
            placeholder="Від"
            :class="{ error: $v.costfrom.$error }"
            @change="$v.costfrom.$touch()"
          )
          .error(v-if="!$v.costfrom.minValue")
            | {{ costfrom }} < {{ $v.costfrom.$params.minValue.min }}
          .error(v-if="!$v.costfrom.maxValue")
            | {{ costfrom }} > {{ $v.costfrom.$params.maxValue.max }}
        .form-item(:class="{ errorInput: $v.costto.$error }")
          span.margin-right До:
          input.fromto.margin-right(
            type="text"
            :maxlength="9"
            oninput="this.value=this.value.replace(/[^0-9]/g, '')"
            v-model.number="costto"
            placeholder="До"
            :class="{ error: $v.costto.$error }"
            @change="$v.costto.$touch()"
          )
          .error(v-if="!$v.costto.minValue")
            | {{ costto }} < {{ $v.costto.$params.minValue.min }}
          .error(v-if="!$v.costto.maxValue")
            | {{ costto }} > {{ $v.costto.$params.maxValue.max }}
      .auth
        .auth__form
      .startup-list
        transition-group(name="startupList")
        .task-item(
          v-for="startups in allStartups"
          :key="startups.id"
          :class="{ completed: startups.completed }"
        )
          .ui-card.ui-card--shadow.margin-bottom
              .task-item__info
                .task-item__main-info
                  .donation
                    span.ui-label.ui-label--light Зібрано:  {{ startups.raisedfunds }}&#8372
                    span.ui-label.ui-label--primary Потрібно:  {{ startups.cost }}&#8372
                .task-item__content
                  .task-item__header
                     router-link.router-link.ui-title-2(
                      :to="{ name: 'startup', params: { id: startups.id } }"
                      ) {{ startups.title }}
                  .task-item__body
                    p.ui-text-regular.margin-bottom-8 {{ startups.shortdescription }}
                    p.ui-text-regular До закриття стартапу залишилось {{ startups.deadline }} дня(-ів).
                  .task-item__foter
</template>

<script>
import { minValue, maxValue, numeric } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      search: '',
      costfrom: '',
      costto: 100000000,
      stFilter: 'Спочатку нові',
      reasonsFilter: {
        'Від А до Я': 'Від А до Я',
        'Від Я до А': 'Від Я до А',
        'За ціною зростання': 'За ціною зростання',
        'За ціною спадання': 'За ціною спадання',
        'За пожертвами зростання': 'За пожертвами зростання',
        'За пожертвами спадання': 'За пожертвами спадання',
        'Спочатку нові': 'Спочатку нові',
        'Спочатку старі': 'Спочатку старі'
      }
    }
  },
  validations: {
    costfrom: {
      numeric,
      minValue: minValue(1000),
      maxValue: maxValue(100000000)
    },
    costto: {
      numeric,
      minValue: minValue(1000),
      maxValue: maxValue(100000000)
    }
  },
  created: function () {},
  async mounted () {
    if (!Object.keys(this.$store.getters.startupsAll).length) {
      await this.$store.dispatch('fetchAllStartups')
    }
  },
  methods: {},
  computed: {
    allStartups () {
      switch (this.stFilter) {
        case 'Від А до Я': if (this.search === '') {
          const all = this.$store.getters.startupsAll
          return all.sort(sortByTitleAZ) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByTitleAZ)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'Від Я до А': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByTitleZA) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByTitleZA)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'За ціною зростання': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByCostToHight) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByCostToHight)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'За ціною спадання': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByCostToLow) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByCostToLow)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'За пожертвами зростання': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByRaisedfundsToHight) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByRaisedfundsToHight)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'За пожертвами спадання': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByRaisedfundsToLow) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByRaisedfundsToLow)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'Спочатку нові': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByDateToLow) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByDateToLow) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
        case 'Спочатку старі': if (this.search === '') {
          const allST = this.$store.getters.startupsAll
          return allST.sort(sortByDateToHight) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
        } else {
          const allST = this.$store.getters.startupsAll
          allST.sort(sortByDateToHight) && this.$store.getters.startupsAll.filter(item => item.cost >= this.costfrom && item.cost <= this.costto)
          return this.$store.getters.startupsAll.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.cost >= this.costfrom && item.cost <= this.costto)
        }
      }
    },
    checkStatus () {
      return this.$store.getters.status
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
const sortByTitleAZ = function (d1, d2) { return (d1.title.toLowerCase() > d2.title.toLowerCase()) ? 1 : -1 }
const sortByTitleZA = function (d1, d2) { return (d1.title.toLowerCase() < d2.title.toLowerCase()) ? 1 : -1 }
const sortByDateToHight = function (d1, d2) { return (new Date(d1.deadline) > new Date(d2.deadline)) ? 1 : -1 }
const sortByDateToLow = function (d1, d2) { return (new Date(d1.deadline) < new Date(d2.deadline)) ? 1 : -1 }
const sortByCostToLow = function (d1, d2) { return (d1.cost < d2.cost) ? 1 : -1 }
const sortByCostToHight = function (d1, d2) { return (d1.cost > d2.cost) ? 1 : -1 }
const sortByRaisedfundsToLow = function (d1, d2) { return (d1.raisedfunds < d2.raisedfunds) ? 1 : -1 }
const sortByRaisedfundsToHight = function (d1, d2) { return (d1.raisedfunds > d2.raisedfunds) ? 1 : -1 }
</script>

<style lang="stylus" scoped>
.content-wrapper
  min-height 100%

.router-link
  color #444ce0

.dots
  display flex
  font-size 20px
.donation
  width 100%
  display flex
  padding 0px 3px
  max-height 50px

.selector_form
  display flex

.task-item__body
  white-space pre-line

.margin-top
  margin-top 32px

.margin-bottom
  margin-bottom 32px

.margin-bottom-8
  margin-bottom 8px

.margin-right
  margin-right 12px

.select-sp
  width 20%
.select-inp
  width 70%

.search-sp
  width 20%
.search-inp
  width 70%

.fromto
  width 40%

input
  &.error
    border-color #fc5c65

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color #fc5c65
  &.errorInput
    .error
      display inline

.form-search
  width 25%

.form-filter
  width 25%

</style>
