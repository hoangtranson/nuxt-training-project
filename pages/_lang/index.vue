<template>
  <div class="container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <bbs-button-dial @add-article="openAddNewArticleModal"/>
        <bbs-table
          :source="articleList"
          :total-page="totalPage"
          @delete-item="deleteArticle"
          @edit-item="openEditArticleModal"
          @view-item="goToPage"
          @add-article="openAddNewArticleModal" 
          @paging="changeView"/>
      </div>

      <bbs-modal
        v-if="showModal"
        :source="editedData"
        @close-modal="closeModal"
        @submit-article="submitArticle"/>
      <md-dialog-confirm
        :md-active="isServerErr"
        :md-content="serverErrMessage"
        md-title="Server Error"
        md-confirm-text="OK"
        @md-cancel="closeErrModal"
        @md-confirm="closeErrModal" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "App",
  async asyncData({ store }) {
    console.log("asyncData")
    await store.dispatch("LOAD_ARTICLE_LIST")
    return {
      showModal: false,
      editedData: {},
      modalMode: "NEW",
      showSnackbar: false
    }
  },
  fetch({ store, params }) {
    console.log("fetch")
  },
  beforeCreate: () => console.log("beforeCreate"),
  created: () => console.log("created"),
  beforeMount: () => console.log("beforeMount"),
  mounted: () => console.log("mounted"),
  beforeUpdate: () => console.log("beforeUpdate"),
  updated: () => console.log("updated"),
  activated: () => console.log("activated"),
  deactivated: () => console.log("deactivated"),
  beforeDestroy: () => console.log("beforeDestroy"),
  destroyed: () => console.log("destroyed"),
  errorCaptured: () => console.log("errorCaptured"),
  methods: {
    submitArticle: function(newArticle) {
      this.editedData = {}
      const MODE = {
        NEW: article => {
          this.$store.dispatch("POST_NEW_ARTICLE", article).then(res => {
            this.showModal = false
          })
        },
        EDIT: article => {
          this.$store.dispatch("UPDATE_AN_ARTICLE", article).then(res => {
            this.showModal = false
          })
        }
      }
      MODE[this.modalMode](newArticle)
    },
    deleteArticle: function(deletedData) {
      this.$store.dispatch("DELETE_AN_ARTICLE", deletedData._id)
    },
    openEditArticleModal: function(editedData) {
      this.editedData = { ...editedData }
      this.showModal = true
      this.modalMode = "EDIT"
    },
    closeModal: function(e) {
      this.showModal = false
    },
    openAddNewArticleModal: function(e) {
      this.showModal = true
      this.modalMode = "NEW"
      this.editedData = {}
    },
    goToPage: function(viewData) {
      this.$router.push({ path: `/article/${viewData._id}` })
    },
    changeView: function(paging) {
      this.$nuxt.$loading.start()
      this.$store
        .dispatch("LOAD_ARTICLE_LIST", paging)
        .then(res => this.$nuxt.$loading.finish())
    },
    closeErrModal: function() {
      this.hideErrModal(false)
    },
    ...mapActions({
      hideErrModal: "SET_HIDE_ERR"
    })
  },
  computed: {
    ...mapGetters([
      "articleList",
      "totalPage",
      "isServerErr",
      "serverErrMessage"
    ])
  }
}
</script>

<style lang="scss">
.md-layout-item {
  height: 40px;

  &:after {
    width: 100%;
    height: 100%;
    display: block;
    background: md-get-palette-color(red, 200);
    content: " ";
  }
}
</style>
