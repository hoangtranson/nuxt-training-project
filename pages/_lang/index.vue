<template>
  <div class="container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <bbs-button-dial v-on:add-article="openAddNewArticleModal"></bbs-button-dial>
        <bbs-table
          v-bind:source="articleList"
          v-bind:totalPage="totalPage"
          v-on:delete-item="deleteArticle"
          v-on:edit-item="openEditArticleModal"
          v-on:view-item="goToPage"
          v-on:add-article="openAddNewArticleModal" 
          v-on:paging="changeView"></bbs-table>
      </div>

      <bbs-modal
        v-if="showModal"
        v-bind:source="editedData"
        v-on:close-modal="closeModal"
        v-on:submit-article="submitArticle"></bbs-modal>
        <md-dialog-confirm
          :md-active="isServerErr"
          md-title="Server Error"
          :md-content="serverErrMessage"
          md-confirm-text="OK"
          @md-cancel="closeErrModal"
          @md-confirm="closeErrModal" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'app',
  data () {
    return {
      showModal: false,
      editedData: {},
      modalMode: "NEW",
      showSnackbar: false
    }
  },
  async fetch ({ store, params }) {
    await store.dispatch('LOAD_ARTICLE_LIST');
  },
  methods: {
    submitArticle: function(newArticle) {
      this.editedData = {};
      const MODE = {
        "NEW": (article) => {
          this.$store.dispatch('POST_NEW_ARTICLE', article)
          .then( res => {
            this.showModal = false;
          });
        },
        "EDIT": (article) => {
          this.$store.dispatch('UPDATE_AN_ARTICLE', article)
          .then( res => {
            this.showModal = false;
          });
        }
      }
      MODE[this.modalMode](newArticle);
    },
    deleteArticle: function(deletedData) {
      this.$store.dispatch('DELETE_AN_ARTICLE', deletedData._id);
    },
    openEditArticleModal: function(editedData) {
      this.editedData = {...editedData};
      this.showModal = true;
      this.modalMode = "EDIT";
    },
    closeModal: function(e) {
      this.showModal = false;
    },
    openAddNewArticleModal: function(e) {
      this.showModal = true;
      this.modalMode = "NEW";
      this.editedData = {};
    },
    goToPage: function(viewData) {
      viewData.viewCount += 1;
      this.$store.dispatch('UPDATE_AN_ARTICLE', viewData).then( res => {
        this.$router.push({ path: `/article/${viewData._id}` });
      })
    },
    changeView: function(paging) {
      this.$nuxt.$loading.start();
      this.$store.dispatch('LOAD_ARTICLE_LIST', paging).then( res => this.$nuxt.$loading.finish());
    },
    closeErrModal: function(){
      this.hideErrModal(false);
    },
    ...mapActions({
      hideErrModal: 'SET_HIDE_ERR'
    })
  },
  computed: {
    ...mapGetters([
      'articleList',
      'totalPage',
      'isServerErr',
      'serverErrMessage'
    ])
  },
  // created () {
  //   this.$store.dispatch('LOAD_ARTICLE_LIST');
  // },
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