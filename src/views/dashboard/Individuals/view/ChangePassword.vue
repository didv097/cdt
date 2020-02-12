<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Change Password"
    >
      <v-card-text>
        change password
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
  import { snackBar } from '@/mixins/snackBar'

  export default {
    mixins: [snackBar],
    data: () => ({
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
