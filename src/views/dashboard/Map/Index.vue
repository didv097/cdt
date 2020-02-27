<template>
  <div class="cop-map-container">
    <v-progress-circular
      v-if="loadingVessels || loading"
      size="64"
      color="secondary"
      class="cop-map-loading"
      indeterminate
    />
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
              v-model="displayOptions.grid"
              label="Grid"
              hide-details
            />
          </v-list-item>
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
    <l-map
      id="map"
      ref="map"
      :zoom="3"
      :min-zoom="3"
      :max-zoom="13"
      :world-copy-jump="true"
      :options="mapOptions"
    >
      <l-control-zoom position="topright" />
      <l-control-layers
        ref="layerControl"
        position="topright"
      />
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
  import { LMap, LTileLayer, LControlZoom, LControlLayers, LControlScale, LLayerGroup } from 'vue2-leaflet'
  import axios from 'axios'
  import * as L from 'leaflet'
  import { serviceItems } from '@/mixins/serviceItems'
  import { snackBar } from '@/mixins/snackBar'
  import 'leaflet-easyprint'
  import 'leaflet-graticule'
  import download from 'downloadjs'

  export default {
    components: { LMap, LTileLayer, LControlZoom, LControlLayers, LControlScale, LLayerGroup },
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
      },
      loadingVessels: false,
      loading: false,
      vessels: [],
      displayOptions: {
        grid: false,
        vessels: true,
        individuals: true,
        companies: true,
        wind: false,
        waves: false,
        draw: false,
        grouping: false,
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
    }),
    watch: {
      'displayOptions.grid' (value) {
        if (value) {
          this.latlngGrid.addTo(this.map)
        } else {
          this.map.removeLayer(this.latlngGrid)
        }
      },
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
    },
    async mounted () {
      this.loading = true
      let res = await axios.get('map/zones')
      this.zones = res.data.data
      res = await axios.get('map/fleets')
      this.fleets = res.data
      res = await axios.get('map/networks')
      this.networks = res.data

      this.map = this.$refs.map.mapObject
      this.vesselMarkerClusters = this.$refs.vesselMarkerClusters.mapObject
      this.ciLayer = L.canvasIconLayer({}).addTo(this.map)

      await this.getVessels()
      this.renderVessels()

      this.loading = false
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
        this.$refs.vesselMarkerClusters.mapObject.clearLayers()
        this.ciLayer.clearLayers()

        if (this.loadingVessels) return

        this.vessels.forEach(vessel => {
          const marker = L.marker([vessel[1], vessel[2]], {
            icon: L.icon(this.getVesselIcon(vessel[5], vessel[4])),
            rotationAngle: vessel[3],
          }).addTo(this.$refs.vesselMarkerClusters.mapObject)
            .on('click', e => {
            }).on('mouseover', e => {
              if (marker.getTooltip()) {
                marker.openToolTip()
              }
            })
        })
        this.vessels.forEach(vessel => {
          L.marker([vessel[1], vessel[2]], {
            icon: L.icon(this.getVesselIcon(vessel[5], vessel[4])),
            rotationAngle: vessel[3],
          }).addTo(this.ciLayer)
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
