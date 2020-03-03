<template>
  <div class="cop-map-container">
    <div
      v-if="loadingVessels || loading"
      class="cop-map-loading-container"
    >
      <v-progress-circular
        size="64"
        color="secondary"
        class="cop-map-loading"
        indeterminate
      />
    </div>
    <v-navigation-drawer
      v-model="showMapMenu"
      class="cop-map-menu"
      permanent
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="search"
              label="Search"
              prepend-icon="mdi-magnify"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          prepend-icon="mdi-check"
          no-action
        >
          <template v-slot:activator>
            <v-list-item>
              Display
            </v-list-item>
          </template>
          <v-list-item>
            <v-switch
              v-model="displayOptions.vessels"
              label="Vessels"
              hide-details
            />
          </v-list-item>
          <v-list-item>
            <v-switch
              v-model="displayOptions.individuals"
              label="Individuals"
              hide-details
            />
          </v-list-item>
          <v-list-item>
            <v-switch
              v-model="displayOptions.companies"
              label="Companies"
              hide-details
            />
          </v-list-item>
          <v-list-item>
            <v-switch
              v-model="displayOptions.grouping"
              label="Grouping"
              hide-details
            />
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-map"
          no-action
        >
          <template v-slot:activator>
            <v-list-item>
              OPA-90 Zones
            </v-list-item>
          </template>
          <v-list-item
            v-for="zone in zones"
            :key="zone.id"
            @click="loadZone(zone)"
          >
            <v-switch
              v-model="zone.visible"
              :label="zone.name"
              readonly
              hide-details
            />
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-ferry"
          no-action
        >
          <template v-slot:activator>
            <v-list-item>
              Fleets
            </v-list-item>
          </template>
          <v-list-item
            v-for="fleet in fleets"
            :key="fleet.id"
            @click="selectedFleets.indexOf(fleet.id) < 0 ? selectedFleets.push(fleet.id): selectedFleets.splice(selectedFleets.indexOf(fleet.id),1)"
          >
            <v-checkbox
              v-model="selectedFleets"
              :value="fleet.id"
              :label="fleet.name"
              readonly
              hide-details
            />
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-lan"
          no-action
        >
          <template v-slot:activator>
            <v-list-item>
              Networks
            </v-list-item>
          </template>
          <v-list-item
            v-for="network in networks"
            :key="network.id"
            @click="selectedNetworks.indexOf(network.id) < 0 ? selectedNetworks.push(network.id): selectedNetworks.splice(selectedNetworks.indexOf(network.id),1)"
          >
            <v-checkbox
              v-model="selectedNetworks"
              :value="network.id"
              :label="network.name"
              readonly
              hide-details
            />
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-pier-crane"
          no-action
        >
          <template v-slot:activator>
            <v-list-item>
              SMFF Capabilities
            </v-list-item>
          </template>
          <v-list-item>
            <v-radio-group
              v-model="smffFilter.operator"
              row
            >
              <v-radio
                label="AND"
                value="and"
              />
              <v-radio
                label="OR"
                value="or"
              />
            </v-radio-group>
          </v-list-item>
          <v-list-item>
            <v-autocomplete
              v-model="smffFilter.selected"
              :items="serviceItems.filter(item => item.db === 1)"
              item-text="name"
              item-value="id"
              label="SMFF Services"
              multiple
              dense
              hide-details
              clearable
            />
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-share-variant"
          no-action
        >
          <template v-slot:activator>
            <v-list-item>
              Share/Export
            </v-list-item>
          </template>
          <v-list-item
            @click="exportPNG"
          >
            PNG Format
          </v-list-item>
          <v-list-item
            @click="exportKML"
          >
            KML Format
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="infoDrawer.show"
      absolute
      floating
      temporary
      width="300"
      style="z-index: 5"
    >
      <vessel-info
        v-if="infoDrawer.type === 'vessel'"
        :id="infoDrawer.id"
      />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            block
            text
            v-on="on"
            @click="infoDrawer.show = false"
          >
            Close
          </v-btn>
        </template>
        Close the sidebar
      </v-tooltip>
    </v-navigation-drawer>
    <l-map
      id="map"
      ref="map"
      :zoom="3"
      :min-zoom="3"
      :max-zoom="13"
      :world-copy-jump="true"
      :options="mapOptions"
    >
      <l-control-scale
        :imperial="true"
        :metric="true"
        position="bottomright"
      />
      <l-tile-layer
        url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFucnVsczEiLCJhIjoiY2swcGlhNXpwMDBzNTNvcmcwZDQxcDB6cyJ9.w3WTQktdZ2nMziZtXNoRKQ"
      />
      <l-layer-group>
        <v-marker-cluster ref="vesselMarkerClusters" />
      </l-layer-group>
    </l-map>
    <base-material-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      right
      :type="null"
    >
      {{ snackbarText }}
    </base-material-snackbar>
  </div>
