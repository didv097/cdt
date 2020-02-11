<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Affiliates"
      :loading="loading"
    >
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Search"
        hide-details
        single-line
        style="max-width: 250px;"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="computedHeaders"
        :items="companies"
        :options.sync="options"
        :server-items-length="total"
      >
        <template v-slot:item="company">
          <tr>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      right
                      :color="company.item.vrp_status === 'Authorized' ? 'success' : company.item.vrp_status === 'Not Authorized' ? 'error' : 'warning'"
                    >
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ company.item.vrp_status === 'Authorized' ? 'mdi-check' : company.item.vrp_status === 'Not Authorized' ? 'mdi-close' : 'mdi-link' }}
                        </v-icon>
                      </template>
                      <span
                        class="table-link"
                        @click="editCompany(company.item)"
                      >
                        {{ company.item.name }}
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span>{{ company.item.vrp_status }}</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      right
                      :color="company.item.vrp_stats.plan_type==='Tank' ? 'black' : 'blue'"
                      :value="company.item.vrp_stats.plan_type==='Tank' || company.item.vrp_stats.plan_type==='Non-Tank'"
                    >
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ company.item.vrp_stats.plan_type==='Tank' ? 'mdi-water' : 'mdi-water-off' }}
                        </v-icon>
                      </template>
                      <span>
                        {{ company.item.plan_number }}
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span>{{ company.item.vrp_stats.plan_type }}</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      bottom
                      bordered
                      overlap
                      color="orange"
                      :value="company.item.response===1"
                    >
                      <template v-slot:badge>
                        <v-icon dark>mdi-star</v-icon>
                      </template>
                      <span>
                        <v-icon
                          v-if="company.item.coverage===1"
                          color="success"
                          size="30"
                        >
                          mdi-shield-check
                        </v-icon>
                        <v-icon
                          v-else
                          color="error"
                          size="30"
                        >
                          mdi-shield-off
                        </v-icon>
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span v-if="company.item.coverage===1">DJS Coverage</span>
                <span v-else>No DJS Coverage</span>
                <span v-if="company.item.response===1"> and Responder</span>
                <span v-else> and no Responder</span>
              </v-tooltip>
            </td>
            <td>{{ company.item.stats.individuals }}</td>
            <td>{{ company.item.stats.vessels }}</td>
            <td>{{ company.item.vrp_stats.vessels }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <div v-if="getFlagPath(company.item)===''">-</div>
                    <img
                      v-else
                      :alt="company.item.location"
                      :src="getFlagPath(company.item)"
                    >
                  </span>
                </template>
                <span>{{ company.item.country }}</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="primary"
                    :to="'/companies/'+company.item.id"
                    v-on="on"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>View Detail</span>
              </v-tooltip>
              <v-dialog
                v-model="deleteMsg[company.item.id]"
                persistent
                max-width="600"
              >
                <template v-slot:activator="{ on: dialog }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                        color="error"
                        icon
                        v-on="{ ...tooltip, ...dialog }"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </template>
                <v-card>
                  <v-card-title class="headline">
                    You are about to delete or unlink a company
                  </v-card-title>
                  <v-card-text>
                    Please confirm that you would like to delete or unlink the following company: <b>{{ company.item.name }}</b>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="warning"
                      text
                      @click="removeLink(company.item.id)"
                    >
                      Remove Link
                    </v-btn>
                    <v-btn
                      color="error"
                      text
                      @click="deleteCompany(company.item.id)"
                    >
                      Delete Company
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="deleteMsg[company.item.id] = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
          </tr>
        </template>
      </v-data-table>
      <base-material-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        bottom
        right
        :type="null"
      >
        {{ snackbarText }}
      </base-material-snackbar>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { snackBar } from '@/mixins/snackBar'

  export default {
    mixins: [snackBar],
    data: () => ({
      search: '',
      headers: [
        {
          text: 'Plan Holder Name',
          value: 'name',
        },
        {
          text: 'Plan Number',
          value: 'plan_number',
        },
        {
          text: 'DJS Coverage?',
          value: 'djs_coverage',
        },
        {
          text: 'Individuals',
          value: 'individuals',
        },
        {
          text: 'DJS Vessels',
          value: 'djs_vessels',
        },
        {
          text: 'VRP Vessels',
          value: 'vrp_vessels',
        },
        {
          text: 'Country',
          value: 'country',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      companies: [],
      loading: false,
      options: {},
      staticSearch: {
        active: -1,
        resource_provider: -1,
        vrp_status: -1,
        networks: [],
      },
      total: 0,
      searchTimeout: null,
      deleteMsg: {},
    }),
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
      search () {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.getDataFromApi()
        }, 500)
      },
    },
    async mounted () {
      this.staticSearch.parent = this.$route.params.id
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        this.loading = true
        // get by search keyword
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`companies-filter-vrp?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          // get by sort option
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`companies-order?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`companies?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          this.loading = false
        } catch (error) {
          // console.error(error)
        }
      },
      getFlagPath (item) {
        if (!item) {
          return ''
        }
        if (item.location && item.location.length === 2) {
          return require('@/assets/flags/' + item.location + '.png')
        } else if (item.country && item.country.length === 2) {
          return require('@/assets/flags/' + item.country + '.png')
        }
        return ''
      },
      editCompany (item) {
        // console.log(item)
      },
      removeLink (id) {
        axios.get('companies/' + id + '/unlinkCompanies')
          .then(res => {
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
            this.deleteMsg[id] = false
          })
      },
      deleteCompany (id) {
        axios.delete('companies/' + id + '/destroy')
          .then(res => {
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
            this.deleteMsg[id] = false
          })
      },
    },
  }
</script>
