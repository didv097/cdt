<template>
  <v-container
    id="vessels"
    tag="section"
  >
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadVesselCsv"
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
            >
              <v-icon size="28">
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Add Vessel</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="error"
              small
              class="mr-3"
              v-on="on"
              @click="$refs.file.click()"
            >
              <v-icon size="28">
                mdi-upload
              </v-icon>
            </v-btn>
          </template>
          <span>Upload Vessels</span>
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
            :items="$store.state.menuitems.statusItems"
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
            v-model="staticSearch.resource_provider"
            :items="$store.state.menuitems.resourceProviderItems"
            item-text="text"
            item-value="value"
            label="Resource Provider"
            prepend-icon="mdi-hard-hat"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.types"
            :items="$store.state.menuitems.vesselTypeItems"
            item-text="name"
            item-value="id"
            label="Companies"
            prepend-icon="mdi-domain"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.qi"
            :items="$store.state.menuitems.qiItems"
            item-text="name"
            item-value="id"
            label="QI"
            prepend-icon="mdi-anchor"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.pi"
            :items="$store.state.menuitems.piItems"
            item-text="name"
            item-value="id"
            label="PI"
            prepend-icon="mdi-umbrella"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.societies"
            :items="$store.state.menuitems.societyItems"
            item-text="name"
            item-value="id"
            label="Societies"
            prepend-icon="mdi-axis-arrow-lock"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.insurers"
            :items="$store.state.menuitems.insurerItems"
            item-text="name"
            item-value="id"
            label="Insurers"
            prepend-icon="mdi-engine"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.providers"
            :items="$store.state.menuitems.providerItems"
            item-text="name"
            item-value="id"
            label="Providers"
            prepend-icon="mdi-chart-bell-curve"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.fleets"
            :items="$store.state.menuitems.fleetItems"
            item-text="name"
            item-value="id"
            label="Fleets"
            prepend-icon="mdi-anchor"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.companies"
            :items="$store.state.menuitems.companyItems"
            item-text="name"
            item-value="id"
            label="Companies"
            prepend-icon="mdi-domain"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.vrp_status"
            :items="$store.state.menuitems.vrpItems"
            item-text="text"
            item-value="value"
            label="VRP Express"
            prepend-icon="mdi-check"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.networks"
            :items="$store.state.menuitems.networkItems"
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
              </v-tooltip>
            </td>
            <td class="pl-5">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      left
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
                        v-if="vessel.item.vrp_plan_number>0 && vessel.item.company && vessel.item.company.id>0"
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
    <base-material-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      right
      :type="null"
    >
      {{ snackbarText }}
    </base-material-snackbar>
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
          text: 'Vessel Name',
          value: 'name',
        },
        {
          text: 'IMO',
          value: 'imo',
        },
        {
          text: 'Official #',
          value: 'official_number',
        },
        {
          text: 'Status',
          value: 'djs_coverage',
        },
        {
          text: 'Vessel Type',
          value: 'vessel_type',
        },
        {
          text: 'Plan',
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
      advancedSearch: false,
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
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        if (this.loading) return
        this.loading = true
        const { sortBy, descending, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`vessels?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.vessels = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (sortBy[0] && !this.search) {
            const direction = descending ? 'desc' : 'asc'
            const res = await axios.post(`vessels?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.vessels = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`vessels?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.vessels = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
        } catch (error) {
          this.showSnackBar(error, 'error')
        }
        this.loading = false
      },
      uploadVesselCsv (event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'vessels/upload/bulkCsv',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.showSnackBar(res.data.message, 'success')
          this.getDataFromApi()
        }).catch(error => {
          this.showSnackBar(error.response.statusText, 'error')
          this.getDataFromApi()
        })
      },
    },
  }
</script>
