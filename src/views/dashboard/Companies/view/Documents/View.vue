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
      icon="mdi-file"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Company Files / {{ directory.name }}
        </div>
      </template>
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
        :loading="loading"
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
                    @click="fileToDelete = file.item.name, deleteMsg = true"
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
    <v-dialog
      v-model="deleteMsg"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          You are about to delete a file
        </v-card-title>
        <v-card-text>
          Please confirm that you would like to delete the following file: <b>{{ fileToDelete }}</b>
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
            @click="deleteFile"
          >
            Delete File
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

  export default {
    mixins: [companyFiles],
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
        fileToDelete: '',
        deleteMsg: false,
        snackbar: false,
        snackbarColor: 'primary',
        snackbarText: '',
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
            console.log(this.files)
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
          this.getFiles()
        })
      },
      deleteFile () {
        axios.delete('companies/' + this.$route.params.id + '/documents/' + this.directory.code + '/' + this.fileToDelete + '/destroy')
          .then(res => {
            this.snackbar = true
            this.snackbarText = res.data.message
            this.getFiles()
          })
        this.deleteMsg = false
      },
    },
  }
</script>

<style lang="sass">
.file-upload
  width: 100%
</style>
