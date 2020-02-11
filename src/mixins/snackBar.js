export const snackBar = {
  data () {
    return {
      snackbar: false,
      snackbarColor: 'primary',
      snackbarText: '',
    }
  },
  methods: {
    showSnackBar (msg, color) {
      this.snackbar = true
      this.snackbarColor = color
      this.snackbarText = msg
    },
  },
}
