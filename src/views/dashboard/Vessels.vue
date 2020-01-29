<template>
  <v-container
    id="vessels"
    tag="section"
  >
    <base-material-card
      color="green"
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
      >
        <template v-slot:item="vessel">
          <tr>
            <td>
              <router-link :to="'/vessels/view/' + vessel.item.id">
                {{ vessel.item.name}}
              </router-link>
            </td>
            <td>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span dark v-on="on">
                    <v-badge slot="activator" :color="vessel.item.vrp_status==='Authorized' ? 'green' : 'red'">
                      <template v-slot:badge v-if="vessel.item.vrp_status==='Authorized' || vessel.item.vrp_status==='Not Authorized'">
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
                  <span dark v-on="on">
                    <v-badge bottom bordered overlap slot="activator" color="orange">
                      <template v-slot:badge v-if="vessel.item.response===1">
                        <v-icon dark>mdi-star</v-icon>
                      </template>
                      <span>
                        <v-icon v-if="vessel.item.coverage===1" style="font-size: 30px; color: green">mdi-shield-check</v-icon>
                        <v-icon v-else style="font-size: 30px; color: brown;">mdi-shield-off</v-icon>
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
                  <span dark v-on="on">
                    <v-badge right slot="activator" :color="vessel.item.tanker ? 'blue' : 'red'">
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
                  <span dark v-on="on">
                    <v-badge slot="activator" :color="vessel.item.vrp_status==='Authorized' ? 'green' : 'red'">
                      <template v-slot:badge v-if="vessel.item.vrp_status==='Authorized' || vessel.item.vrp_status==='Not Authorized'">
                        <v-icon dark>
                          {{ vessel.item.vrp_status==='Authorized' ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                      </template>
                      <router-link :to="'/companies/view/' + vessel.item.company.id" v-if="vessel.item.vrp_plan_number>0">
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
          value: 'name'
        },
        {
          text: 'IMO',
          value: 'imo'
        },
        {
          text: 'Official Number',
          value: 'official_number'
        },
        {
          text: 'DJS Coverage?',
          value: 'djs_coverage'
        },
        {
          text: 'Vessel Type',
          value: 'vessel_type'
        },
        {
          text: 'Plan Number',
          value: 'plan_number'
        },
      ],
      vessels: [],
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
      async getDataFromApi () {
        this.vessels = [
          {
            'id': 18992,
            'imo': 7504275,
            'official_number': null,
            'vrp_count': 1,
            'vrp_status': 'Not Authorized',
            'vrp_comparison': 'conflict',
            'vrp_plan_number': 10000,
            'vrp_vessel_is_tank': 0,
            'name': 'Vwssel Ud',
            'type': 'AHT/Seismic Support',
            'company': {
              'id': 4971,
              'name': 'vxcvcxvvxc',
              'plan_number': '987798798798',
              'active': 0
            },
            'tanker': true,
            'resource_provider': false,
            'active': true,
            'fleets': [8],
            'coverage': 1,
            'response': 0
          }, {
            'id': 18991,
            'imo': 456445,
            'official_number': null,
            'vrp_count': 0,
            'vrp_status': ' - ',
            'vrp_comparison': 'N/A',
            'vrp_plan_number': ' - ',
            'vrp_vessel_is_tank': 0,
            'name': 'dggdg',
            'type': 'AHT/Seismic Support',
            'company': {
              'id': -1,
              'name': 'Unknown',
              'plan_number': ' - ',
              'active': 0
            },
            'tanker': false,
            'resource_provider': true,
            'active': true,
            'fleets': [],
            'coverage': 1,
            'response': 1
          }, {
            'id': 18990,
            'imo': 987,
            'official_number': null,
            'vrp_count': 0,
            'vrp_status': ' - ',
            'vrp_comparison': 'N/A',
            'vrp_plan_number': ' - ',
            'vrp_vessel_is_tank': 0,
            'name': 'Udaan tech vessel',
            'type': 'Accommodation Vessel',
            'company': {
              'id': 4958,
              'name': 'Udaan Technologies',
              'plan_number': '89677',
              'active': 1
            },
            'tanker': false,
            'resource_provider': true,
            'active': true,
            'fleets': [3],
            'coverage': 1,
            'response': 1
          }, {
            'id': 18980,
            'imo': 33333,
            'official_number': null,
            'vrp_count': 0,
            'vrp_status': ' - ',
            'vrp_comparison': 'N/A',
            'vrp_plan_number': ' - ',
            'vrp_vessel_is_tank': 0,
            'name': 'test12',
            'type': 'Accommodation Vessel',
            'company': {
              'id': 3840,
              'name': 'Lodestar Marine Club Ltd.',
              'plan_number': ' - ',
              'active': 1
            },
            'tanker': false,
            'resource_provider': false,
            'active': true,
            'fleets': [5],
            'coverage': 1,
            'response': 0
          }, {
            'id': 18962,
            'imo': 1212212,
            'official_number': null,
            'vrp_count': 0,
            'vrp_status': ' - ',
            'vrp_comparison': 'N/A',
            'vrp_plan_number': ' - ',
            'vrp_vessel_is_tank': 0,
            'name': 'A cdt PVT LTD.',
            'type': 'Accommodation Vessel',
            'company': {
              'id': 15,
              'name': 'OOPS',
              'plan_number': ' - ',
              'active': 1
            },
            'tanker': true,
            'resource_provider': true,
            'active': true,
            'fleets': [1],
            'coverage': 1,
            'response': 1
          }, {
            'id': 256,
            'imo': 9390680,
            'official_number': null,
            'vrp_count': 1,
            'vrp_status': 'Authorized',
            'vrp_comparison': 'conflict',
            'vrp_plan_number': 20454,
            'vrp_vessel_is_tank': 0,
            'name': 'Cape Ann',
            'type': 'LNG Tanker',
            'company': {
              'id': 895,
              'name': 'Hoegh LNG Fleet Management AS',
              'plan_number': ' - ',
              'active': 1
            },
            'tanker': false,
            'resource_provider': false,
            'active': true,
            'fleets': [],
            'coverage': 1,
            'response': 0
          }, {
            'id': 512,
            'imo': 9558737,
            'official_number': null,
            'vrp_count': 0,
            'vrp_status': ' - ',
            'vrp_comparison': 'N/A',
            'vrp_plan_number': ' - ',
            'vrp_vessel_is_tank': 0,
            'name': 'RAINBOW HARMONY',
            'type': 'Bulk Carrier',
            'company': {
              'id': 352,
              'name': 'ZZZ-SOLD VESSELS',
              'plan_number': ' - ',
              'active': 1
            },
            'tanker': false,
            'resource_provider': true,
            'active': false,
            'fleets': [],
            'coverage': 0,
            'response': 1
          }, {
            'id': 768,
            'imo': 1061675,
            'official_number': null,
            'vrp_count': 0,
            'vrp_status': ' - ',
            'vrp_comparison': 'N/A',
            'vrp_plan_number': ' - ',
            'vrp_vessel_is_tank': 0,
            'name': 'Sun State 1102',
            'type': 'Unmanned Tank Barge',
            'company': {
              'id': 561,
              'name': 'VANE LINE BUNKERING, INC.',
              'plan_number': '19941',
              'active': 1
            },
            'tanker': true,
            'resource_provider': true,
            'active': true,
            'fleets': [],
            'coverage': 1,
            'response': 1
          }, {
            'id': 1024,
            'imo': 9426594,
            'official_number': null,
            'vrp_count': 1,
            'vrp_status': 'Authorized',
            'vrp_comparison': 'conflict',
            'vrp_plan_number': 27202,
            'vrp_vessel_is_tank': 1,
            'name': 'Margarita',
            'type': 'Crude/Oil Products Tanker',
            'company': {
              'id': 1496,
              'name': 'Magnus Co. Inc.',
              'plan_number': ' - ',
              'active': 1
            },
            'tanker': true,
            'resource_provider': false,
            'active': true,
            'fleets': [],
            'coverage': 1,
            'response': 0
          }, {
            'id': 1280,
            'imo': 9299355,
            'official_number': null,
            'vrp_count': 1,
            'vrp_status': 'Authorized',
            'vrp_comparison': 'conflict',
            'vrp_plan_number': 14163,
            'vrp_vessel_is_tank': 1,
            'name': 'Torm Marie',
            'type': 'Crude Oil/Product Carrier',
            'company': {
              'id': 1019,
              'name': 'TORM A/S',
              'plan_number': ' - ',
              'active': 0
            },
            'tanker': true,
            'resource_provider': false,
            'active': false,
            'fleets': [],
            'coverage': 0,
            'response': 0
          }
        ]
      },
    },
  }
</script>
