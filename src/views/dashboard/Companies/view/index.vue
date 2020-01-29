<template>
  <div>
    View Company
  </div>
</template>

<script>
  import axios from 'axios'

  export default {

    data: () => ({
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
