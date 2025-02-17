import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
  }),
  actions: {
    login(username) {
      this.user = {
        id: "user123",
        name: username,
      };
    },
    logout() {
      this.user = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
