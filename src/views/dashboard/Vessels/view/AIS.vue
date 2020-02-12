<template>
  <v-container>
    <base-material-card
      color="primary"
      title="AIS Data"
      :loading="loading"
    >
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="editedItem.latitude"
              type="number"
              label="Latitude"
              prepend-icon="mdi-map-marker"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="editedItem.longitude"
              type="number"
              label="Longitude"
              prepend-icon="mdi-map-marker"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="editedItem.fleets"
              :items="fleetItems"
              item-text="name"
              item-value="id"
              label="Fleets"
              prepend-icon="mdi-anchor"
              multiple
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-select
              v-model="editedItem.zone_id"
              :items="zoneItems"
              item-text="name"
              item-value="id"
              label="Zone"
              prepend-icon="mdi-map"
            />
          </v-col>
        </v-row>
        <v-btn
          color="success"
          @click="saveAIS"
        >
          Save
        </v-btn>
      </v-card-text>
    </base-material-card>
    <base-material-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      right
      :type="null"
    >
      {{ snackbarText }}
    </base-material-snackbar>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { snackBar } from '@/mixins/snackBar'

  export default {
    mixins: [snackBar],
    data: () => ({
      loading: false,
      editedItem: {},
      fleetItems: [],
      zoneItems: [],
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('fleets')
          .then(res => {
            this.fleetItems = res.data.data
          })
        axios.get('zones/short')
          .then(res => {
            this.zoneItems = res.data.data
          })
        axios.get('vessels/' + this.$route.params.id + '/ais')
          .then(res => {
            this.editedItem = res.data.data[0]
            this.loading = false
          })
      },
      saveAIS () {
        axios.post('vessels/' + this.$route.params.id + '/ais', this.editedItem)
          .then(res => {
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
          })
          .catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar(error.response.data.message || error.response.status, 'error')
            }
          })
      },
    },
  }
</script>
