<template>
  <base-material-card
    color="primary"
    title="Company Files"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <v-expansion-panels
      accordion
      flat
    >
      <v-expansion-panel
        v-for="(category, i) in Object.keys(categories)"
        :key="i"
      >
        <v-expansion-panel-header
          class="doc-expansion-header"
        >
          {{ category }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-for="dir in categories[category]"
            :key="dir.code"
          >
            <v-col>
              <router-link
                :to="'/companies/' + $route.params.id + '/documents/' + dir.code"
              >
                {{ dir.name }}
              </router-link>
            </v-col>
            <v-col>
              {{ dir.count }}
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { companyFiles } from '@/mixins/companyFiles'

  export default {
    mixins: [companyFiles],
    data () {
      return {
        headers: [
          {
            text: 'Document Name',
            value: 'name',
          },
          {
            text: 'Count',
            value: 'count',
          },
        ],
        loading: false,
      }
    },
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/documents/count')
          .then(res => {
            Object.keys(res.data).forEach(key => {
              this.getDirFromCode(key).count = res.data[key].count
            })
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="sass">
.doc-expansion-header
  font-size: 16px !important
.v-expansion-panel-content
  padding-left: 20px
</style>
