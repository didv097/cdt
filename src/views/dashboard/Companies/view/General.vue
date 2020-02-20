<template>
  <base-material-card
    color="primary"
    title="General Information"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="editedItem.name"
            label="Name: *"
            prepend-icon="mdi-domain"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.plan_number"
            label="Plan Number:"
            prepend-icon="mdi-counter"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.phone"
            label="Phone Number:"
            prepend-icon="mdi-phone"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.fax"
            label="Fax:"
            prepend-icon="mdi-fax"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.email"
            label="E-mail: *"
            prepend-icon="mdi-email"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-autocomplete
            v-model="editedItem.qi_id"
            :items="$store.state.qiItems"
            item-text="name"
            item-value="id"
            label="QI Company:"
            prepend-icon="mdi-clipboard-account"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-autocomplete
            v-model="editedItem.operating_company_id"
            :items="$store.state.companyItems"
            item-text="name"
            item-value="id"
            label="Operating Company:"
            prepend-icon="mdi-domain"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="editedItem.website"
            label="Website:"
            prepend-icon="mdi-web"
            :readonly="!edit"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-autocomplete
            v-model="editedItem.company_poc_id"
            :items="$store.state.pocItems"
            item-text="name"
            item-value="id"
            label="Company POC:"
            prepend-icon="mdi-account-star"
            :readonly="!edit"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="editedItem.description"
            label="About:"
            prepend-icon="mdi-information"
            :readonly="!edit"
            class="input-field"
          />
        </v-col>
      </v-row>
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
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      loading: false,
      editedItem: {},
      edit: false,
    }),
    mounted () {
      this.getDataFromApi()
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
