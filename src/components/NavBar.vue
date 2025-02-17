<template>
    <nav class="navbar">
        <div class="navbar-brand">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/files">Files</RouterLink>
        </div>
        <div class="navbar-user" v-if="user">
            <span>Bienvenue, {{ user.name }}</span>
            <button @click="logout">Se déconnecter</button>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const user = computed( () => userStore.user );

const logout = () =>
{
    userStore.logout();
};
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f0f0f0;
}

.navbar-brand {
    font-size: 1.5em;
}

.navbar-user {
    display: flex;
    align-items: center;
    gap: 10px;
}
span{
    color: blue;
}

button {
    padding: 5px 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>