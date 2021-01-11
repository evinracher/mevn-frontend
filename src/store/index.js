import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: null,
    notes: [],
    limit: 5,
    total: 0,
    page: 1,
    message: { type: "", color: "", text: "" }
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      if (!payload) {
        state.user = payload
      } else {
        state.user = decode(payload).data
        // router.push({ name: 'Notes' })
      }
    },
    setNotes(state, payload) {
      state.notes = payload
    },
    addNote(state, payload) {
      state.notes.push(payload)
    },
    deleteNote(state, payload) {
      state.notes = state.notes.filter(item => item._id !== payload)
    },
    updateNote(state, payload) {
      state.notes = state.notes.map(item => item._id !== payload._id ? item : payload)
    },
    setTotal(state, payload) {
      state.total = payload
    },
    setPage(state, payload) {
      state.page = parseInt(payload) || 1
    },
    setMessage(state, payload) {
      if (!payload || !payload.text) {
        state.message = { type: "", color: "", text: "" }
        return
      }
      // Formating the error text
      if (payload.type === 'error') {
        const index = payload.text.lastIndexOf(':');
        if (index) {
          payload.text = payload.text.substr(index + 1)
        }
      }
      state.message = payload
    }
  },
  actions: {
    setToken({ commit }, token) {
      localStorage.setItem('token', token)
      commit('setToken', token)
    },
    logOut({ commit }) {
      localStorage.removeItem('token')
      commit('setToken', null)
      commit('setMessage', null)
      router.push({ name: 'Login' })
    },
    getToken({ commit }) {
      const token = localStorage.getItem('token')
      commit('setToken', token)
    },
    setNotes({ commit, state, getters }, page) {
      axios
        .get(`/notes?page=${page}&limit=${state.limit}`, getters.config)
        .then((res) => {
          commit('setNotes', res.data.results)
          commit('setTotal', res.data.count)
          commit('setPage', page)
        })
        .catch(({ response }) => {
          console.error(response)
          router.push({ name: 'Login' })
        });
    },
    addNoteAction({ commit, getters }, note) {
      axios
        .post("/notes", note, getters.config)
        .then((res) => {
          commit('addNote', res.data)
          commit('setMessage', { text: 'Note has been added', color: 'success' })
        })
        .catch(({ response }) => {
          let text = 'Error system'
          if (response.data.error?.message) {
            text = response.data.error.message;
          }
          commit('setMessage', { type: "error", text, color: 'danger' })
          console.error(response);
        });
    },
    deleteNoteAction({ commit, getters }, id) {
      axios
        .delete("/notes/" + id, getters.config)
        .then((res) => {
          commit('deleteNote', id)
          commit('setMessage', { type: 'success', text: 'Note has been deleted', color: 'warning' })
        })
        .catch(({ response }) => {
          let text = 'Error system'
          if (response.data.error?.message) {
            text = response.data.error.message;
          }
          commit('setMessage', { type: "error", text, color: 'danger' })
          console.error(response);
        });
    },
    updateNoteAction({ commit, getters }, note) {
      axios
        .put("/notes/" + note._id, note, getters.config)
        .then((res) => {
          commit('updateNote', note)
          commit('setMessage', { type: 'success', text: 'Note has been updated', color: 'success' })
        })
        .catch(({ response }) => {
          let text = 'Error system'
          if (response.data.error?.message) {
            text = response.data.error.message;
          }
          commit('setMessage', { type: "error", text, color: 'danger' })
          console.error(response);
        });
    },
    setErrorMessage({ commit }, text) {
      commit('setMessage', { type: 'error', text, color: 'danger' })
    }
  },
  getters: {
    user: state => {
      return state.user;
    },
    config: state => {
      return {
        headers: {
          token: state.token,
        },
      }
    }
  },
  modules: {
  }
})
