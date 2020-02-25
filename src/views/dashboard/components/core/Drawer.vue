<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-break-point="960"
    app
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-list-item>
      <v-list-item-content>
        <div class="logo-mini">
          <v-img src="@/assets/djs-avatar.png" />
        </div>
        <div class="logo-normal">
          <router-link to="/">
            <v-img src="@/assets/djs-logo.png" />
          </router-link>
        </div>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'dashboard',
          to: '/',
        },
        {
          icon: 'mdi-domain',
          title: 'companies',
          to: '/companies',
        },
        {
          icon: 'mdi-ferry',
          title: 'vessels',
          to: '/vessels',
        },
        {
          icon: 'mdi-account-group',
          title: 'individuals',
          to: '/individuals',
        },
        {
          icon: 'mdi-file-document',
          title: 'reports',
          to: '/reports',
        },
        {
          icon: 'mdi-map-search',
          title: 'map',
          to: '/map',
        },
        {
          icon: 'mdi-anchor',
          title: 'fleets',
          to: '/fleets',
        },
        {
          icon: 'mdi-map',
          title: 'gsa',
          to: '/gsa',
        },
      ],
    }),

    computed: {
      ...mapState({
        barColor: state => state.sidebar.barColor,
        barImage: state => state.sidebar.barImage,
      }),
      drawer: {
        get () {
          return this.$store.state.sidebar.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      profile () {
        return {
          avatar: true,
          group: '',
          title: this.$store.state.authentication.user.full_name,
          children: [
            {
              href: '',
              title: this.$t('my-profile'),
            },
            {
              to: '',
              title: this.$t('edit-profile'),
            },
            {
              to: '',
              title: this.$t('settings'),
            },
          ],
        }
      },
    },

    watch: {
      '$vuetify.breakpoint.smAndDown' (val) {
        this.$emit('update:expandOnHover', !val)
      },
    },

    methods: {
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    &.v-navigation-drawer--mini-variant
      .v-list-item
        justify-content: flex-start !important

      .v-list-group--sub-group
        display: block !important

    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
    .logo-normal
      max-width: 60%
      margin: auto
      transition: all 250ms linear
    .logo-mini
      opacity: 0
      max-width: 34px
      height: 34px
      margin: auto
      overflow: hidden
      border-radius: 50%
      position: absolute
      transition: all 250ms linear

  .v-navigation-drawer--mini-variant
    .logo-normal
      opacity: 0 !important
      position: absolute
    .logo-mini
      opacity: 1 !important
      position: initial !important
</style>
