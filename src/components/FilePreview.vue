<template>
    <div class="file-preview-container" v-if="file">
        <div v-if="file.type.startsWith('image/')">
            <img :src="file.url" :alt="file.name" class="file-preview-image" />
        </div>
        <div v-else-if="file.type === 'application/pdf'">
            <iframe :src="file.url" class="file-preview-iframe" frameborder="0"></iframe>
        </div>
        <div v-else>
            <p class="no-preview">La prévisualisation de ce fichier n'est pas disponible.</p>
        </div>
        <div class="file-details">
            <p><strong>Nom:</strong> {{ file.name }}</p>
            <p><strong>Taille:</strong> {{ (file.size / 1024).toFixed(2) }} KB</p>
            <p><strong>Date:</strong> {{ file.date }}</p>
            <p><strong>Auteur:</strong> {{ file.author }}</p>
        </div>
        <button @click="closePreview" class="close-button">Fermer</button>
    </div>
    <div v-else>
        <p class="loading-text">Chargement de la prévisualisation...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const file = ref( null );

const fetchFile = async () =>
{
    try
    {
        const response = await fetch( `http://localhost:5000/files/${ route.params.fileId }` );
        if ( !response.ok )
        {
            throw new Error( 'Failed to fetch file' );
        }
        file.value = await response.json();
    } catch ( err )
    {
        console.error( err.message );
    }
};

onMounted( fetchFile );

const closePreview = () =>
{
    router.back();
};
</script>

<style scoped>
.file-preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    color: white;
    border: 1px solid #00ff00b6;
    border-radius: 15px;
    box-shadow: 0px 0px 15px rgba(0, 255, 0, 0.5);
    backdrop-filter: blur(10px);
}

.file-preview-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
}

.file-preview-iframe {
    width: 100%;
    height: 80vh;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
}

.file-details {
    margin-top: 20px;
    text-align: center;
    font-size: 1.2rem;
}

.close-button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #00ff008d;
    color: black;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: 0.3s;
    box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
}

.close-button:hover {
    background: #00cc00;
}

.loading-text,
.no-preview {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
}
</style>
