<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          color="primary"
          light
          max-width="100%"
          width="400"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <h1 class="display-2 font-weight-bold mb-2">
                Login
              </h1>

              <v-btn
                v-for="(social, i) in socials"
                :key="i"
                class="ma-1"
                icon
                rel="noopener"
                target="_blank"
              >
                <v-icon
                  v-text="social.icon"
                />
              </v-btn>
            </div>
          </template>

          <v-card-text class="text-center">
            <v-alert
              v-model="loginFailed"
              type="error"
              class="white--text"
              dense
              dismissible
            >
              Login failed
            </v-alert>

            <v-text-field
              v-model="username"
              color="secondary"
              label="User Name"
              prepend-icon="mdi-account-outline"
            />

            <v-text-field
              v-model="password"
              class="mb-8"
              color="secondary"
              label="Password"
              prepend-icon="mdi-lock-outline"
              type="password"
            />

            <pages-btn
              large
              color=""
              depressed
              class="v-btn--text success--text"
              @click="login"
            >
              Let's Go
            </pages-btn>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesLogin',

    components: {
      PagesBtn: () => import('./components/Btn'),
    },

    data: () => ({
      socials: [
        {
          href: '#',
          icon: 'mdi-facebook-box',
        },
        {
          href: '#',
          icon: 'mdi-twitter',
        },
        {
          href: '#',
          icon: 'mdi-github-box',
        },
      ],
      username: '',
      password: '',
      rememberMe: false,
      loginFailed: false,
    }),
    methods: {
      login () {
        const { username, password } = this
        if (username && password) {
          this.$store.dispatch('login', {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe,
          }).then(res => {
            if (this.$store.state.authentication.hasPermissions) {
              this.$store.dispatch('initMenuItems')
              this.$router.push('/')
            }
          }).catch(() => {
            this.loginFailed = true
          })
        }
      },
    },
  }
</script>
