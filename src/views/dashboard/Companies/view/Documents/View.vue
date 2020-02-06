<template>
  <v-container>
    <base-material-card
      color="primary"
      icon="mdi-file"
      inline
      :loading="loading"
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Company Files / {{ directory.name }}
        </div>
      </template>
      <v-file-input>asf</v-file-input>
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
    },
  }
</script>

<style lang="sass">
.doc-expansion-header
  font-size: 16px !important
.v-expansion-panel-content
  padding-left: 20px
</style>
