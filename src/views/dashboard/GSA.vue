<template>
  <v-container tag="section">
    <v-row>
      <v-col>
        <h3 class="display-2">
          {{ header }}
        </h3>
        <p
          v-for="(paragraph, i) in paragraphs"
          :key="i"
        >
          {{ paragraph }}
        </p>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <base-subheading subheading="ATLANTIC AREA" />

            <v-expansion-panels>
              <v-expansion-panel
                v-for="n in 5"
                :key="n"
              >
                <v-expansion-panel-header>
                  U.S. Coast Guard District #{{ n }}
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <router-link
                    v-for="m in 4"
                    :key="m"
                    to="\"
                  >
                    <p>Sector</p>
                  </router-link>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <base-subheading subheading="PACIFIC AREA" />

            <v-expansion-panels>
              <v-expansion-panel
                v-for="n in 5"
                :key="n"
              >
                <v-expansion-panel-header>
                  U.S. Coast Guard District #{{ n }}
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <router-link
                    v-for="m in 4"
                    :key="m"
                    to="\"
                  >
                    <p>Sector</p>
                  </router-link>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: 'GSA',

    data: () => ({
      header: 'Geographic Specific Annexes',
      paragraphs: [
        "DONJON-SMIT's geographic specific annexes, incorporated by reference into vessel response plans, can be downloaded here.",
        'The USCG has determined that incorporating resource listings for contracted SMFF services into VRP GSAs by reference is an acceptable method of providing the required information in the required VRP updates as long as the most recent version of the resource providers SMFF core GSA that is on file with the USCG is used',
        'Vessel owners/operators may reference USCG-accepted SMFF core GSAs in their VRP updates in lieu of submitting detailed salvage and marine firefighting resource information in the VRP, but only for those resource providers with whom they have established contracts and funding agreements in accordance with 33 CFR Part 155 Subpart I.',
      ],
    }),
    methods: {
    },
  }
</script>

<style lang="sass">
  h3
    margin: 20px 0 10px
  p
    margin-top: 0
    margin-bottom: 1rem

</style>
