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
          :fixed-tabs="$vuetify.breakpoint.smAndUp"
          show-arrows
          height="36"
        >
          <v-tab>
            Vessel Relationships
          </v-tab>
          <v-tab>
            Dimensions
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
                    :items="$store.state.menuitems.providerItems"
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
                    :items="$store.state.menuitems.sisterVesselItems"
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
                    :items="$store.state.menuitems.childVesselItems"
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
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
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
  .tabs-container
    margin-top: 2rem
</style>
