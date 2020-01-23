<template>
  <v-container
    id="companies"
    tag="section"
  >
    <base-material-card
      color="green"
      icon="mdi-office-building"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Companies
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
        :items="companies"
        :sort-desc="[false, true]"
        multi-sort
      />
    </base-material-card>
  </v-container>
</template>

<script>
  // Components

  export default {
    name: 'Companies',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Company',
          value: 'company'
        },
        {
          text: 'Plan Number',
          value: 'plan_number'
        },
        {
          text: 'DJS Coverage?',
          value: 'djs_coverage'
        },
        {
          text: 'Individuals',
          value: 'individuals'
        },
        {
          text: 'DJS Vessels',
          value: 'djs_vessels'
        },
        {
          text: 'VRP Vessels',
          value: 'vrp_vessels'
        },
        {
          text: 'Country',
          value: 'country'
        },
      ],
      companies: []
    }),
    methods: {
      async getDataFromApi() {
        return;
        this.loading = true
        // get by search keyword
        const {sortBy, sortDesc, page, itemsPerPage} = this.options
        try {
          if (this.search) {
            const res = await axios.post(`companies-filter-vrp?query=${this.search}&page=${this.options.page}&per_page=${this.options.itemsPerPage}`, {staticSearch: this.staticSearch})
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total;
          }
          // get by sort option
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`companies-order?direction=${direction}&sortBy=${sortBy[0]}&page=${this.options.page}&per_page=${this.options.itemsPerPage}`, {staticSearch: this.staticSearch})
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total;
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`companies?page=${this.options.page}&per_page=${this.options.itemsPerPage}`, {staticSearch: this.staticSearch})
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total;
          }
          this.loading = false
        } catch (error) {
          console.log(error)
        }
      }
    },
    computed: {
      computedHeaders() {
        return this.headers;
      }
    },
    async mounted() {
      await this.getDataFromApi()
    }
  }
</script>
