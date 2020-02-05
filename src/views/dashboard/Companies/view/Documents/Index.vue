<template>
  <v-container>
    <base-material-card
      color="primary"
      icon="mdi-file"
      inline
      :loading="loading"
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Company Files
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
        :items="searchResult"
      >
        <template v-slot:item="dir">
          <tr>
            <td>
              <router-link
                class="table-link"
                :to="dir.item.to"
              >
                {{ dir.item.name }}
              </router-link>
            </td>
            <td>
              {{ dir.item.count }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import Fuse from 'fuse.js'

  export default {
    data () {
      return {
        search: '',
        headers: [
          {
            text: 'Document Name',
            value: 'name',
          },
          {
            text: 'Count',
            value: 'count',
          },
        ],
        directories: [
          {
            name: 'Group V Consent Letter',
            code: 'group-v-consent-letter',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/group-v-consent-letter',
            count: 0,
          },
          {
            name: 'Letter of Intent - Non Tank Vessels below 250 bbls',
            code: 'letter-of-intent-non-tank-vessels-below-250-bbls',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/letter-of-intent-non-tank-vessels-below-250-bbls',
            count: 0,
          },
          {
            name: 'Letter of Intent - Non Tank Vessels',
            code: 'letter-of-intent-non-tank-vessels',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/letter-of-intent-non-tank-vessels',
            count: 0,
          },
          {
            name: 'SMFF Coverage Certification',
            code: 'smff-coverage-certification',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/smff-coverage-certification',
            count: 0,
          },
          {
            name: 'Damage Stability Coverage Certification',
            code: 'damage-stability-coverage-certification',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/damage-stability-coverage-certification',
            count: 0,
          },
          {
            name: 'Non-Tank SMFF Annex',
            code: 'nt-smff-annex',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/nt-smff-annex',
            count: 0,
          },
          {
            name: 'Tank SMFF Annex',
            code: 'tank-smff-annex',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/tank-smff-annex',
            count: 0,
          },
          {
            name: 'Combined SMFF Annex',
            code: 'combined-smff-annex',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/combined-smff-annex',
            count: 0,
          },
          {
            name: 'SCHEDULE A Non-Tank',
            code: 'schedule-a-non-tank',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/schedule-a-non-tank',
            count: 0,
          },
          {
            name: 'SCHEDULE A Tanker',
            code: 'schedule-a-tanker',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/schedule-a-tanker',
            count: 0,
          },
          {
            name: 'SCHEDULE A Combined',
            code: 'schedule-a-combined',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/schedule-a-combined',
            count: 0,
          },
          {
            name: 'Written Consent Form - Tank',
            code: 'written-consent-form-tank',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/written-consent-form-tank',
            count: 0,
          },
          {
            name: 'Written Consent Form',
            code: 'written-consent-form',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/written-consent-form',
            count: 0,
          },
          {
            name: 'Multiple Vessels Pre-fire Plan Certification',
            code: 'multiple-vessels-pre-fire-plan-certification',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/multiple-vessels-pre-fire-plan-certification',
            count: 0,
          },
          {
            name: 'Single Vessel Pre-fire Plan Certification',
            code: 'single-vessel-pre-fire-plan-certification',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/single-vessel-pre-fire-plan-certification',
            count: 0,
          },
          {
            name: 'AA-Vessel Specific Page',
            code: 'aa-vessel-specific',
            to: '/home/companies/' + this.$route.params.id + '/documents/generated-doc/aa-vessel-specific',
            count: 0,
          },
          {
            name: 'OPA-90 Client Contract',
            code: 'contracts',
            to: '/home/companies/' + this.$route.params.id + '/documents/contracts',
            count: 0,
          },
          {
            name: 'OPA-90 Response Asset Agreement',
            code: 'opa-90-response-asset-agreement',
            to: '/home/companies/' + this.$route.params.id + '/documents/opa-90-response-asset-agreement',
            count: 0,
          },
          {
            name: 'NASA Response Asset Agreement',
            code: 'nasa-response-asset-agreement',
            to: '/home/companies/' + this.$route.params.id + '/documents/nasa-response-asset-agreement',
            count: 0,
          },
          {
            name: 'Damage Stability Certificates',
            code: 'damage-stability-certificates',
            to: '/home/companies/' + this.$route.params.id + '/documents/damage-stability-certificates',
            count: 0,
          },
          {
            name: 'Shipboard Spill Mitigation Procedures',
            code: 'shipboard-spill-mitigation-procedures',
            to: '/home/companies/' + this.$route.params.id + '/documents/shipboard-spill-mitigation-procedures',
            count: 0,
          },
        ],
        total: 0,
        loading: false,
        fuseSearch: null,
      }
    },
    computed: {
      computedHeaders () {
        return this.headers
      },
      searchResult: function () {
        return this.fuseSearch && this.search.length > 0 ? this.fuseSearch.search(this.search) : this.directories
      },
    },
    mounted () {
      this.getDataFromApi()
      this.fuseSearch = new Fuse(this.directories, {
        keys: ['name', 'count'],
        threshold: 0.5,
      })
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/documents/count')
          .then(res => {
            Object.keys(res.data).forEach((key, index) => {
              this.directories.find(directory => directory.code === key).count = res.data[key].count
            })
            this.loading = false
          })
      },
    },
  }
</script>
