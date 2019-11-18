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
      <b-table :data="data" :checked-rows.sync="checkedRows" checkable>
        <template slot-scope="props">
          <b-table-column field="preview" label="Preview">
            <img :src="props.row.preview" class="preview" />
          </b-table-column>

          <b-table-column field="album" label="Album">
            <b-select v-model="props.row.album" placeholder="Set album">
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
            <b-select v-model="props.row.event" placeholder="Set event">
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
    uploadFiles(files) {
      files.forEach((file) => {
        const newFile = {
          id: uuid(),
          preview: URL.createObjectURL(file),
          file,
          tags: [],
          event: null,
          album: null
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
