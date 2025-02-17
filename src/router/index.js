import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FileList from "../components/FileList.vue";
import FilePreview from "../components/FilePreview.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/files",
    name: "FileList",
    component: FileList,
  },
  {
    path: "/preview/:fileId",
    name: "FilePreview",
    component: FilePreview,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
