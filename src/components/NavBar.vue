<template>
    <nav class="navbar">
        <div class="navbar-brand">
            <RouterLink to="/">Accueil</RouterLink>
            <RouterLink to="/files">Explorer</RouterLink>
        </div>
        <div class="navbar-user" v-if="user">
            <span>Bienvenue, {{ user.name }}</span><br>
            <button @click="logout">Déconnexion</button>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const user = computed( () => userStore.user );
const router = useRouter();

const logout = () =>
{
    userStore.logout();
    router.push( '/login' );
};
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    color: white;
    box-shadow: 0 2px 4px rgba(95, 94, 94, 0.438);
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.navbar-brand {
    font-size: 1.5em;
    display: flex;
    gap: 20px;
}

.navbar-brand a {
    color: #00ff00;
    text-decoration: none;
    transition: color 0.3s;
}

.navbar-brand a:hover {
    color: #01ff01;
}

.navbar-user {
    display: flex;
    align-items: center;
    gap: 10px;
}

button {
    padding: 5px 10px;
    background-color: rgba(255, 0, 0, 0.474);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: rgb(255, 0, 0);
}
</style>