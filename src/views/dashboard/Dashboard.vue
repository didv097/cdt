<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <base-material-alert
          color="primary"
          dark
          dismissible
          icon="mdi-bell"
        >
          Welcome. This is the new CDT system and it is being updated daily.
          If you are coming from the old DJS application you can find everything functional.
        </base-material-alert>
      </v-col>

      <v-col cols="12">
        <base-material-card
          icon="mdi-earth"
          title="Top Countries by Vessel Count"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
              class="mt-10"
            >
              <v-simple-table
                class="ml-2"
              >
                <tbody>
                  <tr
                    v-for="(data, i) in tableData"
                    :key="i"
                  >
                    <td>
                      <v-img
                        :src="data.flagPath"
                        width="18"
                        class="flag-icon"
                      />
                    </td>
                    <td v-text="data.country" />
                    <td v-text="data.vessels" />
                    <td v-text="data.percent.toFixed(2) + '%'" />
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-world-map
                :country-data="topCountries"
                high-color="#838383"
                low-color="#BBBBBB"
              />
            </v-col>
          </v-row>
        </base-material-card>
      </v-col>

      <v-col
        v-for="item in cnt"
        :key="item.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :color="item.color"
          :icon="item.icon"
          :title="item.title"
          :value="'+'+item.value"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        topCountries: {},
        tableData: [],
        cnt: [
          {
            title: 'Companies',
            value: 3731,
            color: 'cyan',
            icon: 'mdi-domain',
          },
          {
            title: 'Individuals',
            value: 4572,
            color: 'red',
            icon: 'mdi-account-group',
          },
          {
            title: 'Vessels',
            value: 18771,
            color: 'green',
            icon: 'mdi-ferry',
          },
          {
            title: 'Fleets',
            value: 8,
            color: 'purple',
            icon: 'mdi-anchor',
          },
        ],
      }
    },

    computed: {
    },

    mounted () {
      axios.get('/dashboard')
        .then(res => {
          const countryVesselCount = res.data.result.stats.country_vessel_count
          const temp = {}
          Object.keys(countryVesselCount)
            .sort((a, b) => countryVesselCount[b].vessels - countryVesselCount[a].vessels)
            .slice(0, 6)
            .forEach(key => {
              temp[key] = Number(countryVesselCount[key].vessels)
              this.tableData.push({
                flagPath: `http://catamphetamine.github.io/country-flag-icons/3x2/${key}.svg`,
                country: countryVesselCount[key].name,
                vessels: countryVesselCount[key].vessels,
                percent: countryVesselCount[key].percent_total,
              })
            })

          this.topCountries = temp
        })
    },

    methods: {
    },
  }
</script>
