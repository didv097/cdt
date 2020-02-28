<template>
  <v-container v-if="vessel">
    <v-progress-circular
      v-if="loading"
      indeterminate
      class="cop-info-loading"
    />
    <div
      v-else
    >
      <v-img
        v-if="vessel.photo"
        :src="vessel.photo"
      />
      <v-icon
        v-else
        size="96"
        class="cop-alt-photo"
      >
        mdi-ferry
      </v-icon>
      <p class="headline mt-4">
        {{ vessel.name }}
      </p>
      <p>
        {{ vessel.type }}
      </p>
      <p>
        <v-icon>
          mdi-map-marker
        </v-icon>
        {{ toDMS(vessel.latitude, vessel.longitude) }}
      </p>
      <p>
        <v-icon>
          mdi-crop-free
        </v-icon>
        {{ vessel.zone_name }}
      </p>
      <p>
        <v-icon>
          mdi-ferry
        </v-icon>
        {{ vessel.ais_status }}
      </p>
      <p
        v-for="(fleet, i) in vessel.fleets"
        :key="i"
      >
        <v-icon>
          mdi-attachment
        </v-icon>
        {{ fleet }}
      </p>
      <v-divider class="ma-2" />
      <v-list dense>
        <v-list-item
          v-for="(info, i) in infoList"
          :key="i"
          class="px-0"
        >
          <v-list-item-action>
            <v-icon color="primary">
              {{ info.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ info.text1 }}</v-list-item-title>
            <v-list-item-title v-if="info.icon==='mdi-map-marker'">
              {{ info.text2 }}
            </v-list-item-title>
            <v-list-item-subtitle v-else>
              {{ info.text2 }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  @click="$copyText(info.textToCopy)"
                >
                  <v-icon>
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </template>
              Click to copy
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-btn
        v-if="vessel.network_codes.includes('opa_90')"
        color="info"
        block
      >
        OPA-90 Network Information
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    props: {
      id: Number,
    },
    data () {
      return {
        vessel: null,
        loading: false,
      }
    },
    computed: {
      infoList () {
        return [
          {
            icon: 'mdi-fingerprint',
            text1: this.vessel.imo,
            text2: 'IMO Number',
            textToCopy: this.vessel.imo,
          },
          {
            icon: 'mdi-antenna',
            text1: this.vessel.mmsi,
            text2: 'MMSI Number',
            textToCopy: this.vessel.mmsi,
          },
          {
            icon: 'mdi-map-marker',
            text1: `Latitude: ${this.vessel.latitude}°`,
            text2: `Longitude: ${this.vessel.longitude}°`,
            textToCopy: `${this.vessel.latitude}, ${this.vessel.longitude}`,
          },
          {
            icon: 'mdi-arrow-right',
            text1: this.vessel.destination,
            text2: 'Destination',
            textToCopy: this.vessel.destination,
          },
          {
            icon: 'mdi-clock',
            text1: this.vessel.eta,
            text2: 'ETA',
            textToCopy: this.vessel.eta,
          },
          {
            icon: 'mdi-history',
            text1: this.prettyDateForm(this.vessel.ais_last_update),
            text2: 'Position received',
            textToCopy: this.prettyDateForm(this.vessel.ais_last_update),
          },
          {
            icon: 'mdi-speedometer',
            text1: this.vessel.speed,
            text2: 'Speed',
            textToCopy: this.vessel.speed,
          },
          {
            icon: 'mdi-compass',
            text1: this.vessel.heading,
            text2: 'Heading',
            textToCopy: this.vessel.heading,
          },
          {
            icon: 'mdi-chart-line-variant',
            text1: this.vessel.course,
            text2: 'Course',
            textToCopy: this.vessel.course,
          },
          {
            icon: 'mdi-weight',
            text1: this.vessel.dead_weight,
            text2: 'Tonnage',
            textToCopy: this.vessel.dead_weight,
          },
        ]
      },
    },
    watch: {
      id () {
        this.getVesselData()
      },
    },
    mounted () {
      this.getVesselData()
    },
    methods: {
      getVesselData () {
        this.loading = true
        axios.get('/map/vessel/' + this.id)
          .then(res => {
            this.vessel = res.data.data
            this.loading = false
          })
      },
      toDMS (lat, lng) {
        const latitude = this.toDegreesMinutesAndSeconds(lat)
        const latitudeCardinal = Math.sign(lat) >= 0 ? 'N' : 'S'
        const longitude = this.toDegreesMinutesAndSeconds(lng)
        const longitudeCardinal = Math.sign(lng) >= 0 ? 'E' : 'W'
        return `${latitude} ${latitudeCardinal} / ${longitude} ${longitudeCardinal}`
      },
      toDegreesMinutesAndSeconds (coordinate) {
        const absolute = Math.abs(coordinate)
        const degrees = Math.floor(absolute)
        const minutesNotTruncated = (absolute - degrees) * 60
        const minutes = Math.floor(minutesNotTruncated)
        const seconds = Math.floor((minutesNotTruncated - minutes) * 60)
        return `${degrees}° ${minutes}' ${seconds}''`
      },
      prettyDateForm (date) {
        const today = new Date()
        const startDate = new Date(date)
        today.setMinutes(today.getMinutes() + today.getTimezoneOffset())
        const secs = Math.floor((today.getTime() - startDate.getTime()) / 1000)
        if (secs < 60) return secs + ' sec(s) ago'
        if (secs < 3600) return Math.floor(secs / 60) + ' min(s) ago'
        if (secs < 86400) return Math.floor(secs / 3600) + ' hour(s) ago'
        if (secs < 604800) return Math.floor(secs / 86400) + ' day(s) ago'
        return 'more than a week ago'
      },
    },
  }
</script>

<style lang="sass">
  .cop-alt-photo
    width: 100%
    height: 160px
    text-align: center
  .cop-info-loading
    left: 50%
    transform: translateX(-16px)
</style>
