<template>
  <div>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" to="/">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="nuxt-link" to="/">
          Home
        </b-navbar-item>
        <b-navbar-item v-if="isAuthenticated" tag="nuxt-link" to="/me/albums">
          Albums
        </b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/upload">
          Upload
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
          <b-navbar-item href="#">
            About
          </b-navbar-item>
          <b-navbar-item href="#">
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <template v-if="!isAuthenticated">
              <nuxt-link class="button is-primary" to="/sign-up">
                Sign up
              </nuxt-link>
              <nuxt-link class="button is-light" to="/login">
                Log in
              </nuxt-link>
            </template>
            <template v-else>
              <b-button class="button is-light" @click="logout">
                Log out
              </b-button>
            </template>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <nuxt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  beforeMount() {
    this.$store.dispatch('auth/init')
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
