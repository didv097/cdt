<template>
  <v-container
    id="individuals"
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-account-group"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Individuals
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
            v-model="staticSearch.resource_provider"
            :items="resourceProviderItems"
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
            v-model="staticSearch.companies"
            :items="companyItems"
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
            v-model="staticSearch.roles"
            :items="roleItems"
            item-text="name"
            item-value="id"
            label="Roles"
            prepend-icon="mdi-account-lock"
            multiple
            clearable
          />
        </v-col>
      </v-row>

      <v-divider class="mt-3" />

      <v-data-table
        :headers="computedHeaders"
        :items="individuals"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
      >
        <template v-slot:item="individual">
          <tr>
            <td>
              <v-badge
                slot="activator"
                right
                :color="individual.item.response===1 ? 'success' : 'error'"
              >
                <template v-slot:badge>
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        dark
                        v-on="on"
                      >
                        {{ individual.item.response===1 ? 'mdi-account-badge' : 'mdi-account-badge-alert' }}
                      </v-icon>
                    </template>
                    {{ individual.item.response===1 ? 'Responder' : 'No Responder' }}
                  </v-tooltip>
                </template>
                <router-link
                  class="table-link"
                  :to="'/individuals/' + individual.item.id"
                >
                  {{ individual.item.name }}
                </router-link>
              </v-badge>
            </td>
            <td>
              <router-link
                v-if="individual.item.company.id >= 0"
                class="table-link"
                :to="'/companies/' + individual.item.company.id"
              >
                {{ individual.item.company.name }}
              </router-link>
              <span v-else>
                {{ individual.item.company.name }}
              </span>
            </td>
            <td>
              {{ individual.item.email }}
            </td>
            <td>
              {{ individual.item.mobile_number }}
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
    name: 'Individuals',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Company',
          value: 'company',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Mobile Number',
          value: 'mobile_number',
        },
      ],
      staticSearch: {
        active: -1,
        companies: [],
        roles: [],
        resource_provider: -1,
      },
      individuals: [],
      total: 0,
      options: {},
      loading: false,
      searchTimeout: null,
      advancedSearch: false,
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
      companyItems: [],
      roleItems: [],
      addDlg: {
        show: false,
        tab: 0,
        tabs: ['Personal', 'Contact', 'Professional'],
      },
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
      axios.get('companies/short')
        .then(res => {
          this.companyItems = res.data.data
        })
      axios.get('roles')
        .then(res => {
          this.roleItems = res.data.data
        })
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        this.loading = true
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`users-filter?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.individuals = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (sortBy[0] && sortBy[0].length > 0 && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`users-order?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.individuals = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`users?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.individuals = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
        } catch (error) {
          // console.error(error)
        }
        this.loading = false
      },
    },
  }
</script>
