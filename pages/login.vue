<template>
  <div class="container">
    <section>
      <card title="Login" icon="account">
        <form @submit.prevent="login">
          <b-field label="Email">
            <b-input v-model="username" type="email" maxlength="30"> </b-input>
          </b-field>

          <b-field label="Password">
            <b-input v-model="password" type="password" password-reveal>
            </b-input>
          </b-field>

          <b-button @click="login" type="is-primary">Login</b-button>
        </form>
      </card>
    </section>
  </div>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'Login',
  auth: 'guest',
  components: {
    Card
  },
  data() {
    return {
      username: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
      } catch (e) {
        this.$buefy.snackbar.open('Login failed')
      }
    }
  }
}
</script>
