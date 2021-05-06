import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    routes:{},
    loaded:false
  },
  mutations: {
    SET_ROUTES(state, routes) {
      state.routes = routes;
    },
    SET_LOADED(state, status) {
      state.loaded = status;
    }
  },
  actions: {
    getRoutes({commit}) {
      axios.get('https://6050b01f5346090017670430.mockapi.io/api/routes').then(
        response => {
          commit('SET_ROUTES', response.data)
          commit('SET_LOADED', true)
        }
      )
    }
  },
  getters: {
    allRoutes: (state) => state.routes
  }
})
