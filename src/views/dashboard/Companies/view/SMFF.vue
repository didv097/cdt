<template>
  <v-container>
    <base-material-card
      color="primary"
      icon="mdi-pier-crane"
      inline
      :loading="loading"
    >
      <template v-slot:after-heading>
        <div class="display-2">
          SMFF Capabilities
        </div>
      </template>
      <v-card-text>
        <v-expansion-panels
          v-if="smff"
          accordion
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              Network Membership
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="smff-item">
                <label class="smff-label">OPA-90 Response Asset</label>
                <v-checkbox
                  v-model="networks"
                  value="opa_90"
                  class="smff-input"
                />
              </div>
              <div
                v-if="networks.includes('opa_90')"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">GSA Designator</label>
                <v-text-field
                  v-model="smff.acd_gsa_designator"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Donjon Navy Asset</label>
                <v-checkbox
                  v-model="networks"
                  value="dnc"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">NASA Response Asset</label>
                <v-checkbox
                  v-model="networks"
                  value="ns"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">NASA Potential Response Asset</label>
                <v-checkbox
                  v-model="networks"
                  value="npnc"
                  class="smff-input"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Primary SMFF Service
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="smff-item">
                <v-autocomplete
                  v-model="smff.primary_service"
                  :items="serviceItems"
                  item-text="name"
                  item-value="id"
                  label="Select Primary Service"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        :style="`color: ${item.id.charAt(0) === 'm' ? 'red':'black'}`"
                        v-text="item.name"
                      />
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Salvage Service
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <h4 class="smff-header">
                (i) Assessment &amp; Survey
              </h4>
              <div class="smff-item">
                <label class="smff-label">Remote assessment and consultation</label>
                <v-checkbox
                  v-model="smff.s_remote_assessment_and_consultation"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Begin assessment of structural stability</label>
                <v-checkbox
                  v-model="smff.s_begin_assessment_of_structural_stability"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">On-site salvage assessment</label>
                <v-checkbox
                  v-model="smff.s_onsite_salvage_assessment"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Assessment of structural stability</label>
                <v-checkbox
                  v-model="smff.s_assessment_of_structural_stability"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Hull and bottom survey</label>
                <v-checkbox
                  v-model="smff.s_hull_and_bottom_survey"
                  class="smff-input"
                />
              </div>
              <h4 class="smff-header">
                (ii) Stabilization
              </h4>
              <div class="smff-item">
                <label class="smff-label">Emergency towing</label>
                <v-checkbox
                  v-model="smff.s_emergency_towing"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_emergency_towing"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Tug Type</label>
                <v-select
                  v-model="smff.s_tug_type"
                  :items="['Conventional', 'Azimuth stern drive', 'Tractor']"
                  hide-details
                  clearable
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_emergency_towing"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Horsepower</label>
                <v-text-field
                  v-model="smff.s_horsepower"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_emergency_towing"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Bollard Pull</label>
                <v-text-field
                  v-model="smff.s_bollard_pull"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_emergency_towing"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Subchapter M</label>
                <v-text-field
                  v-model="smff.s_subchapter_m"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Salvage plan</label>
                <v-checkbox
                  v-model="smff.s_salvage_plan"
                  class="smff-input"
                />
              </div>

              <div class="smff-item">
                <label class="smff-label">External emergency transfer operations</label>
                <v-checkbox
                  v-model="smff.s_external_emergency_transfer_operations"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Emergency lightering</label>
                <v-checkbox
                  v-model="smff.s_emergency_lightering"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_emergency_lightering"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Floating or land-based receptacle(s)</label>
                <v-checkbox
                  v-model="smff.s_capacity_bbl"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_capacity_bbl"
                class="smff-item smff-sub-item-2"
              >
                <label class="smff-label">Capacity in BBL</label>
                <v-text-field
                  v-model="smff.s_capacity_bbl_value"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Other refloating methods</label>
                <v-checkbox
                  v-model="smff.s_other_refloating_methods"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Making temporary repairs</label>
                <v-checkbox
                  v-model="smff.s_making_temporary_repairs"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Diving services support</label>
                <v-checkbox
                  v-model="smff.s_diving_services_support"
                  class="smff-input"
                />
              </div>
              <h4 class="smff-header">
                (iii) Specialized Salvage Operations
              </h4>
              <div class="smff-item">
                <label class="smff-label">Special salvage operations plan</label>
                <v-checkbox
                  v-model="smff.s_special_salvage_operations_plan"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Subsurface product removal</label>
                <v-checkbox
                  v-model="smff.s_subsurface_product_removal"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Heavy lift</label>
                <v-checkbox
                  v-model="smff.s_heavy_lift"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_heavy_lift"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Lifting Gear Minimum SWL</label>
                <v-text-field
                  v-model="smff.s_lifting_gear_minimum_swl"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_heavy_lift"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Largest Cargo Gear</label>
                <v-text-field
                  v-model="smff.s_largest_cargo_gear"
                  :items="['\'A\' Frame', 'Cargo Lift', 'Crane', 'Derrick Gantry Crane', 'Gearless', 'Unknown']"
                  clearable
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_heavy_lift"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Lifting Gear Reach</label>
                <v-text-field
                  v-model="smff.s_lifting_gear_reach"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_heavy_lift"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Available Deck Space in Square Meters</label>
                <v-text-field
                  v-model="smff.s_available_deck_space"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.s_heavy_lift"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Available Deck Space Location</label>
                <v-text-field
                  v-model="smff.s_available_deck_space_location"
                  class="smff-input"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Marine firefighting
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <h4 class="smff-header">
                (i) Assessment &amp; Planning
              </h4>
              <div class="smff-item">
                <label class="smff-label">Remote assessment and consultation</label>
                <v-checkbox
                  v-model="smff.mff_remote_assessment_and_consultation"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">On-site fire assessment</label>
                <v-checkbox
                  v-model="smff.mff_onsite_fire_assessment"
                  class="smff-input"
                />
              </div>
              <h4 class="smff-header">
                (ii) Fire Suppression
              </h4>
              <div class="smff-item">
                <label class="smff-label">External firefighting teams</label>
                <v-checkbox
                  v-model="smff.mff_external_firefighting_teams"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">External vessel firefighting systems</label>
                <v-checkbox
                  v-model="smff.mff_external_vessel_firefighting_systems"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.mff_external_vessel_firefighting_systems"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Class classification</label>
                <v-select
                  v-model="smff.mff_class_classification"
                  :items="['Not Applicable', 'FiFi 1', 'FiFi 2', 'FiFi 3']"
                  clearable
                  class="smff-input"
                  @change="updatePumpingCapacity"
                />
              </div>
              <div
                v-if="smff.mff_external_vessel_firefighting_systems"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Pumping capacity</label>
                <v-text-field
                  v-model="smff.mff_pumping_capacity"
                  suffix="(gpm)"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div
                v-if="smff.mff_external_vessel_firefighting_systems"
                class="smff-item smff-sub-item"
              >
                <label class="smff-label">Foam quantity</label>
                <v-text-field
                  v-model="smff.mff_foam_quantity"
                  type="number"
                  class="smff-input"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Additional Capabilities and Details
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="smff-item">
                <label class="smff-label">Logistics Asset</label>
                <v-checkbox
                  v-model="smff.acd_logistics_asset"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Passenger Capacity (Number input)</label>
                <v-text-field
                  v-model="smff.acd_passenger_capacity"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Helicopter Capability Landing Size/Capacity</label>
                <v-text-field
                  v-model="smff.acd_heli_landing_capacity"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Helicopter Capability Drop-zone Size</label>
                <v-text-field
                  v-model="smff.acd_heli_drop_zone_size"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Small Boat Capability Size</label>
                <v-text-field
                  v-model="smff.acd_small_boat_size"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Small Boat Capability Capacity</label>
                <v-text-field
                  v-model="smff.acd_small_boat_capacity"
                  type="number"
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Medical Personnel Onboard</label>
                <v-select
                  v-model="smff.acd_medical_personnel_onboard"
                  :items="['Medical doctor / physician normally carried', 'Physician\'s assistant or paramedic normally carried', 'Nurse normally carried', 'No medically trained personnel normally carried']"
                  clearable
                  class="smff-input"
                />
              </div>
              <div class="smff-item">
                <label class="smff-label">Radio Watch Schedule</label>
                <v-select
                  v-model="smff.acd_radio_watch_schedule"
                  :items="['H24-Continuous', 'H16-ITU SKED', 'H8-ITU SKED', 'HX Unspecified']"
                  clearable
                  class="smff-input"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Notes
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-textarea
                v-model="smff.notes"
                auto-grow
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
          <base-material-alert
            color="warning"
            dark
          >
            No SMFF Services for this company
          </base-material-alert>
        </div>
        <v-row class="footer">
          <v-spacer />
          <v-dialog
            v-if="smff"
            v-model="deleteMsg"
            persistent
            max-width="600"
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
                You are about to delete the SMFF Services
              </v-card-title>
              <v-card-text>
                Please confirm that you would like to <b>delete</b> the SMFF Services
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  text
                  @click="deleteMsg = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="error"
                  text
                  @click="deleteSMFF"
                >
                  Delete SMFF Services
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            v-if="smff"
            color="success"
            @click="saveSMFF"
          >
            Save
          </v-btn>
          <v-btn
            v-else
            color="primary"
            @click="createSMFF"
          >
            Create
          </v-btn>
        </v-row>
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
      networks: [],
      smff: {},
      deleteMsg: false,
      serviceItems: [
        {
          id: 'donjon_location',
          name: 'Donjon Location',
          db: 0,
        },
        {
          id: 'smit_location',
          name: 'SMIT Location',
          db: 0,
        },
        {
          id: 'all_services',
          name: 'All Services',
          db: 0,
        },
        {
          id: 's_salvage',
          name: 'Salvage',
          db: 0,
        },
        {
          id: 's_remote_assessment_and_consultation',
          name: 'Remote assessment and consultation',
          db: 1,
        },
        {
          id: 's_begin_assessment_of_structural_stability',
          name: 'Begin assessment of structural stability',
          db: 1,
        },
        {
          id: 's_onsite_salvage_assessment',
          name: 'On-site salvage assessment',
          db: 1,
        },
        {
          id: 's_assessment_of_structural_stability',
          name: 'Assessment of structural stability',
          db: 1,
        },
        {
          id: 's_hull_and_bottom_survey',
          name: 'Hull and bottom survey',
          db: 1,
        },
        {
          id: 's_emergency_towing',
          name: 'Emergency towing',
          db: 1,
        },
        {
          id: 's_salvage_plan',
          name: 'Salvage plan',
          db: 1,
        },
        {
          id: 's_external_emergency_transfer_operations',
          name: 'External emergency transfer operations',
          db: 1,
        },
        {
          id: 's_emergency_lightering',
          name: 'Emergency lightering',
          db: 1,
        },
        {
          id: 's_other_refloating_methods',
          name: 'Other refloating methods',
          db: 1,
        },
        {
          id: 's_making_temporary_repairs',
          name: 'Making temporary repairs',
          db: 1,
        },
        {
          id: 's_diving_services_support',
          name: 'Diving services support',
          db: 1,
        },
        {
          id: 's_special_salvage_operations_plan',
          name: 'Special salvage operations plan',
          db: 1,
        },
        {
          id: 's_subsurface_product_removal',
          name: 'Subsurface product removal',
          db: 1,
        },
        {
          id: 's_heavy_lift',
          name: 'Heavy lift',
          db: 1,
        },
        {
          id: 'm_firefighting',
          name: 'Firefighting',
          db: 0,
        },
        {
          id: 'mff_remote_assessment_and_consultation',
          name: 'Remote assessment and consultation',
          db: 1,
        },
        {
          id: 'mff_onsite_fire_assessment',
          name: 'On-site fire assessment',
          db: 1,
        },
        {
          id: 'mff_external_firefighting_teams',
          name: 'External firefighting teams',
          db: 1,
        },
        {
          id: 'mff_external_vessel_firefighting_systems',
          name: 'External vessel firefighting systems',
          db: 1,
        },
        {
          id: 'acd_logistics_asset',
          name: 'Logistics Asset',
          db: 1,
        },
      ],
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/smff')
          .then(res => {
            this.networks = res.data.networks
            this.smff = res.data.smff
            this.loading = false
          })
      },
      createSMFF () {
        axios.post('companies/' + this.$route.params.id + '/smff/create')
          .then(res => {
            this.getDataFromApi()
            this.snackbar = true
            this.snackbarColor = 'primary'
            this.snackbarText = res.data.message
          })
      },
      deleteSMFF () {
        this.loading = true
        axios.delete('companies/' + this.$route.params.id + '/smff')
          .then(res => {
            this.networks.length = 0
            this.smff = null
            this.snackbar = true
            this.snackbarColor = 'primary'
            this.snackbarText = res.data.message
            this.loading = false
            this.deleteMsg = false
          })
      },
      saveSMFF () {
        const data = {
          smff: this.smff,
          networks: this.networks,
        }
        axios.post('companies/' + this.$route.params.id + '/smff', data)
          .then(res => {
            this.getDataFromApi()
            this.snackbar = true
            this.snackbarColor = 'primary'
            this.snackbarText = res.data.message
          })
          .catch(error => {
            if (error.response && error.response.data) {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = error.response.data.message
            }
          })
      },
      updatePumpingCapacity () {
        if (!this.smff.mff_pumping_capacity) {
          switch (this.smff.mff_class_classification) {
            case 'FiFi 1':
              this.smff.mff_pumping_capacity = 10.569
              break
            case 'FiFi 2':
              this.smff.mff_pumping_capacity = 31.704
              break
            case 'FiFi 3':
              this.smff.mff_pumping_capacity = 42.272
              break
          }
        }
      },
    },
  }
</script>

<style lang="sass">
  .smff-item
    display: flex
    padding: 10px !important
    border-bottom: 1px solid lightgrey
    .smff-label
      width: 300px
    .smff-input
      margin: initial
      padding: initial
      height: 25px
  .smff-item:nth-child(even)
    background: #efefef
  .smff-item.smff-sub-item
    padding-left: 20px !important
  .smff-item.smff-sub-item-2
    padding-left: 30px !important
  .smff-header
    margin-top: 16px
    margin-bottom: 8px
  .v-expansion-panel-header
    color: primary !important
    font-size: 16px !important
  .v-expansion-panel-content
    padding-left: 20px
  .footer>.v-btn
    margin: 12px !important
</style>
