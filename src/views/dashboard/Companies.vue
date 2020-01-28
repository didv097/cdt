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
        :options.sync="options"
      >
        <template v-slot:item="company">
          <tr>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span dark v-on="on" class="company-badge">
                    <v-badge right slot="activator" :color="company.item.vrp_status === 'Authorized' ? 'green' : company.item.vrp_status === 'Not Authorized' ? 'red' : 'orange'">
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ company.item.vrp_status === 'Authorized' ? 'mdi-check' : company.item.vrp_status === 'Not Authorized' ? 'mdi-close' : 'mdi-link' }}
                        </v-icon>
                      </template>
                      <router-link :to="company.item.id === -1 ? '/home/companies/view/' + company.item.plan_number + '/vrpexpress' : '/home/companies/view/' + company.item.id">
                        {{ company.item.name}}
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
                  <span dark v-on="on" class="company-badge">
                    <v-badge right slot="activator" :color="company.item.vrp_stats.plan_type==='Tank' ? 'blue' : company.item.vrp_stats.plan_type==='Non-Tank' ? 'red' : 'none'">
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ company.item.vrp_stats.plan_type==='Tank' ? 'mdi-water' : company.item.vrp_stats.plan_type==='Non-Tank' ? 'mdi-water-off' : 'none' }}
                        </v-icon>
                      </template>
                      <span>
                        {{ company.item.plan_number}}
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
                  <span dark v-on="on" >
                    <v-badge bottom bordered overlap slot="activator" :color="company.item.response===1 ? 'orange' : 'none'">
                      <template v-slot:badge>
                        <v-icon dark>mdi-star</v-icon>
                      </template>
                      <span>
                        <v-icon v-if="company.item.coverage===1" style="font-size: 30px; color: green">mdi-shield-check</v-icon>
                        <v-icon v-else style="font-size: 30px; color: brown;">mdi-shield-off</v-icon>
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
                  <span dark v-on="on">
                    <img
                      :alt="company.item.location"
                      :src="getFlagPath(company.item)"
                    />
                  </span>
                </template>
                <span>{{ company.item.country }}</span>
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
    name: 'Companies',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Company',
          value: 'name'
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
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    async mounted () {
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi() {
        this.companies = [
          {
            'id': 4972,
            'name': 'Donjon Marine Company II',
            'vrp_plan_name': null,
            'plan_number': '10000',
            'vrp_plan_number': '10000',
            'resource_provider': true,
            'active': false,
            'location': 'UNITED STATES',
            'country': 'United States',
            'stats': {
              'users': 0,
              'individuals': 1,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'Not Authorized',
            'vrp_stats': {
              'plan_type': 'Non-Tank',
              'vessels': 1
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': 'Non-Tank',
            'coverage': 0
          }, {
            'id': 4971,
            'name': 'vxcvcxvvxc',
            'vrp_plan_name': null,
            'plan_number': '987798798798',
            'vrp_plan_number': '987798798798',
            'resource_provider': false,
            'active': false,
            'location': 'CA',
            'country': 'Canada',
            'stats': {
              'users': 0,
              'individuals': 1,
              'vessels': 1,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 1,
            'response': 0,
            'is_tank': ' - ',
            'coverage': 0
          }, {
            'id': 4970,
            'name': 'Accentt',
            'vrp_plan_name': null,
            'plan_number': '10040',
            'vrp_plan_number': '10040',
            'resource_provider': true,
            'active': true,
            'location': 'IN',
            'country': 'India',
            'stats': {
              'users': 0,
              'individuals': 1,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'Authorized',
            'vrp_stats': {
              'plan_type': 'Tank',
              'vessels': 3
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': 'Tank',
            'coverage': 1
          }, {
            'id': 4969,
            'name': 'Udaan tech1',
            'vrp_plan_name': null,
            'plan_number': '32232',
            'vrp_plan_number': '32232',
            'resource_provider': true,
            'active': true,
            'location': 'UNITED STATES OF AMERICA',
            'country': 'US',
            'stats': {
              'users': 0,
              'individuals': 2,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': ' - ',
            'coverage': 1
          }, {
            'id': 4968,
            'name': 'Udaan Techh',
            'vrp_plan_name': null,
            'plan_number': '10000',
            'vrp_plan_number': '10000',
            'resource_provider': true,
            'active': true,
            'location': 'CA',
            'country': 'Canada',
            'stats': {
              'users': 0,
              'individuals': 4,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'Not Authorized',
            'vrp_stats': {
              'plan_type': 'Non-Tank',
              'vessels': 1
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': 'Non-Tank',
            'coverage': 1
          }, {
            'id': 4966,
            'name': 'Webenture Tech1',
            'vrp_plan_name': null,
            'plan_number': '898989',
            'vrp_plan_number': '898989',
            'resource_provider': true,
            'active': true,
            'location': 'CA',
            'country': 'Canada',
            'stats': {
              'users': 0,
              'individuals': 1,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': ' - ',
            'coverage': 1
          }, {
            'id': 4960,
            'name': 'Udaan Test',
            'vrp_plan_name': null,
            'plan_number': '123456',
            'vrp_plan_number': '123456',
            'resource_provider': true,
            'active': true,
            'location': 'IN',
            'country': 'India',
            'stats': {
              'users': 0,
              'individuals': 0,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': ' - ',
            'coverage': 1
          }, {
            'id': 4958,
            'name': 'Udaan Technologies',
            'vrp_plan_name': null,
            'plan_number': '89677',
            'vrp_plan_number': '89677',
            'resource_provider': true,
            'active': true,
            'location': 'IN',
            'country': 'India',
            'stats': {
              'users': 0,
              'individuals': 5,
              'vessels': 3,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': ' - ',
            'coverage': 1
          }, {
            'id': 4947,
            'name': '3 Round Stones, Inc.',
            'vrp_plan_name': null,
            'plan_number': '152478',
            'vrp_plan_number': '152478',
            'resource_provider': true,
            'active': false,
            'location': 'IN',
            'country': 'India',
            'stats': {
              'users': 0,
              'individuals': 0,
              'vessels': 0,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 1,
            'response': 1,
            'is_tank': ' - ',
            'coverage': 0
          }, {
            'id': 3840,
            'name': 'Lodestar Marine Club Ltd.',
            'vrp_plan_name': null,
            'plan_number': ' ------- ',
            'vrp_plan_number': ' ------- ',
            'resource_provider': true,
            'active': true,
            'location': 'UNITED STATES',
            'country': 'United States',
            'stats': {
              'users': 0,
              'individuals': 0,
              'vessels': 1,
              'contacts': 0
            },
            'vrp_status': 'NO VRP LINK',
            'vrp_stats': {
              'plan_type': ' - ',
              'vessels': ' - '
            },
            'vrp_express': 0,
            'response': 1,
            'is_tank': ' - ',
            'coverage': 1
          }
        ]
        // this.loading = true
        // // get by search keyword
        // const {sortBy, sortDesc, page, itemsPerPage} = this.options
        // try {
        //   const res = await axios.post(`companies?page=${this.options.page}&per_page=${this.options.itemsPerPage}`, {staticSearch: this.staticSearch})
        //   this.companies = res.data.data
        //   this.total = res.data.meta ? res.data.meta.total : res.data.total
        //   console.log(this.companies)
        //   this.loading = false
        // } catch (error) {
        //   console.error(error)
        // }
      },
      getFlagPath (item) {
        if (item.location.length === 2) {
          return require('../../assets/flags/' + item.location + '.png')
        } else if (item.country.length === 2) {
          return require('../../assets/flags/' + item.country + '.png')
        }
        return require('../../assets/flags/US.png')
      },
    },
  }
</script>
