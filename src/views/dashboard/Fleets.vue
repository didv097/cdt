<template>
  <v-container
    id="fleets"
    tag="section"
  >
    <base-material-card
      color="green"
      icon="mdi-anchor"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Fleets
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
        :items="fleets"
        :options.sync="options"
      >
        <template v-slot:item="fleet">
          <tr>
            <td>
              <router-link :to="'/fleets/view/' + fleet.item.id">
                {{ fleet.item.name }}
              </router-link>
            </td>
            <td>
              <span>{{ fleet.item.vessels_count }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>

  export default {
    name: 'Fleets',

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Vessels',
          value: 'vessels'
        },
      ],
      fleets: [],
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
      async getDataFromApi() {
        this.fleets = [
          {
            'id':8,
            'name':'Test Fleet',
            'vessels_count':1
          },{
            'id':7,
            'name':'Fleet 1',
            'vessels_count':0
          },{
            'id':6,
            'name':'This is for testing.',
            'vessels_count':0
          },{
            'id':5,
            'name':'Testing',
            'vessels_count':2
          },{
            'id':4,
            'name':';lloluioiouiou',
            'vessels_count':0
          },{
            'id':3,
            'name':'Fleet Test',
            'vessels_count':1
          },{
            'id':2,
            'name':"l;'l;'l;'l;'l';;'l;'ll;l'",
            'vessels_count':0
          },{
            'id':1,
            'name':'Military Sealift Command',
            'vessels_count':1
          }
        ]
      },
    },
  }
</script>
