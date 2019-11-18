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

          <b-button type="is-primary" @click="login">Login</b-button>
        </form>
      </card>
    </section>
  </div>
</template>

<script>
import Card from '~/components/Card'
import authenticateUser from '~/apollo/queries/authenticateUser'

export default {
  name: 'Login',
  auth: 'guest',
  components: {
    Card
  },
  data() {
    return {
      username: 'max@malm.me',
      password: 'test',
      error: null
    }
  },
  methods: {
    async login() {
      try {
        const res = await this.$apollo
          .mutate({
            mutation: authenticateUser,
            variables: {
              username: this.username,
              password: this.password
            }
          })
          .then(({ data }) => data && data.authenticateUser)
        await this.$store.dispatch('auth/login', res)
        this.$router.push('/')
      } catch (e) {
        console.log(e)
        this.$buefy.snackbar.open('Login failed')
      }
    }
  }
}
</script>
