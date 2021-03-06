<template>
  <v-container
    id="companies"
    tag="section"
  >
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadCompanyCsv"
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
              @click="addDlg.show = true"
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
              @click="$refs.file.click()"
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
            v-model="staticSearch.vrp_status"
            :items="$store.state.menuitems.vrpItems"
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
        :items="companies"
        :options.sync="options"
        :loading="loading"
        :hide-default-footer="true"
      >
        <template v-slot:item="company">
          <tr>
            <td class="pl-5">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    class="company-badge"
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      left
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
            <td class="d-none d-sm-table-cell">
              {{ company.item.stats.individuals }}
            </td>
            <td class="d-none d-sm-table-cell">
              {{ company.item.stats.vessels }}
            </td>
            <td class="d-none d-sm-table-cell">
              {{ company.item.vrp_stats.vessels }}
            </td>
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
                      :alt="company.item.country"
                      :src="getFlagPath(company.item)"
                      class="flag-icon"
                      width="30"
                    >
                  </span>
                </template>
                <span>{{ company.item.location }}</span>
              </v-tooltip>
              <span v-else>-</span>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-row
        align="baseline"
        justify="end"
      >
        <v-col
          cols="10"
          sm="4"
        >
          <v-select
            v-model="options.itemsPerPage"
            :items="[5, 10, 20]"
            label="Items per page"
          />
        </v-col>
        <v-col cols="auto">
          <v-pagination
            v-model="options.page"
            :length="totalPages"
            :total-visible="5"
            circle
          />
        </v-col>
      </v-row>
    </base-material-card>
    <v-dialog
      v-model="addDlg.show"
      max-width="700"
    >
      <validation-observer v-slot="{ valid }">
        <base-material-wizard
          v-model="addDlg.tab"
          :available-steps="availableSteps"
          :items="addDlg.tabs"
          class="mx-auto"
          @click:next="addDlgNextTab(valid)"
          @click:prev="addDlg.tab--"
        >
          <v-tab-item>
            <form>
              <div class="text-center display-1 font-weight-light mb-6">
                Let's start with basic information (with validation)
              </div>
              <v-row
                class="mx-auto"
                justify="space-around"
              >
                <v-col
                  cols="auto"
                  class="text-center"
                >
                  <input
                    ref="file"
                    type="file"
                    class="d-none"
                    @change="newPhotoChange"
                  >
                  <v-card
                    :class="addDlg.image ? 'success--text' : 'grey--text'"
                    class="mx-auto mt-0 d-inline-flex v-card--account"
                    outlined
                    height="106"
                    width="106"
                    @click="$refs.file.click()"
                  >
                    <v-img
                      v-if="addDlg.image"
                      :src="addDlg.image"
                      height="100%"
                      width="100%"
                    />
                    <v-icon
                      v-else
                      class="mx-auto"
                      size="96"
                    >
                      mdi-account
                    </v-icon>
                  </v-card>

                  <div class="font-weight-bold grey--text">
                    CHOOSE PICTURE
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Company Name"
                  >
                    <v-text-field
                      v-model="addDlg.company.name"
                      :error-messages="errors"
                      label="Company Name *"
                      prepend-icon="mdi-domain"
                      validate-on-blur
                    />
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Plan Number"
                  >
                    <v-text-field
                      v-model="addDlg.company.plan_number"
                      :error-messages="errors"
                      label="Plan Number *"
                      prepend-icon="mdi-counter"
                      validate-on-blur
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="addDlg.company.qi_id"
                    :items="$store.state.menuitems.qiItems"
                    item-text="name"
                    item-value="id"
                    label="QI Company"
                    prepend-icon="mdi-clipboard-account"
                    clearable
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="addDlg.company.operating_company_id"
                    :items="$store.state.menuitems.companyItems"
                    item-text="name"
                    item-value="id"
                    label="Operating Company"
                    prepend-icon="mdi-domain"
                    clearable
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="addDlg.company.website"
                    label="Website"
                    prepend-icon="mdi-web"
                  />
                </v-col>
              </v-row>
            </form>
          </v-tab-item>
        </base-material-wizard>
      </validation-observer>
    </v-dialog>
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
          text: 'Company',
          value: 'name',
          showOnMobile: true,
        },
        {
          text: 'Plan',
          value: 'plan_number',
          showOnMobile: true,
        },
        {
          text: 'Status',
          value: 'djs_coverage',
          showOnMobile: true,
        },
        {
          text: 'Individuals',
          value: 'individuals',
          showOnMobile: false,
        },
        {
          text: 'DJS Vessels',
          value: 'djs_vessels',
          showOnMobile: false,
        },
        {
          text: 'VRP Vessels',
          value: 'vrp_vessels',
          showOnMobile: false,
        },
        {
          text: 'Country',
          value: 'country',
          showOnMobile: true,
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
      advancedSearch: false,
      addDlg: {
        show: false,
        tab: 0,
        tabs: ['Information', 'Address', 'Other Details'],
        company: {
          name: '',
          plan_number: null,
          email: '',
          phone: '',
          fax: '',
          notes: '',
          qi_id: null,
          operating_company_id: null,
          active: true,
        },
      },
    }),
    computed: {
      computedHeaders () {
        return this.headers.filter(item => !this.$vuetify.breakpoint.xs || item.showOnMobile)
      },
      totalPages () {
        return this.options.itemsPerPage > 0 ? Math.ceil(this.total / this.options.itemsPerPage) : this.total
      },
      availableSteps () {
        const steps = [0, 1, 2, 3]
        return steps
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
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`companies?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`companies?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`companies?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
        } catch (error) {
          this.showSnackBar(error, 'error')
        }
        this.loading = false
      },
      getFlagPath (item) {
        if (!item) return ''
        if (item.location && item.location.length === 2) {
          return `http://catamphetamine.github.io/country-flag-icons/3x2/${item.location}.svg`
        } else if (item.country && item.country.length === 2) {
          return `http://catamphetamine.github.io/country-flag-icons/3x2/${item.country}.svg`
        }
        return ''
      },
      addDlgNextTab (valid) {
        // axios.post('companies/create', this.addDlg.company)
        //   .then(res => {
        //     console.log(res)
        //   }).catch(error => {
        //     console.log(error)
        //   })
      },
      newPhotoChange () {},
      uploadCompanyCsv (event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'companies/upload/bulkCsv',
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
