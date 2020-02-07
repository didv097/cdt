<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Individuals"
      :loading="loading"
    >
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
            <td>
              <span
                class="table-link"
                @click="editUser(user.item)"
              >
                {{ user.item.name }}
              </span>
            </td>
            <td>
              <span>{{ user.item.email }}</span>
            </td>
            <td>
              <div
                v-for="role in user.item.roles"
                :key="role"
              >
                {{ role }}
              </div>
            </td>
            <td>
              <v-icon
                v-if="user.item.resource_provider"
                color="success"
                size="30"
              >
                mdi-account
              </v-icon>
              <v-icon
                v-else
                color="error"
                size="30"
              >
                mdi-account-cancel
              </v-icon>
            </td>
            <td>
              <v-icon
                v-if="user.item.active"
                color="success"
                size="30"
              >
                mdi-shield-check
              </v-icon>
              <v-icon
                v-else
                color="error"
                size="30"
              >
                mdi-shield-off
              </v-icon>
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
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Companies',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'E-mail',
          value: 'email',
        },
        {
          text: 'Role',
          value: 'roles',
        },
        {
          text: 'Resource Provider',
          value: 'resource_provider',
        },
        {
          text: 'DJS SMFF Coverage',
          value: 'active',
        },
        {
          text: 'Actions',
          value: 'username',
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
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'primary',
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
            this.snackbarText = res.data.message
            this.snackbar = true
            this.getDataFromApi()
          })
      },
      deleteUser (id) {
        axios.delete('users/' + id + '/destroy')
          .then(res => {
            this.deleteMsg[id] = false
            this.snackbarText = res.data.message
            this.snackbar = true
            this.getDataFromApi()
          })
      },
    },
  }
</script>
