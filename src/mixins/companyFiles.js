export const companyFiles = {
  data () {
    return {
      categories: {
        'Schedule A': [
          {
            name: 'Non-Tank SMFF Annex',
            code: 'nt-smff-annex',
            count: 0,
            generated: true,
          },
          {
            name: 'SCHEDULE A Non-Tank',
            code: 'schedule-a-non-tank',
            count: 0,
            generated: true,
          },
          {
            name: 'SCHEDULE A Tanker',
            code: 'schedule-a-tanker',
            count: 0,
            generated: true,
          },
          {
            name: 'SCHEDULE A Combined',
            code: 'schedule-a-combined',
            count: 0,
            generated: true,
          },
        ],
        'Pre-fire Plan Certification': [
          {
            name: 'Multiple Vessels Pre-fire Plan Certification',
            code: 'multiple-vessels-pre-fire-plan-certification',
            count: 0,
            generated: true,
          },
          {
            name: 'Single Vessel Pre-fire Plan Certification',
            code: 'single-vessel-pre-fire-plan-certification',
            count: 0,
            generated: true,
          },
        ],
        'SMFF Coverage Certification': [
          {
            name: 'SMFF Coverage Certification',
            code: 'smff-coverage-certification',
            count: 0,
            generated: true,
          },
        ],
        'Contracts, Written Consents, and Agreements': [
          {
            name: 'Group V Consent Letter',
            code: 'group-v-consent-letter',
            count: 0,
            generated: true,
          },
          {
            name: 'Letter of Intent - Non Tank Vessels below 250 bbls',
            code: 'letter-of-intent-non-tank-vessels-below-250-bbls',
            count: 0,
            generated: true,
          },
          {
            name: 'Letter of Intent - Non Tank Vessels',
            code: 'letter-of-intent-non-tank-vessels',
            count: 0,
            generated: true,
          },
          {
            name: 'Written Consent Form - Tank',
            code: 'written-consent-form-tank',
            count: 0,
            generated: true,
          },
          {
            name: 'Written Consent Form',
            code: 'written-consent-form',
            count: 0,
            generated: true,
          },
          {
            name: 'OPA-90 Client Contract',
            code: 'contracts',
            count: 0,
            generated: false,
          },
          {
            name: 'OPA-90 Response Asset Agreement',
            code: 'opa-90-response-asset-agreement',
            count: 0,
            generated: false,
          },
          {
            name: 'NASA Response Asset Agreement',
            code: 'nasa-response-asset-agreement',
            count: 0,
            generated: false,
          },
        ],
        Annex: [
          {
            name: 'Tank SMFF Annex',
            code: 'tank-smff-annex',
            count: 0,
            generated: true,
          },
          {
            name: 'Combined SMFF Annex',
            code: 'combined-smff-annex',
            count: 0,
            generated: true,
          },
          {
            name: 'AA-Vessel Specific Page',
            code: 'aa-vessel-specific',
            count: 0,
            generated: true,
          },
        ],
        'Damaged Stability': [
          {
            name: 'Damage Stability Coverage Certification',
            code: 'damage-stability-coverage-certification',
            count: 0,
            generated: true,
          },
          {
            name: 'Damage Stability Certificates',
            code: 'damage-stability-certificates',
            count: 0,
            generated: false,
          },
        ],
        'Shipboard Spill Mitigation Procedures': [
          {
            name: 'Shipboard Spill Mitigation Procedures',
            code: 'shipboard-spill-mitigation-procedures',
            count: 0,
            generated: false,
          },
        ],
      },
    }
  },
  methods: {
    getDirFromCode (code) {
      let ret
      Object.keys(this.categories).forEach(cat => {
        const temp = this.categories[cat].find(dir => dir.code === code)
        if (temp) {
          ret = temp
        }
      })
      return ret
    },
  },
}
