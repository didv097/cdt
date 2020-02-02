<template>
  <v-container>
    <base-material-card
      color="green"
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
        <v-checkbox v-model="checkbox" label="asdf" />
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Network Membership
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="smff-item">
                <label class="smff-label">OPA-90 Response Asset</label>
                <v-checkbox
                  class="smff-input"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Primary SMFF Service
            </v-expansion-panel-header>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Salvage Service
            </v-expansion-panel-header>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Marine firefighting
            </v-expansion-panel-header>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Additional Capabilities and Details
            </v-expansion-panel-header>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Notes
            </v-expansion-panel-header>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </base-material-card>
    <base-material-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      right
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
      snackbarColor: 'blue',
      snackbarText: 'snackbar',
      loading: false,
      networks: [],
      smff: {},
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
    },
  }
</script>
