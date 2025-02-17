import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FileList from "../components/FileList.vue";
import FilePreview from "../components/FilePreview.vue";
import Login from "@/components/Login.vue";
import FileUploader from "@/components/FileUploader.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/upload",
    name: "upload",
    component: FileUploader,
    meta: { requiresAuth: true },
  },
  {
    path: "/files",
    name: "FileList",
    component: FileList,
    meta: { requiresAuth: true },
  },
  {
    path: "/preview/:fileId",
    name: "FilePreview",
    component: FilePreview,
    meta: { requiresAuth: true },
  },
  { 
    path: "/:pathMatch(.*)*", 
    component: Login 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
