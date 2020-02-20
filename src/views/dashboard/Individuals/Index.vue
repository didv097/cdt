<template>
  <v-container
    id="individuals"
    tag="section"
  >
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadUserCsv"
    >
    <base-material-card
      color="primary"
      icon="mdi-account-group"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Individuals
        </div>
      </template>

      <v-row align="end">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="ml-auto mr-3"
          label="Search"
          hide-details
          single-line
          style="max-width: 200px;"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              small
              class="mr-2"
              v-on="on"
              @click="advancedSearch = !advancedSearch"
            >
              <v-icon size="28">
                mdi-table-search
              </v-icon>
            </v-btn>
          </template>
          <span>Advanced Search</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="warning"
              small
              class="mr-2"
              v-on="on"
              @click="addDlg.show = true, addDlg.user = Object.assign({}, addDlg.defaultUser)"
            >
              <v-icon size="28">
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Add Individual</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="error"
              small
              class="mr-3"
              v-on="on"
              @click="$refs.file.click()"
            >
              <v-icon size="28">
                mdi-upload
              </v-icon>
            </v-btn>
          </template>
          <span>Upload Individuals</span>
        </v-tooltip>
      </v-row>

      <v-row v-if="advancedSearch">
        <v-col
          cols="12"
          class="display-2"
        >
          Advanced Search
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.active"
            :items="$store.state.statusItems"
            item-text="text"
            item-value="value"
            label="Status"
            prepend-icon="mdi-check"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.resource_provider"
            :items="$store.state.resourceProviderItems"
            item-text="text"
            item-value="value"
            label="Resource Provider"
            prepend-icon="mdi-hard-hat"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.companies"
            :items="$store.state.companyItems"
            item-text="name"
            item-value="id"
            label="Companies"
            prepend-icon="mdi-domain"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.roles"
            :items="$store.state.roleItems"
            item-text="name"
            item-value="id"
            label="Roles"
            prepend-icon="mdi-account-lock"
            multiple
            clearable
          />
        </v-col>
      </v-row>

      <v-divider class="mt-3" />

      <v-data-table
        :headers="computedHeaders"
        :items="individuals"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
      >
        <template v-slot:item="individual">
          <tr>
            <td class="pl-5">
              <v-badge
                slot="activator"
                left
                :color="individual.item.response===1 ? 'success' : 'error'"
              >
                <template v-slot:badge>
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        dark
                        v-on="on"
                      >
                        {{ individual.item.response===1 ? 'mdi-account-badge' : 'mdi-account-badge-alert' }}
                      </v-icon>
                    </template>
                    {{ individual.item.response===1 ? 'Responder' : 'No Responder' }}
                  </v-tooltip>
                </template>
                <router-link
                  class="table-link"
                  :to="'/individuals/' + individual.item.id"
                >
                  {{ individual.item.name }}
                </router-link>
              </v-badge>
            </td>
            <td>
              <router-link
                v-if="individual.item.company.id >= 0"
                class="table-link"
                :to="'/companies/' + individual.item.company.id"
              >
                {{ individual.item.company.name }}
              </router-link>
              <span v-else>
                {{ individual.item.company.name }}
              </span>
            </td>
            <td>
              {{ individual.item.email }}
            </td>
            <td>
              {{ individual.item.mobile_number }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      v-model="addDlg.show"
      max-width="700"
    >
      <validation-observer v-slot="{ valid }">
        <base-material-wizard
          v-model="addDlg.tab"
          :available-steps="availableSteps"
          :items="addDlg.tabs"
          class="mx-auto"
          @click:next="addDlgNextTab(valid)"
          @click:prev="addDlg.tab--"
        >
          <v-tab-item>
            <form>
              <v-row
                class="mx-auto"
                justify="space-around"
              >
                <v-col
                  cols="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Title"
                  >
                    <v-select
                      v-model="addDlg.user.title"
                      :items="['Mr', 'Mrs', 'Ms']"
                      :error-messages="errors"
                      label="Title *"
                      prepend-icon="mdi-account"
                      validate-on-blur
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="First Name"
                  >
                    <v-text-field
                      v-model="addDlg.user.first_name"
                      :error-messages="errors"
                      label="First Name *"
                      prepend-icon="mdi-account"
                      validate-on-blur
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Last Name"
                  >
                    <v-text-field
                      v-model="addDlg.user.last_name"
                      :error-messages="errors"
                      label="Last Name *"
                      prepend-icon="mdi-account"
                      validate-on-blur
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.suffix"
                    label="Suffix"
                    prepend-icon="mdi-account"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="User Name"
                  >
                    <v-text-field
                      v-model="addDlg.user.username"
                      :error-messages="errors"
                      label="User Name *"
                      prepend-icon="mdi-account"
                      validate-on-blur
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    autocomplete="off"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.password_confirmation"
                    label="Confirm Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    autocomplete="off"
                  />
                </v-col>
              </v-row>
            </form>
          </v-tab-item>
          <v-tab-item>
            <form>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.street"
                    label="Street"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.unit"
                    label="Unit"
                    type="number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.city"
                    label="City"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.state"
                    label="State/Province"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.country"
                    label="Country"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.zip"
                    label="Zip"
                    type="number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.homeNumber"
                    label="Home Number"
                    type="number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="addDlg.user.mobileNumber"
                    label="Mobile Number"
                    type="number"
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Email"
                  >
                    <v-text-field
                      v-model="addDlg.user.email"
                      :error-messages="errors"
                      label="Email"
                      type="email"
                      validate-on-blur=""
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </form>
          </v-tab-item>
          <v-tab-item>
            <form>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    v-model="addDlg.user.role"
                    :items="$store.state.roleItems"
                    item-text="name"
                    item-value="id"
                    label="Role"
                    clearable
                    multiple
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    v-model="addDlg.user.company"
                    :items="$store.state.companyItems"
                    item-text="name"
                    item-value="id"
                    label="Company"
                    clearable
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="addDlg.user.occupation"
                    label="Occupation"
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="addDlg.user.comments"
                    label="Comments"
                    multiline
                  />
                </v-col>
              </v-row>
            </form>
          </v-tab-item>
        </base-material-wizard>
      </validation-observer>
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
      ],
      staticSearch: {
        active: -1,
        companies: [],
        roles: [],
        resource_provider: -1,
      },
      individuals: [],
      total: 0,
      options: {},
      loading: false,
      searchTimeout: null,
      advancedSearch: false,
      addDlg: {
        show: false,
        tab: 0,
        tabs: ['Personal', 'Contact', 'Professional'],
        user: {
          image: '',
          first_name: '',
          last_name: '',
          title: '',
          suffix: '',
          username: '',
          password: '',
          password_confirmation: '',
          street: '',
          unit: '',
          city: '',
          state: '',
          country: '',
          zip: '',
          homeNumber: '',
          mobileNumber: '',
          email: '',
          company: '',
          role: [],
          occupation: '',
          resume_cv: '',
          comments: '',
        },
        defaultUser: {
          image: '',
          first_name: '',
          last_name: '',
          title: '',
          suffix: '',
          username: '',
          password: '',
          password_confirmation: '',
          street: '',
          unit: '',
          city: '',
          state: '',
          country: '',
          zip: '',
          homeNumber: '',
          mobileNumber: '',
          email: '',
          company: '',
          role: [],
          occupation: '',
          resume_cv: '',
          comments: '',
        },
      },
    }),
    computed: {
      computedHeaders () {
        return this.headers
      },
      availableSteps () {
        const steps = [0]
        if (this.addDlg.user.first_name &&
          this.addDlg.user.last_name &&
          this.addDlg.user.title &&
          this.addDlg.user.username
        ) {
          steps.push(1)
        }
        if (this.addDlg.user.email) {
          steps.push(2)
        }
        steps.push(3)
        return steps
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
      staticSearch: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
    },
    async mounted () {
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        this.loading = true
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          if (this.search) {
            const res = await axios.post(`users-filter?query=${this.search}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.individuals = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (sortBy[0] && sortBy[0].length > 0 && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(`users-order?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.individuals = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(`users?page=${page}&per_page=${itemsPerPage}`, { staticSearch: this.staticSearch })
            this.individuals = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
        } catch (error) {
          // console.error(error)
        }
        this.loading = false
      },
      addDlgNextTab (valid) {
        if (!valid) return

        if (this.addDlg.tab === this.addDlg.tabs.length - 1) {
          this.addDlg.show = false
          axios.post('users/create', this.addDlg.user)
            .then(res => {
              this.showSnackBar(res.data.message, 'success')
              this.getDataFromApi()
            }).catch(error => {
              this.showSnackBar(error, 'error')
            })
        } else {
          this.addDlg.tab++
        }
      },
      uploadUserCsv (event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'users/upload/bulkCsv',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.showSnackBar(res.data.message, 'success')
          this.getDataFromApi()
        }).catch(error => {
          this.showSnackBar(error.response.statusText, 'error')
          this.getDataFromApi()
        })
      },
    },
  }
</script>
