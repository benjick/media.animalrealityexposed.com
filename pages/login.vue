<template>
  <div class="container">
    <section>
      <card title="Login" icon="account">
        <b-field label="Email">
          <b-input v-model="username" type="email" maxlength="30"> </b-input>
        </b-field>

        <b-field label="Password">
          <b-input v-model="password" type="password" password-reveal>
          </b-input>
        </b-field>

        <b-button type="is-primary" @click="login">Login</b-button>
      </card>
    </section>
  </div>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'Login',
  components: {
    Card
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('local', {
        data: {
          username: this.username,
          password: this.password
        }
      })
    }
  }
}
</script>
