import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Services: []
  },
  getters: {},
  mutations: {
    UPDATE_SERVICE(state, editedIndex, editedItem) {
      state.Services = Object.assign(state.Services[editedIndex], editedItem);
    },
    INITIAL_UPDATE(state, service) {
        state.Services = service;
    },
    NEW_SERVICE(state, newService) {
        state.Services.push(newService);
    }
  },
  actions: {
    updateService({ commit }, service) {
      commit("UPDATE_SERVICE", service);
    },
    initialUpdateService({ commit }, service) {
        commit("INITIAL_UPDATE", service);
    }
  }
});