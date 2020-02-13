<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Vessel Construction"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
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
            <span class="tab-item">
              <v-icon>
                mdi-ferry
              </v-icon>
              Vessel Relationships
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-item">
              <v-icon>
                mdi-ruler
              </v-icon>
              Dimensions
            </span>
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
                  <v-checkbox
                    v-model="editedItem.lead_ship"
                    label="Lead Ship"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-select
                    v-model="editedItem.providers"
                    :items="providerItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-anchor"
                    label="Damage Stability Provider"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-select
                    v-model="editedItem.sister_vessels"
                    :items="sisterVesselItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-ferry"
                    label="Sister Ships"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-select
                    v-model="editedItem.child_vessels"
                    :items="childVesselItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-anchor"
                    label="Child Ships"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              No data
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
      </v-card-text>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      loading: false,
      editedItem: {},
      activeTab: 0,
      providerItems: [],
      sisterVesselItems: [],
      childVesselItems: [],
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
        axios.get('vendors/providers')
          .then(res => {
            this.providerItems = res.data.data
          })
        axios.get('vessels/sister/list')
          .then(res => {
            this.sisterVesselItems = res.data.data
          })
        axios.get('vessels/child/list')
          .then(res => {
            this.childVesselItems = res.data.data
          })
        axios.get('vessels/' + this.$route.params.id + '/constructionDetail')
          .then(res => {
            this.editedItem = res.data.data[0]
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="sass">
  .tab-item
    display: flex
    margin: 0 !important
  .tabs-container
    margin-top: 2rem
</style>
