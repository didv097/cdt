<template>
  <div class="cop-map-container">
    <l-map
      id="map"
      ref="map"
      :zoom="3"
      :min-zoom="3"
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
        <v-marker-cluster ref="vesselMarkers" />
      </l-layer-group>
      <l-layer-group ref="markers" />
    </l-map>
  </div>
</template>

<script>
  import { LMap, LTileLayer, LControlZoom, LControlLayers, LControlScale, LLayerGroup } from 'vue2-leaflet'
  import axios from 'axios'
  import * as L from 'leaflet'

  export default {
    components: { LMap, LTileLayer, LControlZoom, LControlLayers, LControlScale, LLayerGroup },
    data: () => ({
      mapOptions: {
        attributionControl: false,
        zoomControl: false,
        updateWhenZooming: false,
        updateWhenIdle: false,
        touchZoom: true,
      },
      loadingVessels: false,
      vessels: [],
      options: {
        grid: false,
        vessels: true,
        individuals: true,
        companies: true,
        wind: false,
        waves: false,
        draw: false,
        mapGrouping: false,
      },
    }),
    mounted () {
      this.renderVessels()
    },
    methods: {
      renderVessels () {
        const filters = {
          fleets: true,
          networks: true,
          smff_selected: true,
          smff_operator: true,
        }
        if (!this.loadingVessels) {
          this.loadingVessels = true
          axios.get(`/map/vessels/${JSON.stringify(filters)}`)
            .then(res => {
              this.vessels = res.data
              this.$refs.vesselMarkers.mapObject.clearLayers()
              this.$refs.markers.mapObject.clearLayers()
              if (this.options.mapGrouping) {
                this.vessels.forEach(vessel => {
                  // console.log(this.getVesselIcon(vessel[5], vessel[4]))
                  const marker = L.marker([vessel[1], vessel[2]], {
                    icon: L.icon(this.getVesselIcon(vessel[5], vessel[4])),
                    rotationAngle: vessel[3],
                  }).addTo(this.$refs.vesselMarkers.mapObject)
                    .on('click', e => {
                      // console.log(e)
                    }).on('mouseover', e => {
                      // console.log(e)
                      if (marker.getTooltip()) {
                        marker.openToolTip()
                      }
                    })
                })
              } else {
                for (let i = 0; i < this.vessels.length; i++) {
                  const marker = L.marker([this.vessels[i][1], this.vessels[i][2]], {
                    icon: L.icon(this.getVesselIcon(this.vessels[i][5], this.vessels[i][4])),
                    rotationAngle: this.vessels[i][3],
                  })
                  marker.addTo(this.$refs.markers)
                }
              }
            })
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
    },
  }
</script>
