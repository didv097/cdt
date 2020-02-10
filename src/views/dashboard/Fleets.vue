<template>
  <v-container
    id="fleets"
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-anchor"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Fleets
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
        :items="fleets"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
      >
        <template v-slot:item="fleet">
          <tr>
            <td>
              <router-link
                class="table-link"
                :to="'/fleets/' + fleet.item.id"
              >
                {{ fleet.item.name }}
              </router-link>
            </td>
            <td>
              <span>{{ fleet.item.vessels_count }}</span>
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
    name: 'Fleets',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Vessels',
          value: 'vessels',
        },
      ],
      staticSearch: {
        internal: -1,
      },
      fleets: [],
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
            const res = await axios.post(`fleets-filter?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.fleets = res.data.data
            this.total = res.data.meta.total
          }
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`fleets-order?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.fleets = res.data.data
            this.total = res.data.meta.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`fleets?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.fleets = res.data.data
            this.total = res.data.meta.total
          }
        } catch (error) {
          // console.error(error)
        }
        this.loading = false
      },
    },
  }
</script>
