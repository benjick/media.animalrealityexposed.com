<template>
  <div>
    <section>
      <b-field>
        <b-upload v-model="dropFiles" multiple drag-drop @input="uploadFiles">
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
    <section>
      <b-table
        :data="data"
        :checked-rows.sync="checkedRows"
        :is-row-checkable="(row) => row.id !== 3"
        checkable
      >
        <template slot-scope="props">
          <b-table-column field="preview" label="Preview">
            <img :src="props.row.preview" class="preview" />
          </b-table-column>

          <b-table-column field="tags" label="Tags">
            <b-tag type="is-primary" closable aria-close-label="Close tag">
              Cows
            </b-tag>
            <b-tag type="is-primary" closable aria-close-label="Close tag">
              Pigs
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
        <template slot="bottom-left">
          <b>Total checked</b>: {{ checkedRows.length }}
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import uuid from 'uuid/v4'

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
  methods: {
    uploadFiles(files) {
      files.forEach((file) => {
        const newFile = {
          id: uuid(),
          preview: URL.createObjectURL(file),
          file,
          tags: [],
          event: null
        }
        this.data.push(newFile)
      })
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
