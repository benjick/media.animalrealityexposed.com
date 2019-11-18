<template>
  <div>
    <section class="hero is-medium is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ images.name }}
          </h1>
          <h2 class="subtitle">by {{ images.owner.name }}</h2>
        </div>
      </div>
    </section>
    <div class="container is-fluid">
      <div class="columns is-multiline is-mobile">
        <div
          v-for="image of images.media"
          :key="image.id"
          class="column is-one-third"
        >
          <div class="card">
            <div class="card-image">
              <nuxt-link :to="`/image/${image.id}`">
                <figure class="image">
                  <img :src="image.thumbnail" />
                </figure>
              </nuxt-link>
            </div>
            <footer class="card-footer">
              <nuxt-link :to="`/image/${image.id}`" class="card-footer-item"
                >Open</nuxt-link
              >
              <a download :href="image.original" class="card-footer-item"
                >Download</a
              >
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getImagesFromAlbum from '~/apollo/queries/getImagesFromAlbum'

export default {
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  apollo: {
    images: {
      prefetch: true,
      query: getImagesFromAlbum,
      update: (data) => data.getImagesFromAlbum,
      variables() {
        return {
          id: this.id
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero {
  margin-bottom: 20px;
}
</style>
