<template>
  <v-container>
    <base-material-card
      color="green"
      icon="mdi-information"
      inline
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
            readonly="readonly"
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
                readonly="readonly"
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
                readonly="readonly"
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
                v-model="editedItem.plan_number"
                readonly="readonly"
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
                readonly="readonly"
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
              <v-text-field
                v-model="editedItem.qi_id"
                readonly="readonly"
                class="input-field"
              />
            </div>
          </v-col>
          <v-col>
            <div class="input-container">
              <h4 class="input-label">
                <v-icon>mdi-phone</v-icon>
                Operating Company:
              </h4>
              <v-text-field
                v-model="editedItem.operating_company_id"
                readonly="readonly"
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
                readonly="readonly"
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
              <v-text-field
                v-model="editedItem.company_poc_id"
                readonly="readonly"
                class="input-field"
              />
            </div>
          </v-col>
        </v-row>
        <div class="input-container">
          <h4 class="input-label">
            <v-icon>mdi-info</v-icon>
            About:
          </h4>
          <v-textarea
            v-model="editedItem.description"
            readonly="readonly"
            class="input-field"
          />
        </div>
        <v-btn
          color="green"
        >
          EDIT
        </v-btn>
        <v-btn
          color="red"
        >
          DELETE
        </v-btn>
      </v-card-text>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      standBy: false,
      editedItem: {},
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.standBy = true
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.standBy = false
            console.log(this.editedItem)
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
