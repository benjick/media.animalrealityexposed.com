<template>
  <div class="container">
    <section>
      <card title="Sign up" icon="account">
        <form @submit.prevent="signup">
          <b-field label="Email">
            <b-input v-model="username" type="email"></b-input>
          </b-field>

          <b-field label="Name">
            <b-input v-model="name"></b-input>
          </b-field>

          <b-field label="Password">
            <b-input v-model="password" type="password" password-reveal>
            </b-input>
          </b-field>

          <b-field label="Password again">
            <b-input v-model="password2" type="password" password-reveal>
            </b-input>
          </b-field>

          <b-message
            v-if="!passwordMatch || password.length < 8"
            title="About your password"
            type="is-warning"
            :closable="false"
          >
            Passwords needs to match and be at least 8 characters long
          </b-message>

          <div class="field">
            <b-checkbox v-model="checkbox">
              I agree to save my data etc
            </b-checkbox>
          </div>

          <b-button type="is-primary" @click="signup">
            Register account
          </b-button>
        </form>
      </card>
    </section>
  </div>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'SignUp',
  auth: 'guest',
  components: {
    Card
  },
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      name: '',
      error: null
    }
  },
  computed: {
    passwordMatch() {
      return this.password === this.password2
    }
  },
  methods: {
    async signup() {
      try {
        if (!this.passwordMatch) {
          throw new Error('Password mismatch')
        }
        await this.$axios.post('/api/auth/signup', {
          username: this.username,
          password: this.password,
          name: this.name
        })
        this.$router.push({
          path: '/login'
        })
      } catch (e) {
        this.$buefy.snackbar.open('Sign up failed')
      }
    }
  }
}
</script>
