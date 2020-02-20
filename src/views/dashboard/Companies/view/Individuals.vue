<template>
  <base-material-card
    color="primary"
    title="Individuals"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      class="ml-auto"
      label="Search"
      hide-details
      single-line
      style="max-width: 250px;"
    />

    <v-divider class="mt-3" />

    <v-data-table
      :headers="computedHeaders"
      :items="users"
      :options.sync="options"
      :server-items-length="total"
    >
      <template v-slot:item="user">
        <tr>
          <td class="pl-5">
            <v-badge
              slot="activator"
              left
              :color="user.item.response===1 ? 'success' : 'error'"
            >
              <template v-slot:badge>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      dark
                      v-on="on"
                    >
                      {{ user.item.response===1 ? 'mdi-account-badge' : 'mdi-account-badge-alert' }}
                    </v-icon>
                  </template>
                  {{ user.item.response===1 ? 'Responder' : 'No Responder' }}
                </v-tooltip>
              </template>
              <router-link
                class="table-link"
                :to="'/individuals/' + user.item.id"
              >
                {{ user.item.name }}
              </router-link>
            </v-badge>
          </td>
          <td>
            <router-link
              v-if="user.item.company.id >= 0"
              class="table-link"
              :to="'/companies/' + user.item.company.id"
            >
              {{ user.item.company.name }}
            </router-link>
            <span v-else>
              {{ user.item.company.name }}
            </span>
          </td>
          <td>
            {{ user.item.email }}
          </td>
          <td>
            {{ user.item.mobile_number }}
          </td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="primary"
                  :to="'/individuals/'+user.item.id"
                  v-on="on"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>View Detail</span>
            </v-tooltip>
            <v-dialog
              v-model="deleteMsg[user.item.id]"
              persistent
              max-width="600"
            >
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      color="error"
                      icon
                      v-on="{ ...tooltip, ...dialog }"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </template>
              <v-card>
                <v-card-title class="headline">
                  You are about to delete or unlink an individual
                </v-card-title>
                <v-card-text>
                  Please confirm that you would like to delete or unlink the following individual: <b>{{ user.item.name }}</b>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="warning"
                    text
                    @click="removeLink(user.item.id)"
                  >
                    Remove Link
                  </v-btn>
                  <v-btn
                    color="error"
                    text
                    @click="deleteUser(user.item.id)"
                  >
                    Delete Individual
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="deleteMsg[user.item.id] = false"
                  >
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </template>
    </v-data-table>
    <base-material-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      right
      :type="null"
    >
      {{ snackbarText }}
    </base-material-snackbar>
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { snackBar } from '@/mixins/snackBar'

  export default {
    mixins: [snackBar],
    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Company',
          value: 'company',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Mobile Number',
          value: 'mobile_number',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      users: [],
      loading: false,
      options: {},
      staticSearch: {
        active: -1,
        companies: [],
        roles: [],
        resource_provider: -1,
      },
      total: 0,
      searchTimeout: null,
      deleteMsg: {},
    }),
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
      search () {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.getDataFromApi()
        }, 500)
      },
    },
    async mounted () {
      this.staticSearch.companies = [this.$route.params.id]
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        this.loading = true
        // get by search keyword
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`users-filter?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.users = res.data.data
            this.total = res.data.meta.total
          }
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`users-order?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.users = res.data.data
            this.total = res.data.meta.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`users?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.users = res.data.data
            this.total = res.data.meta.total
          }
        } catch (error) {
          // console.error(error)
        }
        this.loading = false
      },
      removeLink (id) {
        axios.get('companies/' + id + '/unlinkUsers')
          .then(res => {
            this.deleteMsg[id] = false
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
          })
      },
      deleteUser (id) {
        axios.delete('users/' + id + '/destroy')
          .then(res => {
            this.deleteMsg[id] = false
            this.showSnackBar(res.data.message, 'success')
            this.getDataFromApi()
          })
      },
    },
  }
</script>
