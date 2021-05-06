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
    actionRoutes({commit}) {
      axios.get('https://6050b01f5346090017670430.mockapi.io/api/routes').then(
        response => {
          commit('SET_ROUTES', response.data)
          commit('SET_LOADED', true)
        }
      ).catch(function(error) {
        console.log(error)
      })
    }
  },
  getters: {
    getPeriod: (state) => {
      if(state.loaded) {
        const dates = state.routes.map((route) => {
          return route.date
        })
        const uniqueDates = [...new Set(dates)]  
        return uniqueDates;
      }
      return null
    },
    getFilteredRoutesByDay: (state, getters) => {
      if(state.loaded) {
        let response = getters.getPeriod.map((filteredDate) => {
          return state.routes.filter((route) => route.date === filteredDate)
        })
        return response;
      }
      return null;
    }
  }
})
