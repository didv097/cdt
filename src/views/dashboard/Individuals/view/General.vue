<template>
  <v-container>
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
            sm="4"
          >
            <v-text-field
              v-model="user.title"
              label="Title"
              prepend-icon="mdi-account"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              v-model="user.first_name"
              label="First Name"
              prepend-icon="mdi-account"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              v-model="user.last_name"
              label="Last Name"
              prepend-icon="mdi-account"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.suffix"
              label="Suffix"
              prepend-icon="mdi-account"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.mobile_number"
              label="Mobile Number"
              prepend-icon="mdi-cellphone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.occupation"
              label="Occupation"
              prepend-icon="mdi-briefcase"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="user.role_ids"
              :items="roleItems"
              item-text="name"
              item-value="id"
              label="User Roles"
              prepend-icon="mdi-briefcase"
              multiple
              clearable
              hide-details
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="user.company"
              :items="companyItems"
              item-text="name"
              item-value="id"
              label="Company"
              prepend-icon="mdi-domain"
              clearable
              hide-details
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.resume_link"
              label="Resume Link"
              prepend-icon="mdi-file-account"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="user.description"
              :label="`About ${user.first_name} ${user.last_name}`"
              prepend-icon="mdi-information"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.username"
              label="User Name *"
              prepend-icon="mdi-account"
              :rules="[v => !!v || 'User Name is required']"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.email"
              label="E-mail *"
              prepend-icon="mdi-email"
              :rules="[ v => !!v || 'E-mail is required', v => /.+@.+/.test(v) || 'E-mail is invalid' ]"
            />
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          @click="saveUser"
        >
          Save
        </v-btn>
        <v-btn
          color="error"
          @click="deleteUser"
        >
          Delete User
        </v-btn>
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
  import { snackBar } from '@/mixins/snackBar'

  export default {
    mixins: [snackBar],
    data: () => ({
      loading: false,
      user: {},
      roleItems: [],
      companyItems: [],
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('roles')
          .then(res => {
            this.roleItems = res.data.data
          })
        axios.get('companies/short')
          .then(res => {
            this.companyItems = res.data.data
          })
        axios.get('users/' + this.$route.params.id)
          .then(res => {
            this.user = res.data.data[0]
            this.loading = false
          })
      },
      saveUser () {
        axios.post('users/' + this.$route.params.id, {
          user: this.user,
        })
          .then(res => {
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
          })
          .catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar(error.response.data.message || error.response.status, 'success')
            }
          })
      },
      deleteUser () {
        this.$confirm(`You are about to delete the individual: <b>${this.user.first_name} ${this.user.last_name}</b>`, {
          title: 'Warning',
        }).then(res => {
          if (res) {
            axios.delete('users/' + this.$route.params.id + '/destroy')
              .then(res => {
                this.$router.push('/individuals')
                this.showSnackBar(res.data.message, 'success')
              })
          }
        })
      },
    },
  }
</script>
