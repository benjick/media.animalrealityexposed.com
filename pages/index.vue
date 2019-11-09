<template>
  <div>
    <section class="hero is-info is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Large title
          </h1>
          <h2 class="subtitle">
            Large subtitle
          </h2>
          <b-field>
            <b-input placeholder="Search media" size="is-large" icon="magnify">
            </b-input>
          </b-field>
        </div>
      </div>
    </section>
    <div class="container">
      <section class="section">
        <div class="columns is-mobile">
          <card title="Free" icon="github-circle">
            Open source on
            <a href="https://github.com/buefy/buefy">
              GitHub
            </a>
          </card>

          <card title="Responsive" icon="cellphone-link">
            <b class="has-text-grey">
              Every
            </b>
            component is responsive
          </card>

          <card title="Modern" icon="alert-decagram">
            Built with
            <a href="https://vuejs.org/">
              Vue.js
            </a>
            and
            <a href="http://bulma.io/">
              Bulma
            </a>
          </card>

          <card title="Lightweight" icon="arrange-bring-to-front">
            No other internal dependency
          </card>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  components: {
    Card
  }
}
</script>
