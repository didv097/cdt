<template>
  <v-container
    id="companies"
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-domain"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Companies
        </div>
      </template>

      <v-row align="end">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="ml-auto mr-3"
          label="Search"
          hide-details
          single-line
          style="max-width: 200px;"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              small
              class="mr-2"
              v-on="on"
              @click="advancedSearch = !advancedSearch"
            >
              <v-icon size="28">
                mdi-table-search
              </v-icon>
            </v-btn>
          </template>
          <span>Advanced Search</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="warning"
              small
              class="mr-2"
              v-on="on"
              @click="addDlg = true"
            >
              <v-icon size="28">
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Add Company</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="error"
              small
              class="mr-3"
              v-on="on"
            >
              <v-icon size="28">
                mdi-upload
              </v-icon>
            </v-btn>
          </template>
          <span>Upload Companies</span>
        </v-tooltip>
      </v-row>

      <v-row v-if="advancedSearch">
        <v-col
          cols="12"
          class="display-2"
        >
          Advanced Search
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.active"
            :items="statusItems"
            item-text="text"
            item-value="value"
            label="Status"
            prepend-icon="mdi-check"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.vrp_status"
            :items="vrpItems"
            item-text="text"
            item-value="value"
            label="VRP Status"
            prepend-icon="mdi-check"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.resource_provider"
            :items="resourceProviderItems"
            item-text="text"
            item-value="value"
            label="Resource Provier"
            prepend-icon="mdi-hard-hat"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.networks"
            :items="networkItems"
            item-text="name"
            item-value="id"
            label="Networks"
            prepend-icon="mdi-lan"
            multiple
            clearable
          />
        </v-col>
      </v-row>

      <v-divider class="mt-3" />

      <v-data-table
        :headers="computedHeaders"
        :items="companies"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
      >
        <template v-slot:item="company">
          <tr>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    class="company-badge"
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
                      <router-link
                        class="table-link"
                        :to="company.item.id === -1 ? '/companies/' + company.item.plan_number + '/vrpexpress' : '/companies/' + company.item.id"
                      >
                        {{ company.item.name }}
                      </router-link>
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
                    class="company-badge"
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
              </v-tooltip>
            </td>
            <td>{{ company.item.stats.individuals }}</td>
            <td>{{ company.item.stats.vessels }}</td>
            <td>{{ company.item.vrp_stats.vessels }}</td>
            <td>
              <v-tooltip
                v-if="getFlagPath(company.item)!==''"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <img
                      :alt="company.item.location"
                      :src="getFlagPath(company.item)"
                    >
                  </span>
                </template>
                <span>{{ company.item.country }}</span>
              </v-tooltip>
              <span v-else>-</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Companies',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Company',
          value: 'name',
        },
        {
          text: 'Plan',
          value: 'plan_number',
        },
        {
          text: 'Status',
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
      ],
      statusItems: [
        { text: 'All', value: -1 },
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 0 },
      ],
      resourceProviderItems: [
        { text: 'All', value: -1 },
        { text: 'Provider', value: 1 },
        { text: 'Non-provider', value: 0 },
      ],
      vrpItems: [
        { text: 'All', value: -1 },
        { text: 'Authorized', value: 1 },
        { text: 'Not Authorized', value: 0 },
      ],
      networkItems: [],
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
      advancedSearch: false,
      addDlg: false,
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
      staticSearch: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
    },
    async mounted () {
      axios.get('networks/short')
        .then(res => {
          this.networkItems = res.data.data
        })
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
    },
  }
</script>
