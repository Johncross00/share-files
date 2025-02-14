import { defineStore } from "pinia";

export const useFileStore = defineStore("fileStore", {
  state: () => ({
    files: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFiles() {
      this.loading = true;
      try {
        // Simule une requête réseau pour récupérer des fichiers
        const response = await new Promise((resolve) =>
          setTimeout(
            () =>
              resolve([
                {
                  id: 1,
                  name: "Document1.pdf",
                  size: "2MB",
                  date: "2025-02-14",
                  author: "Utilisateur 1",
                },
                {
                  id: 2,
                  name: "Image1.jpg",
                  size: "1.5MB",
                  date: "2025-02-13",
                  author: "Utilisateur 1",
                },
              ]),
            1000
          )
        );
        this.files = response;
      } catch (err) {
        this.error = "Erreur lors de la récupération des fichiers";
      } finally {
        this.loading = false;
      }
    },

    async uploadFile(file) {
      this.loading = true;
      try {
        // Simule un upload de fichier
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          date: new Date().toISOString().split("T")[0],
          author: "Utilisateur 1",
        };
        this.files.push(newFile);
      } catch (err) {
        this.error = "Erreur lors de l'upload du fichier";
      } finally {
        this.loading = false;
      }
    },

    deleteFile(fileId) {
      this.files = this.files.filter((file) => file.id !== fileId);
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
