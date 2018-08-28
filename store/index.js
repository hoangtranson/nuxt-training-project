import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);

const API_URL = 'http://localhost:8000/api';

const createStore = () => {
  return new Vuex.Store({
    state: {
      articleList: [],
      pageCount: null,
      detailArticle: {},
      showErrModal: false,
      serverErr: null
    },
    actions: {
      LOAD_ARTICLE_LIST: async function ({ commit, dispatch }) {
        try{
          const { data } = await  axios.get(`${API_URL}/articles`);
          commit('SET_ARTICLE_LIST', { list: data });
        } catch(err) {
          commit('SET_SHOW_ERR', 'Cannot get Article list');
        }
      },
      LOAD_AN_ARTICLE: function({commit}, id) {
        axios.get(`${API_URL}/article/${id}`).then((response) => {
          commit('SET_DETAIL_ARTICLE', { article: response.data });
        }).catch( e => {
          commit('SET_SHOW_ERR', `Cannot get Article with id ${id}`);
        });
      },
      POST_NEW_ARTICLE: function({commit}, data){
        console.warn(data);
        axios.post(`${API_URL}/article`, data).then((response) => {
          console.warn(response);
          commit('ADD_AN_ARTICLE', { item: response.data });
        }).catch( e => {
          commit('SET_SHOW_ERR', `Cannot create new article`);
        });
      },
      UPDATE_AN_ARTICLE: function({commit}, data) {
        axios.put(`${API_URL}/article/${data._id}`, data).then((response) => {
          commit('ADD_AN_ARTICLE', { item: data });
        }).catch( e => {
          commit('SET_SHOW_ERR', `Cannot edit article id ${data.id}`);
        });
      },
      DELETE_AN_ARTICLE: function({commit}, id) {
        axios.delete(`${API_URL}/article/${id}`).then((response) => {
          commit('REMOVE_ARTICLE_LIST', id);
        }).catch( e => {
          commit('SET_SHOW_ERR', `Cannot delete article id ${id}`);
        });
      },
      SET_VIEW_ARTICLE: function({commit}, id) {
        commit('UPDATE_VIEW_ARTICLE', id);
      },
      SET_HIDE_ERR: function({commit}) {
        commit('SET_HIDE_ERR');
      }
    },
    mutations: {
      SET_ARTICLE_LIST: (state, { list }) => {
        state.articleList = list.data;
        state.pageCount = list.pageCount;
      },
      SET_DETAIL_ARTICLE: (state, { article }) => {
        state.detailArticle = JSON.parse(JSON.stringify(article));
      },
      ADD_AN_ARTICLE: (state, { item }) => {
        const newData = [...state.articleList];
        const index = newData.findIndex( _i => _i._id == item._id);
  
        if(index > -1) {
          newData[index] = item;
        } else {
          newData.push(item);
        }
  
        state.articleList = newData;
      },
      REMOVE_ARTICLE_LIST: (state, id) => {
        state.articleList = state.articleList.filter( item => item._id != _id);
      },
      SET_SHOW_ERR: (state, text) => {
        state.showErrModal = true;
        state.serverErr = text;
      },
      SET_HIDE_ERR: (state) => {
        state.showErrModal = false;
        state.serverErr = null;
      }
    },
    getters: {
      articleList: (state, getters, rootState) => {
        return state.articleList;
      },
      totalPage: (state, getters, rootState) => {
        return state.pageCount;
      },
      detailArticle: (state, getters, rootState) => {
        return state.detailArticle;
      },
      isServerErr: state => state.showErrModal,
      serverErrMessage: state => state.serverErr
    }
  })
}

export default createStore;