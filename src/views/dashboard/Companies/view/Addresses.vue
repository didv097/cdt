<template>
  <v-container>
    <base-material-card
      color="primary"
      icon="mdi-map-marker"
      inline
      :loading="loading"
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Address
        </div>
      </template>
      <v-card-text>
        <base-material-tabs
          v-model="activeTab"
          color="info"
          icons-and-text
          :fixed-tabs="$vuetify.breakpoint.smAndUp"
          show-arrows
          height="36"
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
                  color="primary"
                  @click="addAddress(addressesItem.id)"
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
                    :options="{ dragging: false, scrollWheelZoom: false}"
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
                  <v-row class="footer">
                    <v-btn
                      color="success"
                      @click="saveAddress(address)"
                    >
                      Save
                    </v-btn>
                    <v-dialog
                      v-model="deleteMsg[address.id]"
                      persistent
                      max-width="500"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="error"
                          dark
                          v-on="on"
                        >
                          Delete
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="headline">
                          You are about to delete an address
                        </v-card-title>
                        <v-card-text>
                          Please confirm that you would like to delete the following address: <b>{{ address.street + ' ' + address.city + ' ' + address.country }}</b>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            color="primary"
                            text
                            @click="deleteMsg[address.id] = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="error"
                            text
                            @click="deleteAddress(address.id)"
                          >
                            Delete Address
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-spacer />
                    <v-btn
                      color="info"
                      @click="showDocumentFormat(address)"
                    >
                      Document Format
                    </v-btn>
                  </v-row>
                </div>
              </div>
              <div v-else>
                <base-material-alert
                  color="warning"
                  dark
                >
                  No Addresses Defined
                </base-material-alert>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
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
    <v-dialog
      v-model="showFormatForm"
      max-width="500"
    >
      <v-card>
        <v-card-title>Document Address</v-card-title>
        <v-divider />
        <v-card-text>
          <v-textarea v-model="documentFormatAddress.document_format" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="showFormatForm = false"
          >
            Close
          </v-btn>
          <v-btn
            color="success"
            text
            @click="saveAddressFormat"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      snackbar: false,
      snackbarColor: 'primary',
      snackbarText: 'snackbar',
      deleteMsg: {},
      showFormatForm: false,
      documentFormatAddress: {
        document_format: '',
      },
      loading: false,
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
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/addresses')
          .then(res => {
            this.addressesItems = res.data
            this.loading = false
          })
      },
      saveAddress (address) {
        axios.post('companies/addresses/' + address.id, { address: address })
          .then(res => {
            this.getAddresses()
            this.snackbar = true
            this.snackbarText = res.data.message
          })
      },
      deleteAddress (id) {
        axios.delete('companies/addresses/' + id)
          .then(res => {
            this.deleteMsg[id] = false
            this.getAddresses()
            this.snackbar = true
            this.snackbarText = res.data.message
          })
      },
      showDocumentFormat (address) {
        if (!address.document_format) {
          if (address.street) {
            address.document_format = address.street
          }
          if (address.unit) {
            address.document_format += ', ' + address.unit
          }
          address.document_format += '\n'
          if (address.city) {
            address.document_format += address.city
          }
          if (address.province) {
            address.document_format += ', ' + address.province
          }
          if (address.zip) {
            address.document_format += ', ' + address.zip
          }
          address.document_format += '\n'
          if (address.country) {
            address.document_format += address.country
          }
        }
        if (address.document_format.trim() === 'null') {
          address.document_format = 'No Address'
        }
        this.documentFormatAddress = address
        this.showFormatForm = true
      },
      saveAddressFormat () {
        this.saveAddress(this.documentFormatAddress)
        this.showFormatForm = false
      },
      addAddress (typeId) {
        axios.post('companies/' + this.$route.params.id + '/addresses/store', { type_id: typeId })
          .then(res => {
            this.getAddresses()
            this.snackbar = true
            this.snackbarText = res.data.message
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
  .leaflet-pane
    z-index: 0
</style>
