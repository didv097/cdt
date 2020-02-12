<template>
  <v-container
    id="vessels"
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-ferry"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Vessels
        </div>
      </template>

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
        :items="vessels"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
      >
        <template v-slot:item="vessel">
          <tr>
            <td>
              <router-link
                class="table-link"
                :to="'/vessels/' + vessel.item.id"
              >
                {{ vessel.item.name }}
              </router-link>
            </td>
            <td>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      :color="vessel.item.vrp_status==='Authorized' ? 'success' : 'error'"
                      :value="vessel.item.vrp_status==='Authorized' || vessel.item.vrp_status==='Not Authorized'"
                    >
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ vessel.item.vrp_status==='Authorized' ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                      </template>
                      {{ vessel.item.imo }}
                    </v-badge>
                  </span>
                </template>
                <span>{{ vessel.item.vrp_status }}</span>
              </v-tooltip>
            </td>
            <td>{{ vessel.item.office_number ? vessel.item.office_number : '-' }}</td>
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
                      :value="vessel.item.response===1"
                    >
                      <template v-slot:badge>
                        <v-icon dark>mdi-star</v-icon>
                      </template>
                      <span>
                        <v-icon
                          v-if="vessel.item.coverage===1"
                          size="30"
                          color="success"
                        >
                          mdi-shield-check
                        </v-icon>
                        <v-icon
                          v-else
                          size="30"
                          color="error"
                        >
                          mdi-shield-off
                        </v-icon>
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span v-if="vessel.item.coverage===1">DJS Coverage</span>
                <span v-else>No DJS Coverage</span>
                <span v-if="vessel.item.response===1"> and Responder</span>
                <span v-else> and no Responder</span>
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
                      :color="vessel.item.tanker ? 'black' : 'blue'"
                    >
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ vessel.item.tanker ? 'mdi-water' : 'mdi-water-off' }}
                        </v-icon>
                      </template>
                      <span>
                        {{ vessel.item.type }}
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span>{{ vessel.item.tanker ? 'Tank' : 'Non Tank' }}</span>
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
                      :color="vessel.item.vrp_status==='Authorized' ? 'success' : 'error'"
                      :value="vessel.item.vrp_status==='Authorized' || vessel.item.vrp_status==='Not Authorized'"
                    >
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ vessel.item.vrp_status==='Authorized' ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                      </template>
                      <router-link
                        v-if="vessel.item.vrp_plan_number>0 && vessel.item.company.id>0"
                        class="table-link"
                        :to="'/companies/' + vessel.item.company.id"
                      >
                        {{ vessel.item.vrp_plan_number }}
                      </router-link>
                      <span v-else>{{ vessel.item.vrp_plan_number }}</span>
                    </v-badge>
                  </span>
                </template>
                <span>{{ vessel.item.vrp_status }}</span>
              </v-tooltip>
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
    name: 'Vessels',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Vessel Name',
          value: 'name',
        },
        {
          text: 'IMO',
          value: 'imo',
        },
        {
          text: 'Official Number',
          value: 'official_number',
        },
        {
          text: 'DJS Coverage?',
          value: 'djs_coverage',
        },
        {
          text: 'Vessel Type',
          value: 'vessel_type',
        },
        {
          text: 'Plan Number',
          value: 'plan_number',
        },
      ],
      staticSearch: {
        active: -1,
        resource_provider: -1,
        types: [],
        qi: [],
        pi: [],
        response: [],
        societies: [],
        insurers: [],
        providers: [],
        vendors: [],
        fleets: [],
        vrp_status: -1,
        vrp_comparison: -1,
        companies: [],
        networks: [],
      },
      vessels: [],
      total: 0,
      options: {},
      loading: false,
      searchTimeout: null,
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
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        this.loading = true
        // get by search keyword
        const { sortBy, descending, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`vessels-filter-vrp?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.vessels = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          // get by sort option
          if (sortBy[0] && !this.search) {
            const direction = descending ? 'desc' : 'asc'
            const res = await axios.post(`vessels-order?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.vessels = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`vessels?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.vessels = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          console.log(this.vessels)
        } catch (error) {
          // console.error(error)
        }
        this.loading = false
      },
    },
  }
</script>
