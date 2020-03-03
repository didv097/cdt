<template>
  <v-app>
    <pages-core-view />
    <pages-core-footer />
  </v-app>
</template>

<script>
  export default {
    name: 'PagesIndex',

    components: {
      PagesCoreView: () => import('./components/core/View'),
      PagesCoreFooter: () => import('./components/core/Footer'),
    },

    created () {
      this.$vuetify.theme.dark = true
    },

    beforeDestroy () {
      this.$vuetify.theme.dark = false
    },
  }
</script>
