<template>
  <v-container>

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
