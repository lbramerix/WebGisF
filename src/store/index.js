import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: "", // ID
    username: "", // 用户昵称
  },
  getters: {
    id: (state) => state.id,
    username: (state) => state.username,
  },
  mutations: {
    setId: (state, id) => {
      state.id = id;
    },
    setUsername: (state, username) => {
      state.username = username;
    },
  },
})


