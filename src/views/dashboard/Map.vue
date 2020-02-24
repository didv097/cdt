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
        url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFucnVsczEiLCJhIjoiY2swcGlhNXpwMDBzNTNvcmcwZDQxcDB6cyJ9.w3WTQktdZ2nMziZtXNoRKQ"
      />
      <l-layer-group>
        <v-marker-cluster ref="vesselMarkers" />
      </l-layer-group>
    </l-map>
  </div>
</template>

<script>
  import { LMap, LTileLayer, LControlZoom, LControlLayers, LControlScale, LLayerGroup } from 'vue2-leaflet'

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
    }),
    mounted () {
    },
    methods: {
    },
  }
</script>
