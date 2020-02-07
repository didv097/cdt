<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Vessel Information"
      :loading="loading"
    >
      <v-card-text>
        test
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
  // import axios from 'axios'

  export default {
    data: () => ({
      loading: false,
      snackbar: false,
      snackbarColor: 'primary',
      snackbarText: '',
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
      },
    },
  }
</script>
