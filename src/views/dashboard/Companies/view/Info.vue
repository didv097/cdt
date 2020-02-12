<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Company Information"
      :loading="loading"
    >
      <v-card-text>
        <div class="input-container">
          <h4 class="input-label">
            <v-icon>mdi-domain</v-icon>
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
                <v-icon>mdi-counter</v-icon>
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
                <v-icon>mdi-clipboard-account</v-icon>
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
                <v-icon>mdi-domain</v-icon>
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
                <v-icon>mdi-account-star</v-icon>
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
        <v-btn
          color="error"
          @click="deleteCompany"
        >
          Delete
        </v-btn>
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
            this.getDataFromApi()
            this.edit = false
          })
      },
      deleteCompany () {
        this.$confirm(`Please confirm that you would like to delete the following company: <b>${this.editedItem.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete('companies/' + this.editedItem.id + '/destroy')
                .then(res => {
                  this.$router.push('/companies')
                })
            }
          })
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
