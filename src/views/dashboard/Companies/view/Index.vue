<template>
  <v-container>
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadPhoto"
    >
    <div
      class="detail-header"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-card
            width="52"
            height="52"
            outlined
            class="detail-avartar"
            v-on="on"
            @click="$refs.file.click()"
          >
            <v-img
              v-if="coverPhoto"
              :src="coverPhoto"
              height="100%"
              width="100%"
            />
            <v-icon
              v-else
              class="mx-auto"
              size="48"
            >
              mdi-domain
            </v-icon>
          </v-card>
        </template>
        <span>Upload/Change Image</span>
      </v-tooltip>
      <h3 class="display-2">
        {{ editedItem.name }}
      </h3>
      <div class="detail-status">
        <v-badge
          bottom
          bordered
          overlap
          color="orange"
          :value="smff"
        >
          <template v-slot:badge>
            <v-icon dark>
              mdi-star
            </v-icon>
          </template>
          <span>
            <v-icon
              v-if="editedItem.active"
              color="success"
              size="30"
            >
              mdi-shield-check
            </v-icon>
            <v-icon
              v-else
              color="error"
              size="30"
            >
              mdi-shield-off
            </v-icon>
          </span>
        </v-badge>
        <v-switch
          v-model="switchActive"
          label="Coverage Active"
          @click.stop="toggleStatus"
        />
        <v-switch
          v-model="switchSMFF"
          label="SMFF Services"
          @click.stop="toggleSMFF"
        />
      </div>
    </div>
    <base-material-tabs
      v-model="activeTab"
      background-color="transparent"
      centered
      color="secondary"
      icons-and-text
      show-arrows
    >
      <v-tab
        v-for="(tab, i) in tabs"
        :key="i"
        :to="tab.to"
      >
        {{ tab.title }}
        <v-icon v-text="tab.icon" />
      </v-tab>
    </base-material-tabs>
    <router-view />
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
      coverPhoto: null,
      activeTab: 0,
      editedItem: {},
      msgBox: false,
      smff: null,
      switchActive: false,
      switchSMFF: false,
      snackbar: false,
      snackbarColor: 'primary',
      snackbarText: '',
    }),
    computed: {
      tabs () {
        return [
          {
            title: 'Information',
            icon: 'mdi-information',
            to: '/companies/' + this.$route.params.id + '/info',
          },
          {
            title: 'Addresses',
            icon: 'mdi-map-marker',
            to: '/companies/' + this.$route.params.id + '/addresses',
          },
          {
            title: 'Plan Holder',
            icon: 'mdi-lan',
            to: '/companies/' + this.$route.params.id + '/plan',
          },
          {
            title: 'Capabilities',
            icon: 'mdi-pier-crane',
            to: '/companies/' + this.$route.params.id + '/smff',
          },
          {
            title: 'Affiliates',
            icon: 'mdi-domain',
            to: '/companies/' + this.$route.params.id + '/companies',
          },
          {
            title: 'Individuals',
            icon: 'mdi-account-tie',
            to: '/companies/' + this.$route.params.id + '/individuals',
          },
          {
            title: 'Documents',
            icon: 'mdi-file',
            to: '/companies/' + this.$route.params.id + '/documents',
          },
          {
            title: 'Vessels',
            icon: 'mdi-ferry',
            to: '/companies/' + this.$route.params.id + '/vessels',
          },
        ]
      },
    },
    watch: {
      $route (to, from) {
        // react to route changes...
        this.getDataFromApi()
        this.getCover()
      },
    },
    mounted () {
      this.getDataFromApi()
      this.getCover()
    },
    methods: {
      getCover () {
        axios.get('companies/' + this.$route.params.id + '/getPhoto')
          .then(res => {
            if (res.data) {
              this.coverPhoto = res.data + '?' + Math.random().toString(36).substring(7)
            }
          })
      },
      uploadPhoto (event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'companies/' + this.$route.params.id + '/setPhoto',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.getCover()
        })
      },
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.switchActive = this.editedItem.active
          })
        axios.get('companies/' + this.$route.params.id + '/smff')
          .then(res => {
            this.smff = res.data.smff
            this.switchSMFF = this.smff
          })
      },
      toggleStatus () {
        axios.post('companies/' + this.$route.params.id + '/toggleStatus')
          .then(res => {
            this.snackbar = true
            this.snackbarText = res.data.message
            this.getDataFromApi()
          })
      },
      toggleSMFF () {
        if (this.smff) {
          this.loading = true
          axios.delete('companies/' + this.$route.params.id + '/smff')
            .then(res => {
              this.snackbar = true
              this.snackbarText = res.data.message
              this.getDataFromApi()
            })
        } else {
          axios.post('companies/' + this.$route.params.id + '/smff/create')
            .then(res => {
              this.snackbar = true
              this.snackbarText = res.data.message
              this.getDataFromApi()
            })
        }
      },
    },
  }
</script>
