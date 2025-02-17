import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),
  actions: {
    login(username) {
      this.user = {
        id: "user123",
        name: username,
      };
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem("user");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
