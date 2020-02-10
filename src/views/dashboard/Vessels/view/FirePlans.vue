<template>
  <v-container>
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadFile"
    >
    <base-material-card
      color="primary"
      title="Fire Plans"
      :loading="loading"
    >
      <v-card-text>
        <v-btn
          color="secondary"
          class="file-upload"
          :loading="uploadingFile"
          @click="$refs.file.click()"
        >
          Upload a file
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="files"
        >
          <template v-slot:item="file">
            <tr>
              <td>
                <v-icon
                  color="secondary"
                  size="24"
                >
                  {{ getIconFromExt(file.item.ext) }}
                </v-icon>
                {{ file.item.name }}
              </td>
              <td>
                {{ file.item.size }}
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      color="primary"
                      v-on="on"
                      @click="downloadFile(file.item)"
                    >
                      <v-icon size="24">
                        mdi-cloud-download
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Download File</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      color="error"
                      v-on="on"
                      @click="deleteFile(file.item)"
                    >
                      <v-icon size="24">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Delete File</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
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
  import download from 'downloadjs'

  export default {
    data: () => ({
      loading: false,
      uploadingFile: false,
      headers: [
        {
          text: 'File Name',
          value: 'name',
        },
        {
          text: 'File Size',
          value: 'size',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      files: [],
      snackbar: false,
      snackbarColor: 'primary',
      snackbarText: '',
    }),
    mounted () {
      this.getFiles()
    },
    methods: {
      getFiles () {
        this.loading = true
        axios.get('vessels/' + this.$route.params.id + '/files/fireplans')
          .then(res => {
            this.files = res.data
            this.loading = false
          })
      },
      uploadFile (event) {
        this.uploadingFile = true
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'vessels/' + this.$route.params.id + '/files/fireplans/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.uploadingFile = false
          this.snackbar = true
          this.snackbarText = res.data.message
          this.getFiles()
        })
      },
      getIconFromExt (ext) {
        if (ext === 'pdf') {
          return 'mdi-file-pdf'
        } else if (ext === 'docx') {
          return 'mdi-file-document'
        } else if (ext === 'png') {
          return 'mdi-file-image'
        }
        return 'mdi-file'
      },
      downloadFile (file) {
        axios.get('vessels/' + this.$route.params.id + '/files/fireplans/' + file.name + '/download')
          .then(res => {
            this.saveFile(res.data.url, file.name)
            this.snackbar = true
            this.snackbarText = res.data.message
          })
      },
      saveFile (s3link, name) {
        axios({
          url: s3link,
          method: 'GET',
          responseType: 'blob',
          timeout: 30000,
          transformRequest: [(data, headers) => {
            delete headers.common.Authorization
            return data
          }],
        })
          .then(downloadRes => {
            download(downloadRes.data, name)
          })
      },
      deleteFile (file) {
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, {
          title: 'Warning',
        }).then(res => {
          if (res) {
            axios.delete('vessels/' + this.$route.params.id + '/files/fireplans/' + file.name + '/destroy')
              .then(res => {
                this.getFiles()
                this.snackbar = true
                this.snackbarText = res.data.message
              })
          }
        })
      },
    },
  }
</script>

<style lang="sass">
  .file-upload
    width: 100%
</style>
