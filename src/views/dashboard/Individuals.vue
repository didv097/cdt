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
                :color="individual.item.response===1 ? 'green' : 'red'"
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
                  </v-tooltip>
                </template>
                <router-link
                  class="table-link"
                  :to="'/individuals/view/' + individual.item.id"
                >
                  {{ individual.item.first_name + ' ' + individual.item.last_name }}
                </router-link>
              </v-badge>
            </td>
            <td>
              <router-link
                class="table-link"
                :to="'/individuals/view/' + individual.item.id"
              >
                {{ individual.item.first_name + ' ' + individual.item.last_name }}
              </router-link>
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
          console.error(error)
        }
        this.loading = false
      },
    },
  }
</script>
