<template>
  <v-container>
    <base-material-card
      color="green"
      icon="mdi-map-marker"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Address
        </div>
      </template>
      <v-card-text>
        <base-material-tabs
          v-model="activeTab"
          color="green"
          icons-and-text
          fixed-tabs
          height="48"
        >
          <v-tab>
            <span>
              <v-icon>mdi-file-document</v-icon> Billing
            </span>
          </v-tab>
          <v-tab>
            <span>
              <v-icon>mdi-source-branch</v-icon> Branches
            </span>
          </v-tab>
          <v-tab>
            <span>
              <v-icon>mdi-home-map-marker</v-icon> Primary
            </span>
          </v-tab>
          <v-tabs-items
            v-model="activeTab"
          >
            <v-tab-item
              v-for="addressesItem in addressesItems"
              :key="addressesItem.id"
            >
              <v-row>
                <v-spacer />
                <v-btn
                  icon
                  color="orange"
                >
                  <v-icon size="32">
                    mdi-plus-circle-outline
                  </v-icon>
                </v-btn>
              </v-row>
              <div
                v-if="addressesItem.addresses.length > 0"
              >
                <div
                  v-for="address in addressesItem.addresses"
                  :key="address.id"
                >
                  <l-map
                    v-if="address.latitude && address.longitude"
                    id="map"
                    :zoom="13"
                    :center="[address.latitude, address.longitude]"
                    :options="{ zoomControl: false, dragging: false, scrollWheelZoom: false}"
                  >
                    <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                    <l-marker :lat-lng="[address.latitude, address.longitude]" />
                  </l-map>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="address.street"
                        label="Street"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="address.unit"
                        label="Unit"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="address.city"
                        label="City"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="address.state"
                        label="State"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="address.country"
                        label="Country"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="address.zip"
                        label="Zip"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="address.province"
                        label="Province"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="address.phone"
                        label="Phone"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col md="6">
                      <v-select
                        v-model="address.zone_id"
                        :items="zones"
                        item-text="name"
                        item-value="id"
                        label="Zone"
                      />
                    </v-col>
                    <v-col md="3">
                      <v-text-field
                        v-model="address.latitude"
                        label="Latitude"
                      />
                    </v-col>
                    <v-col md="3">
                      <v-text-field
                        v-model="address.longitude"
                        label="Longitude"
                      />
                    </v-col>
                  </v-row>
                </div>
              </div>
              <div v-else>
                <base-material-alert
                  color="orange"
                  dark
                >
                  No Addresses Defined
                </base-material-alert>
              </div>
              <v-row class="footer">
                <v-btn
                  color="green"
                >
                  Save
                </v-btn>
                <v-btn
                  color="red"
                >
                  Delete
                </v-btn>
                <v-spacer />
                <v-btn
                  color="black"
                >
                  Document Format
                </v-btn>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
      </v-card-text>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

  export default {
    components: {
      LMap, LTileLayer, LMarker,
    },
    data: () => ({
      activeTab: 0,
      addressesItems: [],
      zones: [],
    }),
    mounted () {
      this.getAddresses()
      axios.get('zones/short')
        .then(res => {
          this.zones = res.data.data
        })
    },
    methods: {
      getAddresses () {
        axios.get('companies/' + this.$route.params.id + '/addresses')
          .then(res => {
            this.addressesItems = res.data
          })
      },
    },
  }
</script>

<style lang="sass">
  .col
    padding-top: 0
    padding-bottom: 0
  #map
    margin-top: 1rem
    margin-bottom: 1rem
    height: 200px
    width: 100%
  .footer>.v-btn
    margin: 12px !important
</style>
