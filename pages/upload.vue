<template>
  <div>
    <div class="columns">
      <div class="column">
        <section>
          <b-field>
            <b-upload
              v-model="dropFiles"
              multiple
              drag-drop
              @input="uploadFiles"
            >
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large"> </b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
        </section>
      </div>
      <div class="column">
        <section>
          <h2>Batch operation for {{ checkedRows.length }} images</h2>
          <b-field>
            <b-select placeholder="Add a tag" @input="setTag($event)">
              <option
                v-for="option in tags"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <b-select placeholder="Set event" @input="setEvent($event)">
              <option
                v-for="option in events"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <b-select placeholder="Set album" @input="setAlbum($event)">
              <option
                v-for="option in albums"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </b-select>
          </b-field>
        </section>
      </div>
    </div>
    <section>
      <b-button type="is-primary" :disabled="data.length < 1" @click="upload"
        >Upload {{ data.length }} images</b-button
      >
      <b-table :data="data" :checked-rows.sync="checkedRows" checkable>
        <template slot-scope="props">
          <b-table-column field="preview" label="Preview">
            <nuxt-link v-if="props.row.uploaded" :to="'/image/' + props.row.id">
              <img :src="props.row.preview" class="preview" />
            </nuxt-link>
            <img v-else :src="props.row.preview" class="preview" />
          </b-table-column>

          <b-table-column field="status" label="Status">
            <span v-if="props.row.uploaded">
              Uploaded
            </span>
            <span v-else-if="props.row.uploading">
              Uploading...
            </span>
            <span v-else>
              Ready to upload
            </span>
          </b-table-column>

          <b-table-column field="album" label="Album">
            <b-select
              v-model="props.row.album"
              :disabled="props.row.uploading || props.row.uploaded"
              placeholder="Set album"
            >
              <option :value="undefined">
                No album
              </option>
              <option
                v-for="option in albums"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </b-select>
          </b-table-column>

          <b-table-column field="event" label="Event">
            <b-select
              v-model="props.row.event"
              :disabled="props.row.uploading || props.row.uploaded"
              placeholder="Set event"
            >
              <option :value="undefined">
                No event
              </option>
              <option
                v-for="option in events"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </b-select>
          </b-table-column>

          <b-table-column field="tags" label="Tags">
            <b-tag
              v-for="tag in props.row.tags"
              :key="tag"
              type="is-primary"
              closable
              aria-close-label="Close tag"
              @close="removeTag(props.row.id, tag)"
            >
              {{ tags.find((_tag) => _tag.id === tag).name }}
            </b-tag>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
              </p>
              <p>Nothing here.</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import allTags from '~/apollo/queries/allTags'
import latestEvents from '~/apollo/queries/latestEvents'
import myAlbums from '~/apollo/queries/myAlbums'
import uploadMedia from '~/apollo/queries/uploadMedia'

export default {
  middleware: 'auth',
  data() {
    const data = []
    return {
      data,
      checkedRows: [],
      dropFiles: []
    }
  },
  apollo: {
    tags: {
      prefetch: true,
      query: allTags
    },
    events: {
      prefetch: true,
      query: latestEvents
    },
    albums: {
      prefetch: true,
      query: myAlbums,
      update: (data) => data.myAlbums
    }
  },
  methods: {
    upload() {
      this.data.forEach(async (image) => {
        image.uploading = true
        const formData = new FormData()
        formData.append('file', image.file)
        const imageUpload = await this.$axios.post(
          '/api/upload/s3',
          formData,
          {}
        )
        const { tags, event, album } = image
        const variables = {
          ...imageUpload.data,
          tags,
          event,
          album
        }
        const res = await this.$apollo
          .mutate({
            mutation: uploadMedia,
            variables
          })
          .then(({ data }) => data && data.uploadMedia)
        image.id = res.id
        image.uploading = false
        image.uploaded = true
      })
    },
    uploadFiles(files) {
      files.forEach((file) => {
        const newFile = {
          id: uuid(),
          preview: URL.createObjectURL(file),
          file,
          tags: [],
          event: null,
          album: null,
          uploading: false,
          uploaded: false
        }
        this.data.push(newFile)
      })
    },
    setTag(id) {
      this.checkedRows.forEach((row) => {
        const tags = row.tags.slice(0)
        tags.push(id)
        row.tags = [...new Set(tags)]
      })
    },
    removeTag(rowId, tagId) {
      const row = this.checkedRows.find((r) => r.id === rowId)
      if (row) {
        row.tags.splice(row.tags.indexOf(tagId), 1)
      }
    },
    setEvent(eventId) {
      this.checkedRows.forEach((row) => (row.event = eventId))
    },
    setAlbum(albumId) {
      this.checkedRows.forEach((row) => (row.album = albumId))
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  max-height: 100px;
  max-width: 200px;
}
</style>
