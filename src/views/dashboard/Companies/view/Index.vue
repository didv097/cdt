<template>
  <v-container>
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadPhoto"
    >
    <v-row
      align="center"
      justify="start"
    >
      <v-col cols="auto">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-card
              width="52"
              height="52"
              outlined
              :class="coverPhoto ? 'success--text' : 'grey--text'"
              class="mx-auto mt-0 d-inline-flex v-card--account"
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
      </v-col>
      <v-col cols="auto">
        <h3 class="display-2">
          {{ editedItem.name }}
        </h3>
      </v-col>
      <v-col cols="auto">
        <v-dialog
          v-model="msgBox"
          persistent
          max-width="290"
        >
          <template v-slot:activator="{ on }">
            <v-switch
              v-model="editedItem.active"
              color="success"
              v-on="on"
            />
          </template>
          <v-card>
            <v-card-title class="headline">
              Warning
            </v-card-title>
            <v-card-text>
              <b>{{ editedItem.name }}</b> status will be changed to DJS <b>{{ editedItem.active ? 'Inactive' : 'Active' }}</b>. Are you sure that you want to change this setting?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="toggleStatus"
              >
                Yes
              </v-btn>
              <v-btn
                color="error"
                text
                @click="msgBox = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      coverPhoto: null,
      uploading: false,
      activeTab: 0,
      editedItem: {},
      msgBox: false,
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
            title: 'SMFF Capabilities',
            icon: 'mdi-hard-hat',
            to: '/companies/' + this.$route.params.id + '/smff',
          },
          {
            title: 'Operated Companies',
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
        this.uploading = true
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
          this.uploading = false
        })
      },
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
          })
      },
      toggleStatus () {
        axios.post('companies/' + this.$route.params.id + '/toggleStatus')
          .then(res => {
            this.editedItem.active = !this.editedItem.active
          })
        this.msgBox = false
      },
    },
  }
</script>
