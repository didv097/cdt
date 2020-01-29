<template>
  <v-container
    id="individuals"
    tag="section"
  >
    <base-material-card
      color="green"
      icon="mdi-account-group"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Individuals
        </div>
      </template>

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
        :items="individuals"
        :options.sync="options"
      >
        <template v-slot:item="individual">
          <tr>
            <td>
              <v-badge right slot="activator" :color="individual.item.response===1 ? 'green' : 'red'">
                <template v-slot:badge>
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon dark v-on="on">
                        {{ individual.item.response===1 ? 'mdi-account-badge' : 'mdi-account-badge-alert' }}
                      </v-icon>
                    </template>
                  </v-tooltip>

                </template>
                <router-link :to="'/individuals/view/' + individual.item.id">
                  {{ individual.item.first_name + ' ' + individual.item.last_name }}
                </router-link>
              </v-badge>
            </td>
            <td>
              <router-link :to="'/individuals/view/' + individual.item.id">
                {{ individual.item.first_name + ' ' + individual.item.last_name }}
              </router-link>
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
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Individuals',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Company',
          value: 'company'
        },
        {
          text: 'Email',
          value: 'email'
        },
        {
          text: 'Mobile Number',
          value: 'mobile_number'
        },
      ],
      individuals: [],
      options: {}
    }),
    computed: {
      computedHeaders () {
        return this.headers
      },
    },
    async mounted () {
      await this.getDataFromApi()
    },
    methods: {
      async getDataFromApi () {
        this.individuals = [
          {
            'id': 4640,
            'first_name': 'hgjkhkjhk',
            'last_name': 'gfjgf',
            'name': 'hgjkhkjhk gfjgf',
            'email': 'dfgdfgf@gmail.com',
            'mobile_number': '54546456',
            'username': 'nlkdjflkgj',
            'roles_ids': [2, 3, 4, 6],
            'roles': ['User', 'QI Company', 'Coast Guard', 'NASA User'],
            'resource_provider': false,
            'active': true,
            'company': {
              'id': 4971,
              'name': 'vxcvcxvvxc',
              'active': 0
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4639,
            'first_name': 'hkjhkjhkj',
            'last_name': 'nhhjlkjlk',
            'name': 'hkjhkjhkj nhhjlkjlk',
            'email': 'bkhkjh@gmail.com',
            'mobile_number': '456465',
            'username': 'bkhkjh@gmail.com',
            'roles_ids': [1, 2, 3, 4, 5, 6],
            'roles': ['Administrator', 'User', 'QI Company', 'Coast Guard', 'Duty Team', 'NASA User'],
            'resource_provider': true,
            'active': true,
            'company': {
              'id': 4969,
              'name': 'Udaan tech1',
              'active': 1
            },
            'coverage': 0,
            'response': 1
          }, {
            'id': 4638,
            'first_name': 'safsf',
            'last_name': 'asfsa',
            'name': 'safsf asfsa',
            'email': 'jklfgjjflkjlk@gmail.com',
            'mobile_number': '4564544',
            'username': 'assaf@gmail.com',
            'roles_ids': [2, 4, 6],
            'roles': ['User', 'Coast Guard', 'NASA User'],
            'resource_provider': false,
            'active': true,
            'company': {
              'id': 4352,
              'name': 'SOMPO Japan Insurance, Inc',
              'active': 1
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4637,
            'first_name': 'dcxgds',
            'last_name': 'dsgds',
            'name': 'dcxgds dsgds',
            'email': 'ns@gmail.com',
            'mobile_number': '54564464',
            'username': 'ns@gmail.com',
            'roles_ids': [1, 2, 4],
            'roles': ['Administrator', 'User', 'Coast Guard'],
            'resource_provider': false,
            'active': true,
            'company': {
              'id': 4352,
              'name': 'SOMPO Japan Insurance, Inc',
              'active': 1
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4636,
            'first_name': 'sfsafs',
            'last_name': 'asffsaf',
            'name': 'sfsafs asffsaf',
            'email': 'sffsfssfas@gmail.com',
            'mobile_number': '564564546',
            'username': 'steven.newess@gmail.com',
            'roles_ids': [1, 2, 4],
            'roles': ['Administrator', 'User', 'Coast Guard'],
            'resource_provider': false,
            'active': false,
            'company': {
              'id': 4969,
              'name': 'Udaan tech1',
              'active': 1
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4635,
            'first_name': 'A',
            'last_name': 'Tester',
            'name': 'A Tester',
            'email': 'atester@gmail.com',
            'mobile_number': '1111521526',
            'username': 'atester@gmail.com',
            'roles_ids': [3],
            'roles': ['QI Company'],
            'resource_provider': false,
            'active': true,
            'company': {
              'id': 4897,
              'name': 'Gallagher',
              'active': 1
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4634,
            'first_name': 'steven newes',
            'last_name': 'newes',
            'name': 'steven newes newes',
            'email': 'steven.newes@gmail.com',
            'mobile_number': '545445',
            'username': 'steven.newes@gmail.com',
            'roles_ids': [2, 3, 4],
            'roles': ['User', 'QI Company', 'Coast Guard'],
            'resource_provider': false,
            'active': true,
            'company': {
              'id': 4970,
              'name': 'Accentt',
              'active': 1
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4633,
            'first_name': 'test',
            'last_name': 'user',
            'name': 'test user',
            'email': 'test@mail.com',
            'mobile_number': '1212121212',
            'username': null,
            'roles_ids': [3, 4, 5],
            'roles': ['QI Company', 'Coast Guard', 'Duty Team'],
            'resource_provider': true,
            'active': true,
            'company': {
              'id': -1,
              'name': ' - ',
              'active': false
            },
            'coverage': 0,
            'response': 1
          }, {
            'id': 4632,
            'first_name': 'Sakshi',
            'last_name': 'Gupta',
            'name': 'Sakshi Gupta',
            'email': 'test1@gmail.com',
            'mobile_number': '7073530909',
            'username': 'tester1',
            'roles_ids': [2],
            'roles': ['User'],
            'resource_provider': false,
            'active': true,
            'company': {
              'id': 4966,
              'name': 'Webenture Tech1',
              'active': 1
            },
            'coverage': 0,
            'response': 0
          }, {
            'id': 4629,
            'first_name': 'test',
            'last_name': 'individuals',
            'name': 'test individuals',
            'email': 'sfsfsfsf@gmail.com',
            'mobile_number': '54545',
            'username': 'testadmin',
            'roles_ids': [2, 3, 4],
            'roles': ['User', 'QI Company', 'Coast Guard'],
            'resource_provider': true,
            'active': true,
            'company': {
              'id': -1,
              'name': ' - ',
              'active': false
            },
            'coverage': 0,
            'response': 1
          }
        ]
      },
    },
  }
</script>
