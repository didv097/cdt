<template>
  <v-container>
    <base-material-card
      color="primary"
      icon="mdi-information"
      inline
      :loading="loading"
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Company Information
        </div>
      </template>
      <v-card-text>
        <div class="input-container">
          <h4 class="input-label">
            <v-icon>mdi-office-building</v-icon>
            Name: *
          </h4>
          <v-text-field
            v-model="editedItem.name"
            :readonly="!edit"
            class="input-field"
          />
        </div>
        <v-row>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-file-document-edit</v-icon>
                Plan Number:
              </h4>
              <v-text-field
                v-model="editedItem.plan_number"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-phone</v-icon>
                Phone Number:
              </h4>
              <v-text-field
                v-model="editedItem.phone"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-fax</v-icon>
                Fax:
              </h4>
              <v-text-field
                v-model="editedItem.fax"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-email</v-icon>
                E-mail: *
              </h4>
              <v-text-field
                v-model="editedItem.email"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-file-document-edit</v-icon>
                QI:
              </h4>
              <v-autocomplete
                v-model="editedItem.qi_id"
                :items="qiItems"
                item-text="name"
                item-value="id"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-office-building</v-icon>
                Operating Company:
              </h4>
              <v-autocomplete
                v-model="editedItem.operating_company_id"
                :items="companyItems"
                item-text="name"
                item-value="id"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-web</v-icon>
                Website:
              </h4>
              <v-text-field
                v-model="editedItem.website"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-office-building</v-icon>
                Company POC:
              </h4>
              <v-autocomplete
                v-model="editedItem.company_poc_id"
                :items="pocItems"
                item-text="name"
                item-value="id"
                :readonly="!edit"
                class="input-field"
              />
            </div>
          </v-col>
        </v-row>
        <div class="input-container">
          <h4 class="input-label">
            <v-icon>mdi-information</v-icon>
            About:
          </h4>
          <v-textarea
            v-model="editedItem.description"
            :readonly="!edit"
            class="input-field"
          />
        </div>
        <v-btn
          v-if="edit"
          color="secondary"
          @click="cancelEdit"
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="edit"
          color="success"
          @click="saveEdit"
        >
          Save
        </v-btn>
        <v-btn
          v-else
          color="primary"
          @click="clickEdit"
        >
          Edit
        </v-btn>
        <v-dialog
          v-model="deleteMsg"
          persistent
          max-width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="error"
              dark
              v-on="on"
            >
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              You are about to delete a company
            </v-card-title>
            <v-card-text>
              Please confirm that you would like to delete the following company: <b>{{ editedItem.name }}</b>
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
                @click="deleteCompany"
              >
                Delete Company
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      loading: false,
      editedItem: {},
      qiItems: [],
      companyItems: [],
      pocItems: [],
      edit: false,
      deleteMsg: false,
    }),
    mounted () {
      this.getDataFromApi()
      this.getQIItems()
      this.getCompanyItems()
      this.getPOCItems()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.loading = false
          })
      },
      getQIItems () {
        axios.get('vendors/qi')
          .then(res => {
            this.qiItems = res.data.data
          })
      },
      getCompanyItems () {
        axios.get('companies/short')
          .then(res => {
            this.companyItems = res.data.data
          })
      },
      getPOCItems () {
        axios.get('companies/user/poc')
          .then(res => {
            this.pocItems = res.data.data
          })
      },
      clickEdit () {
        this.edit = true
      },
      cancelEdit () {
        this.edit = false
      },
      saveEdit () {
        axios.post('companies/' + this.$route.params.id, this.editedItem)
          .then(res => {
            console.log(res)
            this.getDataFromApi()
            this.edit = false
          })
          .catch(error => {
            if (error.response && error.response.data) {
              console.error(error.response.data.message)
            }
            this.edit = false
          })
      },
      deleteCompany () {
        axios.delete('companies/' + this.editedItem.id + '/destroy')
          .then(res => {
            this.$router.push('/companies')
          })
        this.deleteMsg = false
      },
    },
  }
</script>

<style lang="sass">
  .input-container
    margin-top: 1rem
  .input-label
    font-size: 18px
    font-weight: 300
    color: black
    .v-icon
      font-size: 20px !important
  .input-field
    padding: 0
</style>