</template>

<script>
  import { LMap, LTileLayer, LControlScale, LLayerGroup } from 'vue2-leaflet'
  import axios from 'axios'
  import * as L from 'leaflet'
  import { serviceItems } from '@/mixins/serviceItems'
  import { snackBar } from '@/mixins/snackBar'
  import 'leaflet-easyprint'
  import 'leaflet-graticule'
  import download from 'downloadjs'
  import vesselInfo from './components/VesselInfo'

  export default {
    components: { LMap, LTileLayer, LControlScale, LLayerGroup, vesselInfo },
    mixins: [serviceItems, snackBar],
    data: () => ({
      map: null,
      mapOptions: {
        attributionControl: false,
        zoomControl: false,
        updateWhenZooming: false,
        updateWhenIdle: false,
        touchZoom: false,
        preferCanvas: true,
        maxBounds: [[-90, -360], [90, 360]],
      },
      loadingVessels: false,
      loading: false,
      vessels: [],
      displayOptions: {
        vessels: true,
        individuals: true,
        companies: true,
        grid: false,
        wind: false,
        wave: false,
        draw: false,
        grouping: true,
      },
      showMapMenu: true,
      search: '',
      zones: [],
      fleets: [],
      networks: [],
      selectedFleets: [],
      selectedNetworks: [],
      smffFilter: {
        operator: 'and',
        selected: [],
      },
      easyPrinter: null,
      latlngGrid: null,
      ciLayer: null,
      vesselMarkerClusters: null,
      infoDrawer: {
        show: false,
        type: '',
        id: 0,
        addressId: 0,
      },
      loadingTooltip: [],
      windLayer: null,
      waveLayer: null,
    }),
    watch: {
      'displayOptions.vessels' (value) {
        if (value) {
          if (this.displayOptions.grouping) {
            this.vesselMarkerClusters.addTo(this.map)
            this.map.removeLayer(this.ciLayer)
          } else {
            this.ciLayer.addTo(this.map)
            this.map.removeLayer(this.vesselMarkerClusters)
          }
        } else {
          this.map.removeLayer(this.vesselMarkerClusters)
          this.map.removeLayer(this.ciLayer)
        }
      },
      'displayOptions.grouping' (value) {
        if (this.displayOptions.vessels) {
          if (value) {
            this.vesselMarkerClusters.addTo(this.map)
            this.map.removeLayer(this.ciLayer)
          } else {
            this.ciLayer.addTo(this.map)
            this.map.removeLayer(this.vesselMarkerClusters)
          }
        } else {
          this.map.removeLayer(this.vesselMarkerClusters)
          this.map.removeLayer(this.ciLayer)
        }
      },
      'displayOptions.grid' (value) {
        if (value) {
          this.latlngGrid.addTo(this.map)
        } else {
          this.map.removeLayer(this.latlngGrid)
        }
      },
      'displayOptions.wind' (value) {
        if (value) {
          this.windLayer.addTo(this.map)
        } else {
          this.map.removeLayer(this.windLayer)
        }
      },
      'displayOptions.wave' (value) {
        if (value) {
          this.waveLayer.addTo(this.map)
        } else {
          this.map.removeLayer(this.waveLayer)
        }
      },
    },
    async mounted () {
      this.loading = true

      this.map = this.$refs.map.mapObject

      this.addControls()

      this.easyPrinter = L.easyPrint({
        title: 'Print map',
        position: 'topright',
        filename: 'CDT_Map',
        exportOnly: true,
        hideControlContainer: true,
        hidden: true,
      }).addTo(this.map)
      this.latlngGrid = L.latlngGraticule({
        interval: 20,
        showOriginLabel: true,
        redraw: 'move',
        zoomIntervals: [
          { start: 2, end: 3, interval: 20 },
          { start: 4, end: 4, interval: 10 },
          { start: 5, end: 7, interval: 5 },
          { start: 8, end: 10, interval: 1 },
        ],
      })
      let res = await fetch('/storage/wind-global.json')
      res = await res.json()
      this.windLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: 'Wind',
          emptyString: 'No wind data',
          displayEmptyString: 'No wind data',
          angleConvention: 'bearingCW',
          speedUnit: 'kt',
        },
        data: res,
      })
      res = await fetch('/storage/wave-global.json')
      res = await res.json()
      this.waveLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: 'Wave',
          emptyString: 'No wave data',
          displayEmptyString: 'No wave data',
          angleConvention: 'bearingCW',
          speedUnit: 'kt',
        },
        data: res,
      })

      res = await axios.get('map/zones')
      this.zones = res.data.data
      res = await axios.get('map/fleets')
      this.fleets = res.data
      res = await axios.get('map/networks')
      this.networks = res.data

      this.vesselMarkerClusters = this.$refs.vesselMarkerClusters.mapObject
      this.ciLayer = L.canvasIconLayer({}).addTo(this.map)

      await this.getVessels()
      this.renderVessels()

      this.loading = false
    },
    methods: {
      async getVessels () {
        const filters = {
          fleets: this.selectedFleets,
          networks: this.selectedNetworks,
          smff_selected: this.smffFilter.selected,
          smff_operator: this.smffFilter.operator,
        }
        if (!this.loadingVessels) {
          this.loadingVessels = true
          const res = await axios.get(`/map/vessels/${JSON.stringify(filters)}`)
          this.vessels = res.data
          this.loadingVessels = false
        }
      },
      renderVessels () {
        this.vesselMarkerClusters.clearLayers()
        this.ciLayer.clearLayers()

        if (this.loadingVessels) return

        this.vessels.forEach(vessel => {
          const marker = L.marker([vessel[1], vessel[2]], {
            icon: L.icon(this.getVesselIcon(vessel[5], vessel[4])),
            rotationAngle: vessel[3],
            vesselId: vessel[0],
          }).on('click', () => {
            this.infoDrawer.show = true
            this.infoDrawer.type = 'vessel'
            this.infoDrawer.id = vessel[0]
          }).on('mousemove', () => {
            if (marker.getTooltip() === undefined && !this.loadingTooltip.includes(vessel[0])) {
              this.loadingTooltip.push(vessel[0])
              axios.get(`map/vessels/tooltip/${vessel[0]}`)
                .then(res => {
                  const data = res.data
                  const content = `${data.name} [${data.imo || '--'}] / ${data.speed} knots / ${data.course}&deg;<br>AIS Status: ${data.nav_status.value}<br>Position received: ${this.prettyDateForm(new Date(data.ais_last_update))}<br>Destination: ${data.destination || 'Unknown'}<br>ETA: ${data.eta || 'Unknown'}`
                  marker.bindTooltip(content, { className: 'vessel-tooltip' }).openTooltip()
                  this.loadingTooltip.splice(this.loadingTooltip.indexOf(vessel[0]), 1)
                })
            }
          })
          marker.addTo(this.ciLayer)
          marker.addTo(this.vesselMarkerClusters)
        })
        this.ciLayer.addOnClickListener((e, data) => {
          this.infoDrawer.show = true
          this.infoDrawer.type = 'vessel'
          this.infoDrawer.id = data.options.vesselId
        })
        this.ciLayer.addOnHoverListener((e, data) => {
          // console.log(data)
          // if (this.ciLayer.getTooltip() === undefined && !this.loadingTooltip) {
          //   this.loadingTooltip = true
          //   axios.get(`map/vessels/tooltip/${data.options.vesselId}`)
          //     .then(res => {
          //       const data = res.data
          //       const content = `${data.name} [${data.imo || '--'}] / ${data.speed} knots / ${data.course}&deg;<br>AIS Status: ${data.nav_status.value}<br>Position received: ${this.prettyDateForm(new Date(data.ais_last_update))}<br>Destination: ${data.destination}<br>ETA: ${data.eta}`
          //       this.ciLayer.bindTooltip(content, { className: 'vessel-tooltip' }).openTooltip()
          //       this.loadingTooltip = false
          //     })
          // }
        })
        this.ciLayer.redraw()

        if (this.displayOptions.grouping) {
          this.vesselMarkerClusters.addTo(this.map)
          this.map.removeLayer(this.ciLayer)
        } else {
          this.ciLayer.addTo(this.map)
          this.map.removeLayer(this.vesselMarkerClusters)
        }
      },
      getVesselIcon (vesselType, aisStatusId) {
        const validTypes = ['0', '1', '2', '3', '3a', '3b', '4', '5', '5a', '6', '7', '8', '9']
        if (!vesselType || !validTypes.includes(vesselType.toString())) {
          vesselType = 'Unspecified'
        }
        if (!this.validateAISStatusID(aisStatusId)) {
          aisStatusId = 'No_AIS'
        }
        return {
          iconUrl: require('@/assets/vessel_icons/' + vesselType.toString() + '/' + aisStatusId.toString() + '.png'),
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, 0],
          className: 'default-vessel',
        }
      },
      validateAISStatusID (aisStatusId) {
        const validStatusIDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12]
        return validStatusIDS.includes(aisStatusId)
      },
      loadZone (zone) {
        if (!zone.geojson) {
          fetch(zone.url_geojson)
            .then(r => r.json())
            .then(json => {
              zone.geojson = json
              zone.visible = !zone.visible
            })
        } else {
          zone.visible = !zone.visible
        }
      },
      exportPNG () {
        this.easyPrinter.printMap('CurrentSize', 'CDT_Map_Export')
      },
      exportKML () {
        axios.get('map/export/CDT-Earth.kml', { responseType: 'arraybuffer' })
          .then(res => {
            download(res.data, 'CDT-Earth.kml')
            this.showSnackBar('Download started', 'success')
          }).catch(() => {
            this.showSnackBar('Cannot download', 'error')
          })
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
      addControls () {
        this.map.addControl(new L.Control.Zoom({ position: 'topright' }))
        this.map.addControl(new L.Control.Fullscreen({ position: 'topright' }))
        const vm = this
        L.easyBar([
          L.easyButton({
            states: [
              {
                stateName: 'show-grid',
                icon: '<i class="mdi mdi-grid" style="font-size:18px;"></i>',
                title: 'Show grid',
                onClick: function (btn, map) {
                  vm.displayOptions.grid = true
                  btn.state('hide-grid')
                },
              }, {
                stateName: 'hide-grid',
                icon: '<i class="mdi mdi-grid" style="font-size:18px; color: #00a3e4"></i>',
                title: 'Hide grid',
                onClick: function (btn, map) {
                  vm.displayOptions.grid = false
                  btn.state('show-grid')
                },
              },
            ],
          }),
          L.easyButton({
            states: [
              {
                stateName: 'show-wind',
                icon: '<i class="mdi mdi-weather-windy" style="font-size:18px;"></i>',
                title: 'Show wind',
                onClick: function (btn, map) {
                  vm.displayOptions.wind = true
                  btn.state('hide-wind')
                },
              }, {
                stateName: 'hide-wind',
                icon: '<i class="mdi mdi-weather-windy" style="font-size:18px; color: #00a3e4"></i>',
                title: 'Hide wind',
                onClick: function (btn, map) {
                  vm.displayOptions.wind = false
                  btn.state('show-wind')
                },
              },
            ],
          }),
          L.easyButton({
            states: [
              {
                stateName: 'show-wave',
                icon: '<i class="mdi mdi-waves" style="font-size:18px;"></i>',
                title: 'Show wave',
                onClick: function (btn, map) {
                  vm.displayOptions.wave = true
                  btn.state('hide-wave')
                },
              }, {
                stateName: 'hide-wave',
                icon: '<i class="mdi mdi-waves" style="font-size:18px; color: #00a3e4"></i>',
                title: 'Hide wave',
                onClick: function (btn, map) {
                  vm.displayOptions.wave = false
                  btn.state('show-wave')
                },
              },
            ],
          }),
        ], { position: 'topright' }).addTo(this.map)
      },
    },
  }
</script>

<style lang="sass">
  .cop-map-container
    height: 100%
    display: flex
    #map
      margin: 0
      width: 100%
      height: 100%
      z-index: 0
    .v-navigation-drawer
      min-width: 256px

  .cop-map-loading-container
    left: 0
    right: 0
    top: 0
    bottom: 0
    position: absolute
    z-index: 99
    .cop-map-loading
      position: absolute
      z-index: 100
      left: 50%
      top: 50%
      transform: translate(-32px, -32px)

  .cop-map-menu
    .v-input--hide-details
      margin: 0
</style>
