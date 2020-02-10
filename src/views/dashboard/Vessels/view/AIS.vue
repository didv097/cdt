<template>
  <v-container>
    <base-material-card
      color="primary"
      title="AIS Data"
      :loading="loading"
    >
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="editedItem.latitude"
              type="number"
              label="Latitude"
              prepend-icon="mdi-map-marker"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="editedItem.longitude"
              type="number"
              label="Longitude"
              prepend-icon="mdi-map-marker"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
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
          <v-col>
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

  export default {
    data: () => ({
      snackbar: false,
      snackbarColor: 'primary',
      snackbarText: 'snackbar',
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
            console.log(this.editedItem)
          })
      },
      saveAIS () {
        axios.post('vessels/' + this.$route.params.id + '/ais', this.editedItem)
          .then(res => {
            this.snackbar = true
            this.snackbarColor = 'success'
            this.snackbarText = res.data.message
            this.getDataFromApi()
          })
          .catch(error => {
            if (error.response && error.response.data) {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = error.response.data.message || error.response.status
            }
          })
      },
    },
  }
</script>
