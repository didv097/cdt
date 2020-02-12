<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Individual Address"
      :loading="loading"
    >
      <v-card-text>
        <l-map
          v-if="address.latitude && address.longitude"
          id="map"
          :zoom="13"
          :center="[address.latitude, address.longitude]"
          :options="{ dragging: false, scrollWheelZoom: false}"
        >
          <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          <l-marker :lat-lng="[address.latitude, address.longitude]" />
        </l-map>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.street"
              label="Street"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.zip"
              label="Zip"
              type="number"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.unit"
              label="Unit"
              type="number"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.province"
              label="Province"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.city"
              label="City"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.phone"
              label="Phone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.state"
              label="State"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-select
              v-model="address.zone_id"
              :items="zoneItems"
              item-text="name"
              item-value="id"
              label="Zone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.country"
              label="Country"
            />
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              v-model="address.latitude"
              label="Latitude"
            />
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              v-model="address.longitude"
              label="Longitude"
            />
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          @click="saveAddress"
        >
          Save
        </v-btn>
        <v-btn
          color="error"
          @click="deleteAddress"
        >
          Delete Address
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
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

  export default {
    components: {
      LMap, LTileLayer, LMarker,
    },
    mixins: [snackBar],
    data: () => ({
      loading: false,
      address: {},
      zoneItems: [],
    }),
    mounted () {
      this.getAddress()
    },
    methods: {
      getAddress () {
        this.loading = true
        axios.get('zones/short')
          .then(res => {
            this.zoneItems = res.data.data
          })
        axios.get(`users/${this.$route.params.id}/addresses`)
          .then(res => {
            this.address = res.data
            this.loading = false
            console.log(this.address)
          })
      },
      saveAddress () {
        axios.post(`users/addresses/${this.address.id}`, { address: this.address })
          .then(res => {
            this.getAddress()
            this.showSnackBar(res.data.message, 'success')
          }).catch(error => {
            this.showSnackBar(error.response.data.message || error.response.status, 'error')
          })
      },
      deleteAddress () {
        this.$confirm(`Please confirm that you would like to delete the following address:
          <b>${this.address.street} ${this.address.city} ${this.address.country}</b>`)
          .then(res => {
            if (res) {
              axios.delete('users/addresses/' + this.address.id)
                .then(res => {
                  this.getAddress()
                  this.showSnackBar(res.data.message, 'success')
                }).catch(error => {
                  this.showSnackBar(error.response.data.message || error.response.status, 'error')
                })
            }
          })
      },
    },
  }
</script>
