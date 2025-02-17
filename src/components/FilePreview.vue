<template>
    <div v-if="file">
        <div v-if="file.type.startsWith('image/')">
            <img :src="file.url" :alt="file.name" class="file-preview-image" />
        </div>
        <div v-else-if="file.type === 'application/pdf'">
            <iframe :src="file.url" class="file-preview-iframe" frameborder="0"></iframe>
        </div>
        <div v-else>
            <p>La prévisualisation de ce fichier n'est pas disponible.</p>
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
        <p>Chargement de la prévisualisation...</p>
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
.file-preview-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
}

.file-preview-iframe {
    width: 100%;
    height: 80vh;
}

.file-details {
    margin-top: 20px;
}

.close-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>