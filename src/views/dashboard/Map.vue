<template>
  <v-container
    id="map"
    tag="section"
  >
    <!-- <l-map>
      <l-tile-layer></l-tile-layer>
    </l-map> -->
  </v-container>
</template>

<script>
  import { LMap, LTileLayer } from 'vue2-leaflet'

  export default {
    name: 'Map',

    components: {
      LMap, LTileLayer
    },
    data: () => ({
      search: '',
      options: {}
    }),
    async mounted () {
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
      },
    },
  }
</script>
