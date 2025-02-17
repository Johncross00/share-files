<template>
    <div class="login-container">
        <div class="login-box">
            <h1>Connexion</h1>
            <form @submit.prevent="login">
                <div>
                    <label for="username">Nom d'utilisateur</label>
                    <input type="text" id="username" v-model="username" required placeholder="Entrez votre nom" />
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" v-model="password" required placeholder="Entrez votre mot de passe" />
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const username = ref('');
const password = ref('');
const userStore = useUserStore();
const router = useRouter();

const login = () => {
    userStore.login(username.value);
    router.push('/upload');
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: black;
    padding: 80px;
    position: fixed;
    top: 0;
    left: 0;
}
.login-box {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid #00ff00cf;
    padding: 2rem;
    border-radius: 25px;
    box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
    color: white;
    /* width: 100%; */
    width: 600px;
}

h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 2rem;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    font-size: 1rem;
    margin-bottom: 0.3rem;
}

input {
    background: transparent;
    border: 1px solid #00ff00cb;
    padding: 12px;
    border-radius: 15px;
    color: white;
    outline: none;
    margin-bottom: 1.2rem;
    font-size: 1rem;
    width: 100%;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

button {
    background: #00ff0083;
    color: black;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: 0.3s;
    width: 100%;
}

button:hover {
    background: #01ff01;
}
</style>
