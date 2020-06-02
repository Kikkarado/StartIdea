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
            :maxlength="7"
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
            :maxlength="7"
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
        .startup-list
          transition-group(name="startupList")
          .task-item(
            v-for="donats in donat"
            :key="donats.uid"
            :class="{ completed: donats.uid }"
          )
            .ui-card.ui-card--shadow.margin-bottom-16
                .task-item__info
                  .task-item__main-info
                    .donation(v-if="donats.startupStatus === 'Продовжується'")
                      span.ui-label.ui-label--primary Всього інвестовано:  {{ donats.donation }}&#8372
                      span.ui-label.ui-label--success Прибуток складе:  {{ (donats.profit).toFixed(2) }}&#8372
                    .donation(v-if="donats.startupStatus === 'Успішен'")
                      span.ui-label.ui-label--success Сума для виводу:  {{ (donats.donation + donats.profit).toFixed(2) }}&#8372
                    .donation(v-if="donats.startupStatus === 'Провалився'")
                      span(style="color: #000").ui-label.ui-label--warning Стартап {{donats.startupStatus}}
                  .task-item__content
                    .task-item__header
                      router-link.router-link.ui-title-2(
                        :to="{ name: 'startup', params: { id: donats.idstartup } }"
                        ) {{ donats.title }}
</template>

<script>
import { minValue, maxValue, numeric } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      search: '',
      costfrom: '',
      costto: 1000000,
      stFilter: 'За прибутком спадання',
      reasonsFilter: {
        'Від А до Я': 'Від А до Я',
        'Від Я до А': 'Від Я до А',
        'За інвестиціями зростання': 'За інвестиціями зростання',
        'За інвестиціями спадання': 'За інвестиціями спадання',
        'За прибутком зростання': 'За прибутком зростання',
        'За прибутком спадання': 'За прибутком спадання'
      }
    }
  },
  validations: {
    costfrom: {
      numeric,
      minValue: minValue(10),
      maxValue: maxValue(1000000)
    },
    costto: {
      numeric,
      minValue: minValue(10),
      maxValue: maxValue(1000000)
    }
  },
  created: function () {},
  async mounted () {
    if (!Object.keys(this.$store.getters.donations).length) {
      await this.$store.dispatch('fetchDonations')
    }
  },
  methods: {},
  computed: {
    donat () {
      switch (this.stFilter) {
        case 'Від А до Я': if (this.search === '') {
          const all = this.$store.getters.donations
          return all.sort(sortByTitleAZ) && this.$store.getters.donations.filter(item => item.donation >= this.costfrom && item.donation <= this.costto)
        } else {
          const allST = this.$store.getters.donations
          allST.sort(sortByTitleAZ)
          return this.$store.getters.donations.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.donation >= this.costfrom && item.donation <= this.costto)
        }
        case 'Від Я до А': if (this.search === '') {
          const all = this.$store.getters.donations
          return all.sort(sortByTitleZA) && this.$store.getters.donations.filter(item => item.donation >= this.costfrom && item.donation <= this.costto)
        } else {
          const allST = this.$store.getters.donations
          allST.sort(sortByTitleZA)
          return this.$store.getters.donations.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.donation >= this.costfrom && item.donation <= this.costto)
        }
        case 'За інвестиціями зростання': if (this.search === '') {
          const all = this.$store.getters.donations
          return all.sort(sortByInvestToHight) && this.$store.getters.donations.filter(item => item.donation >= this.costfrom && item.donation <= this.costto)
        } else {
          const allST = this.$store.getters.donations
          allST.sort(sortByInvestToHight)
          return this.$store.getters.donations.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.donation >= this.costfrom && item.donation <= this.costto)
        }
        case 'За інвестиціями спадання': if (this.search === '') {
          const all = this.$store.getters.donations
          return all.sort(sortByInvestToLow) && this.$store.getters.donations.filter(item => item.donation >= this.costfrom && item.donation <= this.costto)
        } else {
          const allST = this.$store.getters.donations
          allST.sort(sortByInvestToLow)
          return this.$store.getters.donations.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.donation >= this.costfrom && item.donation <= this.costto)
        }
        case 'За прибутком зростання': if (this.search === '') {
          const all = this.$store.getters.donations
          return all.sort(sortByProfitToHight) && this.$store.getters.donations.filter(item => item.donation >= this.costfrom && item.donation <= this.costto)
        } else {
          const allST = this.$store.getters.donations
          allST.sort(sortByProfitToHight)
          return this.$store.getters.donations.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.donation >= this.costfrom && item.donation <= this.costto)
        }
        case 'За прибутком спадання': if (this.search === '') {
          const all = this.$store.getters.donations
          return all.sort(sortByProfitToLow) && this.$store.getters.donations.filter(item => item.donation >= this.costfrom && item.donation <= this.costto)
        } else {
          const allST = this.$store.getters.donations
          allST.sort(sortByProfitToLow)
          return this.$store.getters.donations.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()) && item.donation >= this.costfrom && item.donation <= this.costto)
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
const sortByInvestToLow = function (d1, d2) { return (d1.donation < d2.donation) ? 1 : -1 }
const sortByInvestToHight = function (d1, d2) { return (d1.donation > d2.donation) ? 1 : -1 }
const sortByProfitToLow = function (d1, d2) { return (d1.profit < d2.profit) ? 1 : -1 }
const sortByProfitToHight = function (d1, d2) { return (d1.profit > d2.profit) ? 1 : -1 }
</script>

<style lang="stylus" scoped>
.content-wrapper
  min-height 100%

.form-title
  text-align center

.auth
  display flex
  justify-content center

.startup-list
  width 100%
  text-align center
  justify-content center

.width
  display block
  width 33%
  justify-content center

.margin-bottom-16
  margin-bottom 16px

.width-33
  width 33%

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
  width 60%

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

.router-link
  color #444ce0
</style>
