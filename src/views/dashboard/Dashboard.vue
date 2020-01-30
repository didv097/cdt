<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <base-material-alert
          color="green"
          dark
          dismissible
          icon="mdi-bell"
        >
          Welcome. This is the new CDT system and it is being updated daily.
          If you are coming from the old DJS application you can find everything functional.
        </base-material-alert>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        lg="3"
        v-for="item in cnt"
        :key="item.title"
      >
        <base-material-stats-card
          :color="item.color"
          :icon="item.icon"
          :title="item.title"
          :value="'+'+item.value"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        />
      </v-col>
      <v-col cols="12">
        <base-material-chart-card
          :data="systemHeartbeat"
          color="green"
          type="Line"
        ></base-material-chart-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        cnt: [
          {
            title: 'Companies',
            value: 3731,
            color: 'cyan',
            icon: 'mdi-office-building',
          },
          {
            title: 'Individuals',
            value: 4572,
            color: 'red',
            icon: 'mdi-account-group',
          },
          {
            title: 'Vessels',
            value: 18771,
            color: 'green',
            icon: 'mdi-ferry',
          },
          {
            title: 'Fleets',
            value: 8,
            color: 'purple',
            icon: 'mdi-anchor',
          },
        ],
        systemHeartbeat: {

        },
      }
    },

    computed: {
    },

    methods: {
    },
  }
</script>
