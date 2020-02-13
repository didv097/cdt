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
      :title="'Company Files / ' + directory.name"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
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
  import { companyFiles } from '@/mixins/companyFiles'
  import { snackBar } from '@/mixins/snackBar'
  import download from 'downloadjs'

  export default {
    mixins: [companyFiles, snackBar],
    data () {
      return {
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
        loading: false,
        uploadingFile: false,
        directory: {},
        files: [],
      }
    },
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    mounted () {
      this.directory = this.getDirFromCode(this.$route.params.code)
      this.getFiles()
    },
    methods: {
      getFiles () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/documents/' + this.directory.code)
          .then(res => {
            this.files = res.data
            this.loading = false
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
      uploadFile (event) {
        this.uploadingFile = true
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.uploadingFile = false
          this.showSnackBar(res.data.message, 'success')
          this.getFiles()
        })
      },
      deleteFile (file) {
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete('companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/' + file.name + '/destroy')
                .then(res => {
                  this.showSnackBar(res.data.message, 'success')
                  this.getFiles()
                })
            }
          })
      },
      downloadFile (file) {
        axios.get('companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/' + file.name + '/download')
          .then(res => {
            this.saveFile(res.data.url, file.name)
            this.showSnackBar(res.data.message, 'success')
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
    },
  }
</script>

<style lang="sass">
  .file-upload
    width: 100%
</style>
