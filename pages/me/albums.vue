<template>
  <div v-if="!$apollo.loading">
    <p v-if="albums.length === 0">No albums</p>
    <div v-else>
      My albums:
      <div class="columns is-multiline is-mobile">
        <div
          v-for="album in albums"
          :key="album.id"
          class="column is-one-third"
        >
          <div class="card">
            <div class="card-image">
              <nuxt-link :to="`/album/${album.id}`">
                <figure class="image">
                  <img v-if="album.media[0]" :src="album.media[0].thumbnail" />
                  <img v-else src="https://place-hold.it/400x225" />
                </figure>
              </nuxt-link>
            </div>
            <footer class="card-footer">
              <nuxt-link :to="`/album/${album.id}`" class="card-footer-item">
                {{ album.name }}
              </nuxt-link>
            </footer>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <form @submit.prevent="createAlbum()">
      <b-field label="Name">
        <b-input v-model="name"></b-input>
      </b-field>
      <b-button type="is-primary" @click="createAlbum()">Create album</b-button>
    </form>
  </div>
</template>

<script>
import myAlbums from '~/apollo/queries/myAlbums'
import createAlbum from '~/apollo/queries/createAlbum'

export default {
  middleware: 'auth',
  data() {
    return {
      name: ''
    }
  },
  apollo: {
    albums: {
      prefetch: true,
      query: myAlbums,
      update: (data) => data.myAlbums
    }
  },
  methods: {
    async createAlbum(e) {
      if (this.name.length > 1) {
        const res = await this.$apollo
          .mutate({
            mutation: createAlbum,
            variables: { name: this.name }
          })
          .then(({ data }) => data && data.createAlbum)
        this.$apollo.queries.albums.refetch()
        console.log('ok', this.name, res)
      }
    }
  }
}
</script>
