<template>
  <div v-if="image" class="container is-fluid">
    <div class="card">
      <div class="card-image">
        <figure class="image">
          <img :src="image.original" alt="Uploaded image" />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img
                src="https://bulma.io/images/placeholders/96x96.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{ image.owner.name }}</p>
            <p class="subtitle is-6">@johnsmith</p>
          </div>
        </div>

        <div class="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
          iaculis mauris.
          <b-field grouped group-multiline>
            <div v-for="tag in image.tags" :key="tag.id" class="control">
              <b-taglist attached>
                <b-tag type="is-dark">tag</b-tag>
                <b-tag type="is-primary">{{ tag.name }}</b-tag>
              </b-taglist>
            </div>
            <div class="control">
              <b-taglist v-if="image.album" attached>
                <b-tag type="is-dark">album</b-tag>
                <b-tag type="is-info">{{ image.album.name }}</b-tag>
              </b-taglist>
            </div>
            <div class="control">
              <b-taglist v-if="image.event" attached>
                <b-tag type="is-dark">event</b-tag>
                <b-tag type="is-info">{{ image.event.name }}</b-tag>
              </b-taglist>
            </div>
          </b-field>
          <br />
          <time :datetime="image.date">{{ image.date.split('T')[0] }}</time>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getImage from '~/apollo/queries/getImage'

export default {
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  apollo: {
    image: {
      prefetch: true,
      query: getImage,
      update: (data) => data.getImage,
      variables() {
        return {
          id: this.id
        }
      }
    }
  }
}
</script>
