<template>
  <div v-if="vessel">
    <v-img
      v-if="vessel.photo"
      :src="vessel.photo"
    />
    <v-icon
      v-else
      size="64"
    >
      mdi-ferry
    </v-icon>
    <div class="headline">
      {{ vessel.name }}
    </div>
  </div>
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
      }
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
        axios.get('/map/vessel/' + this.id)
          .then(res => {
            this.vessel = res.data.data
          })
      },
    },
  }
</script>
