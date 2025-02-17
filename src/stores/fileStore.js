import { defineStore } from "pinia";

export const useFileStore = defineStore("fileStore", {
  state: () => ({
    files: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFiles() {
      this.isLoading = true;
      try {
        const response = await fetch("http://localhost:5000/files");
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        this.files = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async uploadFile(file) {
      this.loading = true;
      try {
        const response = await fetch("http://localhost:5000/files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(file),
        });
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
        this.files.push(await response.json());
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async deleteFile(id) {
      try {
        const response = await fetch(`http://localhost:5000/files/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete file");
        }
        this.files = this.files.filter((file) => file.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    },
  },
  getters: {
    getFileList(state) {
      return state.files;
    },
    isLoading(state) {
      return state.loading;
    },
    getError(state) {
      return state.error;
    },
  },
});
