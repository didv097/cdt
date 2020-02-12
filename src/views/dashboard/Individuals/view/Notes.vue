<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Notes"
      :loading="loading"
    >
      <v-card-text>
        <v-card
          v-for="note in notes"
          :key="note.id"
        >
          <v-card-title>
            {{ note.user }} - {{ note.created_at }}
            <v-spacer />
            <v-btn
              icon
              @click="deleteNote(note.id)"
            >
              <v-icon color="error">
                mdi-delete
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            {{ note.note }}
          </v-card-text>
        </v-card>
        <base-material-alert
          v-if="!notes || !notes.length"
          color="warning"
          dark
        >
          No notes defined
        </base-material-alert>
        <v-dialog
          v-model="addMsg"
          max-width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              v-on="on"
            >
              Add Note
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              New Note
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="newNote.note"
                label="Note *"
                :rules="[v => !!v || 'Note is required']"
              />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="addMsg = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="addNote"
              >
                Add Note
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
  import axios from 'axios'
  import { snackBar } from '@/mixins/snackBar'

  export default {
    mixins: [snackBar],
    data: () => ({
      loading: false,
      notes: [],
      newNote: {
        note_type: 1,
      },
      addMsg: false,
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('users/' + this.$route.params.id + '/notes')
          .then(res => {
            this.notes = res.data.data
            this.loading = false
          })
      },
      addNote () {
        if (this.newNote.note) {
          axios.post(`users/${this.$route.params.id}/addNote`, this.newNote)
            .then(res => {
              this.addMsg = false
              this.showSnackBar(res.data.message, 'success')
              this.getDataFromApi()
            })
            .catch(error => {
              if (error.response && error.response.data) {
                this.showSnackBar(error.response.data.message || error.response.status, 'error')
              }
            })
        }
      },
      deleteNote (id) {
        this.$confirm('Please confirm that you would like to delete the note', {
          title: 'Warning',
          buttonTrueText: 'Delete',
          buttonFalseText: 'Cancel',
          buttonTrueColor: 'error',
          buttonFalseColor: 'primary',
        })
          .then(res => {
            if (res) {
              axios.delete('users/' + this.$route.params.id + '/notes/' + id + '/destroy')
                .then(res => {
                  this.showSnackBar(res.data.message, 'success')
                  this.getDataFromApi()
                })
            }
          })
      },
    },
  }
</script>
