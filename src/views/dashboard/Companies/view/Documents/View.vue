<template>
  <div>
    <base-material-card
      color="primary"
      :title="'Company Files / ' + directory.name"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <vue-dropzone
        id="dropzone1"
        ref="dropzone"
        :options="dropOptions"
        :destroy-dropzone="true"
        @vdropzone-success="fileUploaded"
      />
      <v-btn
        v-if="directory.generated"
        color="secondary"
        class="full-width"
        @click="generateDlg=true"
      >
        Generate New Document
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
    <v-dialog
      v-model="generateDlg"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
        >
          New Document
        </v-card-title>
        <v-card-text>
          <v-form
            ref="genDocForm"
            v-model="newDocData.valid"
          >
            <v-text-field
              v-if="directory.code === 'damage-stability-coverage-certification'"
              v-model="newDocData.certificateNumber"
              label="Certificate Number *"
              prepend-icon="mdi-counter"
              required
              :rules="[v => !!v || 'Certificate Number is required']"
            />
            <v-text-field
              v-if="directory.code === 'damage-stability-coverage-certification'"
              v-model="newDocData.certificateRevision"
              label="Certificate Revision *"
              prepend-icon="mdi-counter"
              required
              :rules="[v => !!v || 'Certificate Revision is required']"
            />
            <v-menu
              v-model="newDocData.menu"
              :close-on-content-click="false"
              transition="scroll-y-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="newDocData.dateIssued"
                  label="Issue Date *"
                  prepend-icon="mdi-calendar"
                  readonly
                  required
                  :rules="[v => !!v || 'Issue Date is required']"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="newDocData.dateIssued"
                color="red"
                @input="newDocData.menu = false"
              />
            </v-menu>
            <v-select
              v-if="directory.code === 'multiple-vessels-pre-fire-plan-certification' || directory.code === 'single-vessel-pre-fire-plan-certification'"
              v-model="newDocData.address"
              :items="addressItems"
              item-text="address"
              item-value="id"
              label="Address"
              prepend-icon="mdi-map-marker"
            />
            <v-autocomplete
              v-if="directory.code === 'single-vessel-pre-fire-plan-certification' || directory.code === 'aa-vessel-specific'"
              v-model="newDocData.vessel"
              :items="vesselItems"
              item-text="name"
              item-value="id"
              label="Vessel"
              prepend-icon="mdi-ferry"
              clearable
            />
            <v-autocomplete
              v-if="directory.code === 'nt-smff-annex'"
              v-model="newDocData.qi"
              :items="companyQIItems"
              item-text="name"
              item-value="id"
              label="QI *"
              prepend-icon="mdi-anchor"
              clearable
            />
            <v-autocomplete
              v-if="directory.code === 'nt-smff-annex'"
              v-model="newDocData.dpa"
              :items="dpaItems"
              item-text="name"
              item-value="id"
              label="DPA Contacts"
              prepend-icon="mdi-email"
              multiple
              clearable
            />
            <v-autocomplete
              v-if="directory.code === 'nt-smff-annex'"
              v-model="newDocData.contract"
              :items="contractItems"
              item-text="name"
              item-value="name"
              label="Contract"
              prepend-icon="mdi-file"
              clearable
            />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="generateDlg = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="generateDocument"
          >
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { companyFiles } from '@/mixins/companyFiles'
  import { snackBar } from '@/mixins/snackBar'
  import download from 'downloadjs'
  import vueDropzone from 'vue2-dropzone'

  export default {
    components: { vueDropzone },
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
        directory: {},
        files: [],
        dropOptions: {
          url: `https://cdt-api-dev.httpsolutions.com/api/companies/${this.$route.params.id}/documents/${this.$route.params.code}/upload`,
          headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8zNS4xODQuNzkuMTY5XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNTgwMzA5Nzk4LCJleHAiOjE1ODgxOTM3OTgsIm5iZiI6MTU4MDMwOTc5OCwianRpIjoiTlBXRHRrOEpjRDZQOGkwbSIsInN1YiI6MSwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.ZS2RroktCTAbuo5ReQCg2L0Jl9Jk04yu24-IT8YT7j4' },
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer',
        },
        generateDlg: false,
        newDocData: {
          valid: true,
          menu: false,
          dateIssued: new Date().toISOString().substr(0, 10),
        },
        addressItems: [],
        vesselItems: [],
        companyQIItems: [],
        dpaItems: [],
        contractItems: [],
      }
    },
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    mounted () {
      this.directory = this.getDirFromCode(this.$route.params.code)
      axios.get(`companies/${this.$route.params.id}/shortWithAddress`)
        .then(res => {
          this.addressItems = res.data.data.addresses
        })
      axios.get(`vessels/company/${this.$route.params.id}/index`)
        .then(res => {
          this.vesselItems = res.data.data
        })
      axios.get(`companies/${this.$route.params.id}/qi`)
        .then(res => {
          this.companyQIItems = res.data.data
        })
      axios.get(`companies/${this.$route.params.id}/contacts/dpa`)
        .then(res => {
          this.dpaItems = res.data.data
        })
      axios.get(`companies/${this.$route.params.id}/documents/contracts`)
        .then(res => {
          this.contractItems = res.data
        })
      this.getFiles()
    },
    methods: {
      getFiles () {
        this.loading = true
        axios.get(`companies/${this.$route.params.id}/documents/${this.directory.code}`)
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
      fileUploaded (file, res) {
        this.$refs.dropzone.removeAllFiles()
        this.showSnackBar(res.message, 'success')
        this.getFiles()
      },
      deleteFile (file) {
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete(`companies/${this.$route.params.id}/documents/${this.directory.code}/${file.name}/destroy`)
                .then(res => {
                  this.showSnackBar(res.data.message, 'success')
                  this.getFiles()
                })
            }
          })
      },
      downloadFile (file) {
        axios.get(`companies/${this.$route.params.id}/documents/${this.directory.code}/${file.name}/download`)
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
      generateDocument () {
        this.generateDlg = false
        this.newDocData.name = this.directory.name
        axios.post(`companies/${this.$route.params.id}/documents/${this.directory.code}/generateV2`, this.newDocData)
          .then(res => {
            this.getFiles()
            this.showSnackBar(res.data.message, 'success')
          })
      },
    },
  }
</script>

<style lang="sass">
  .full-width
    width: 100%
  .vue-dropzone
    width: 100%
    height: 100px
    text-align: center
    padding-top: 30px
    border: 1px solid lightgray
    margin-top: 1rem
    margin-bottom: 1rem
    .dz-preview
      display: none
</style>
