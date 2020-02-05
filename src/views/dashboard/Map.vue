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

  export default {
    name: 'Map',

    components: {
    },
    data: () => ({
      search: '',
      options: {},
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
