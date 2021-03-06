<template>
  <div>
    <base-material-card
      color="primary"
      title="Address"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <v-card-text>
        <base-material-tabs
          v-model="activeTab"
          color="info"
          :fixed-tabs="$vuetify.breakpoint.smAndUp"
          show-arrows
          height="36"
        >
          <v-tab
            v-for="addressesItem in addressesItems"
            :key="addressesItem.id"
          >
            <span>
              {{ addressesItem.name }}
            </span>
          </v-tab>
          <v-tabs-items
            v-model="activeTab"
          >
            <v-tab-item
              v-for="addressesItem in addressesItems"
              :key="addressesItem.id"
            >
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
                        v-model="address.unit"
                        label="Unit"
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
                        v-model="address.state"
                        label="State"
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
                      sm="6"
                    >
                      <v-text-field
                        v-model="address.zip"
                        label="Zip"
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
                        v-model="address.phone"
                        label="Phone"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-select
                        v-model="address.zone_id"
                        :items="$store.state.menuitems.zoneItems"
                        item-text="name"
                        item-value="id"
                        label="Zone"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      sm="3"
                    >
                      <v-text-field
                        v-model="address.latitude"
                        label="Latitude"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      sm="3"
                    >
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
                    <v-btn
                      color="error"
                      @click="deleteAddress(address)"
                    >
                      Delete Address
                    </v-btn>
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
              <base-material-alert
                v-else
                color="warning"
                dark
              >
                No Addresses Defined
              </base-material-alert>
              <v-row>
                <v-spacer />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      fab
                      small
                      color="secondary"
                      class="accent--text"
                      @click="addAddress(addressesItem.id)"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-map-marker-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  Add Address
                </v-tooltip>

                <v-spacer />
              </v-row>
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
  </div>
</template>

<script>
  import axios from 'axios'
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
  import { snackBar } from '@/mixins/snackBar'

  export default {
    components: {
      LMap, LTileLayer, LMarker,
    },
    mixins: [snackBar],
    data: () => ({
      activeTab: 0,
      addressesItems: [],
      showFormatForm: false,
      documentFormatAddress: {
        document_format: '',
      },
      loading: false,
    }),
    mounted () {
      this.getAddresses()
    },
    methods: {
      getAddresses () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/addresses')
          .then(res => {
            this.addressesItems[0] = res.data.find(a => a.name === 'Primary')
            this.addressesItems[0].icon = 'mdi-home-map-marker'
            this.addressesItems[1] = res.data.find(a => a.name === 'Billing')
            this.addressesItems[1].icon = 'mdi-file-document'
            this.addressesItems[2] = res.data.find(a => a.name === 'Branches')
            this.addressesItems[2].icon = 'mdi-source-branch'
            this.loading = false
          })
      },
      saveAddress (address) {
        axios.post('companies/addresses/' + address.id, { address: address })
          .then(res => {
            this.showSnackBar(res.data.message, 'success')
            this.getAddresses()
          })
      },
      deleteAddress (address) {
        this.$confirm(`Please confirm that you would like to delete the following address:
          <b>${address.street} ${address.city} ${address.country}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete('companies/addresses/' + address.id)
                .then(res => {
                  this.showSnackBar(res.data.message, 'success')
                  this.getAddresses()
                })
            }
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
            this.showSnackBar(res.data.message, 'success')
          }).catch(error => {
            this.showSnackBar(error.response.data.message || error.response.statusText, 'error')
          })
      },
    },
  }
</script>

<style lang="sass">
  .footer>.v-btn
    margin: 12px !important
</style>
