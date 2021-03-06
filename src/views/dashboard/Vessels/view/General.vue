<template>
  <v-container>
    <base-material-card
      color="primary"
      title="General Information"
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
          <v-tab>
            Vessel Data
          </v-tab>
          <v-tab>
            Plan Data
          </v-tab>
          <v-tab>
            VRP
          </v-tab>
          <v-tab>
            Communications
          </v-tab>
          <v-tabs-items
            v-model="activeTab"
            class="tabs-container"
          >
            <v-tab-item>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="[v => !!v || 'Vessel Name is required']"
                    prepend-icon="mdi-ferry"
                    label="Vessel Name *"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.vessel_type_id"
                    :items="$store.state.menuitems.vesselTypeItems"
                    item-text="name"
                    item-value="id"
                    prepend-icon="mdi-tag"
                    label="Vessel Type"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.imo"
                    type="number"
                    prepend-icon="mdi-fingerprint"
                    label="IMO Number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.dead_weight"
                    prepend-icon="mdi-weight"
                    label="Dead Weight"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.mmsi"
                    type="number"
                    prepend-icon="mdi-antenna"
                    label="MMSI Number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.deck_area"
                    type="number"
                    prepend-icon="mdi-texture-box"
                    label="Deck Area (sq meters)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.oil_tank_volume"
                    type="number"
                    prepend-icon="mdi-hydraulic-oil-level"
                    label="Oil Tank Volume (cubic meters)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-select
                    v-model="editedItem.oil_group"
                    :items="['I', 'II', 'III', 'IV', 'V']"
                    prepend-icon="mdi-oil"
                    label="Oil Group"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-switch
                    v-model="editedItem.tanker"
                    color="info"
                    label="Is Tank Vessel"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.qi"
                    :items="$store.state.menuitems.qiItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-anchor"
                    label="QI Company"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.company_id"
                    :items="$store.state.menuitems.companyItems"
                    item-text="name"
                    item-value="id"
                    clearable
                    :rules="[v => !!v || 'Company is required']"
                    prepend-icon="mdi-domain"
                    label="Company * (Plan Holder)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.operating_company_id"
                    :items="$store.state.menuitems.companyItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-domain"
                    label="Operating Company"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.societies"
                    :items="$store.state.menuitems.societyItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-axis-arrow-lock"
                    label="Classification Society"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.insurers"
                    :items="$store.state.menuitems.insurerItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-engine"
                    label="H & M Insurer"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.providers"
                    :items="$store.state.menuitems.providerItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-chart-bell-curve"
                    label="Damage Stability Provider"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.pi"
                    :items="$store.state.menuitems.piItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-umbrella"
                    label="P & I Club"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.plan_number"
                    prepend-icon="mdi-file-document-edit"
                    label="Plan Number"
                    readonly
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row class="vessel-info-heading">
                Vessel "Company" Contacts (aka DPA)
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.primary_poc_id"
                    :items="vesselContactItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-office-building"
                    label="Primary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.secondary_poc_id"
                    :items="vesselContactItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-office-building"
                    label="Secondary"
                  />
                </v-col>
              </v-row>
              <v-row class="vessel-info-heading">
                Vessel Contact Information
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.sat_phone_primary"
                    prepend-icon="mdi-phone"
                    label="SAT Telephone Primary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.sat_phone_secondary"
                    prepend-icon="mdi-phone"
                    label="SAT Telephone Secondary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.email_primary"
                    prepend-icon="mdi-email"
                    label="Email Primary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.email_secondary"
                    prepend-icon="mdi-email"
                    label="Email Secondary"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
        <v-btn
          color="primary"
          @click="saveVessel"
        >
          Save
        </v-btn>
        <v-btn
          color="error"
          @click="deleteVessel"
        >
          Delete Vessel
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
      activeTab: 0,
      vesselContactItems: [],
    }),
    watch: {
      'editedItem.company_id' () {
        this.getVesselContactItems()
      },
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        this.getVesselContactItems()
        axios.get('vessels/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.loading = false
          })
      },
      getVesselContactItems () {
        if (this.editedItem.company_id) {
          axios.get('companies/' + this.editedItem.company_id + '/contacts')
            .then(res => {
              this.vesselContactItems = res.data.data
            })
        } else {
          this.vesselContactItems = []
        }
      },
      saveVessel () {
        axios.post('vessels/' + this.$route.params.id, this.editedItem)
          .then(res => {
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
          })
          .catch(error => {
            this.showSnackBar(error.response.data.message || error.response.statusText, 'error')
          })
      },
      deleteVessel () {
        this.$confirm('You are about to delete this vessel. Are you sure that you want to proceed?', {
          title: 'Warning',
        })
          .then(res => {
            if (res) {
              axios.delete('vessels/' + this.editedItem.id + '/destroy')
                .then(res => {
                  this.$router.push('/vessels')
                  this.showSnackBar(res.data.message, 'success')
                })
                .catch(error => {
                  this.showSnackBar(error.response.data.message || error.response.statusText, 'error')
                })
            }
          })
      },
    },
  }
</script>

<style lang="sass">
  .tabs-container
    margin-top: 2rem
  .vessel-info-heading
    margin-left: 2rem
</style>
