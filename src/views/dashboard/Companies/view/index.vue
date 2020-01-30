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
      <v-col>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-card
              v-on="on"
              :class="coverPhoto ? 'success--text' : 'grey--text'"
              class="mx-auto mt-0 d-inline-flex v-card--account"
              outlined
              height="106"
              width="106"
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
                size="96"
              >
                mdi-office-building
              </v-icon>
            </v-card>
          </template>
          <span>Upload/Change Image</span>
        </v-tooltip>
      </v-col>
      <v-col>
        <h5 class="headline">3 ROUND STONES, INC.</h5>
      </v-col>
      <v-col>
        <v-btn>ACTIVE</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {

    data: () => ({
      coverPhoto: null,
      uploading: false,
    }),
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
