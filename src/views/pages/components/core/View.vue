<template>
  <v-content
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'"
  >
    <v-img
      :class="{
        'v-image--sm': this.$vuetify.breakpoint.smAndDown,
        'v-image--md': this.$vuetify.breakpoint.mdAndDown
      }"
      :src="require(`@/assets/${src || 'clint-mckoy.jpg'}`)"
      gradient="to top, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)"
      min-height="100%"
      height="100vh"
    >
      <v-responsive
        :style="styles"
        min-height="100vh"
        class="d-flex align-center"
      >
        <router-view />
      </v-responsive>
    </v-img>
  </v-content>
</template>

<script>
  export default {
    name: 'PagesCoreView',

    data: () => ({
      srcs: {
        '/lock': 'lock.jpg',
        '/login': 'login.jpg',
        '/pricing': 'pricing.jpg',
        '/register': 'register.jpg',
      },
    }),

    computed: {
      src () {
        return this.srcs[this.$route.path]
      },
      styles () {
        const paddingTop = this.$vuetify.breakpoint.mdAndUp ? 175 : 100
        const paddingBottom = this.$vuetify.breakpoint.mdAndUp ? 175 : 150
        return {
          padding: `${paddingTop}px 0 ${paddingBottom}px 0`,
        }
      },
    },
  }
</script>
