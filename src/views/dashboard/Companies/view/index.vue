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
      <v-col md="auto">
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
                mdi-office-building
              </v-icon>
            </v-card>
          </template>
          <span>Upload/Change Image</span>
        </v-tooltip>
      </v-col>
      <v-col md="auto">
        <h3 class="display-2">
          3 ROUND STONES, INC.
        </h3>
      </v-col>
      <v-col md="auto">
        <v-btn
          color="green"
          small
        >
          ACTIVE
        </v-btn>
      </v-col>
    </v-row>
    <base-material-tabs
      v-model="activeTab"
      background-color="transparent"
      centered
      color="orange"
      icons-and-text
    >
      <v-tab
        v-for="(t, i) in tabs"
        :key="i"
      >
        {{ t.title }}
        <v-icon v-text="t.icon" />
      </v-tab>
    </base-material-tabs>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      coverPhoto: null,
      uploading: false,
      activeTab: 0,
      tabs: [],
    }),
    mounted () {
      this.tabs = [
        {
          title: 'Info',
          icon: 'mdi-information',
          to: '/home/companies/view/' + this.$route.params.id + '/info',
        },
        {
          title: 'Addresses',
          icon: 'mdi-map-marker',
          to: '/home/companies/view/' + this.$route.params.id + '/addresses',
        },
        {
          title: 'Plan Holder',
          icon: 'mdi-lan',
          to: '/home/companies/view/' + this.$route.params.id + '/plan',
        },
        {
          title: 'SMFF Capabilities',
          icon: 'mdi-hard-hat',
          to: '/home/companies/view/' + this.$route.params.id + '/smff',
        },
        {
          title: 'Operated Companies',
          icon: 'mdi-office-building',
          to: '/home/companies/view/' + this.$route.params.id + '/companies',
        },
        {
          title: 'Individuals',
          icon: 'mdi-account-tie',
          to: '/home/companies/view/' + this.$route.params.id + '/individuals',
        },
        {
          title: 'Documents',
          icon: 'mdi-file',
          to: '/home/companies/view/' + this.$route.params.id + '/documents',
        },
        {
          title: 'Vessels',
          icon: 'mdi-ferry',
          to: '/home/companies/view/' + this.$route.params.id + '/vessels',
        },
      ]
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
          }
        ).then(res => {
          this.getCover()
          this.uploading = false
        }).catch(error => {
          if (error.response && error.response.data) {
            console.log(error.response.data.message)
          }
          this.uploading = false
        })
      },
    },
  }
</script>
