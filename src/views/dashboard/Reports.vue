<template>
  <v-container
    id="reports"
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-file-document"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          System Reports
        </div>
      </template>

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Report</th>
              <th>Document Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in reports"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.document_type }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      color="primary"
                      v-on="on"
                    >
                      <v-icon size="24">
                        mdi-cloud-download
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Download File</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </base-material-card>
  </v-container>
</template>

<script>

  export default {
    name: 'Reports',

    data: () => ({
      search: '',
      reports: [
        {
          name: 'DJS vessels and their DPA',
          document_type: 'csv',
          download_link: 'reports/donjon/vessels',
        },
        {
          name: 'Companies in the NASA Potential Network',
          document_type: 'csv',
          download_link: 'reports/nasa/potential',
        },
      ],
    }),
    methods: {
    },
  }
</script>
