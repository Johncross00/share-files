<template>
    <div class="login">
        <h1>Connexion</h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="password">Mot de passe</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Se connecter</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const username = ref( '' );
const password = ref( '' );
const userStore = useUserStore();
const router = useRouter();

const login = () =>
{
    userStore.login( username.value );
    router.push( '/upload' );
};
</script>

<style scoped>
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

button {
    padding: 10px 20px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>