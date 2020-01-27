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
        :options.sync="options"
      >
        <template v-slot:item="company">
          <tr>
            <td>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span dark v-on="on" class="company-badge">
                    <v-badge right slot="activator" color="green">
                      <template v-slot:badge>
                        <v-icon dark>mdi-check</v-icon>
                      </template>
                      <span class="d-inline-block text-truncate" style="max-width: 200px; margin-left: 10px;">
                        {{ company.item.company}}
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
                  <span dark v-on="on" class="company-badge">
                    <v-badge right slot="activator" color="blue">
                      <template v-slot:badge>
                        <v-icon dark>mdi-water-off</v-icon>
                      </template>
                      <span class="d-inline-block text-truncate" style="max-width: 200px; margin-left: 10px;">
                        {{ company.item.plan_number}}
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span> </span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span dark v-on="on" >
                    <v-badge bottom bordered overlap slot="activator" color="orange">
                      <template v-slot:badge>
                        <v-icon dark>mdi-star</v-icon>
                      </template>
                      <span>
                        <img src="../../assets/security-checked.png" />
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span> </span>
              </v-tooltip>
            </td>
            <td>{{ company.item.individuals }}</td>
            <td>{{ company.item.djs_vessels }}</td>
            <td>{{ company.item.vrp_vessels }}</td>
            <td>
              <img src="../../assets/flags/CO.png"
              />
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
      companies: [],
      options: {}
    }),
    methods: {
      async getDataFromApi() {
        this.companies = [
          {
            company: 'Donjon Marine Company II',
            plan_number: 10000,
            djs_coverage: false,
            individuals: 1,
            djs_vessels: 0,
            vrp_vessels: 1,
            country: 'CO'
          },
          {
            company: 'Accentt',
            plan_number: 10040,
            djs_coverage: false,
            individuals: 1,
            djs_vessels: 1,
            vrp_vessels: 0,
            country: 'US'
          }
        ]
        // this.loading = true
        // // get by search keyword
        // const {sortBy, sortDesc, page, itemsPerPage} = this.options
        // try {
        //   const res = await axios.post(`companies?page=${this.options.page}&per_page=${this.options.itemsPerPage}`, {staticSearch: this.staticSearch})
        //   this.companies = res.data.data
        //   this.total = res.data.meta ? res.data.meta.total : res.data.total;
        //   console.log(this.companies)
        //   this.loading = false
        // } catch (error) {
        //   console.error(error)
        // }
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
