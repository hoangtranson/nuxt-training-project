<template>
  <div id="app" class="container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ $t('table.title') }}:  {{ detailArticle.title }}</div>
            <div class="md-subhead">{{ $t('table.author') }}: {{ detailArticle.author }}</div>
            <div class="md-subhead">{{ $t('table.email') }}: {{ detailArticle.email }}</div>
          </md-card-header>
          <md-card-content>
            {{ detailArticle.content }}
          </md-card-content>

          <md-card-actions md-alignment="left">
            <md-button class="md-icon-button" @click="goBack">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "ArticleDetail",
  async asyncData({ store, params }) {
    await store.dispatch("LOAD_AN_ARTICLE", params.id)
  },
  computed: {
    ...mapGetters(["detailArticle"])
  },
  methods: {
    goBack: function() {
      window.location.href = "http://localhost:3000"
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 50px 50px 50px 50px;
}
</style>
