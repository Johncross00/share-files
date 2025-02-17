<template>
    <div class="file-list-container">
        <h1>Liste des Fichiers</h1>
        <div v-if="isLoading" class="loading">Chargement des fichiers...</div>
        <div v-else>
            <div v-if="files.length === 0" class="no-files">Aucun fichier disponible.</div>
            <div class="file-previews" v-else>
                <div v-for="file in files" :key="file.id" class="file-card">
                    <p>{{ truncateFileName(file.name) }}</p>
                    <img v-if="file.type.startsWith('image/')" :src="file.url" alt="Preview"
                        class="file-preview-image" />
                    <p v-else>Aperçu non disponible</p>
                    <h6>{{ (file.size / 1024).toFixed(2) }} KB</h6>
                    <h6>{{ file.date }}</h6>
                    <h6>{{ file.author }}</h6>
                    <div class="file-actions">
                        <button @click="downloadFile(file.url)">Télécharger</button>
                        <button @click="previewFile(file.id)">Prévisualiser</button>
                        <button v-if="file.author === userStore.user.name" @click="deleteFile(file.id)"
                            class="delete-button">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const files = ref( [] );
const isLoading = ref( true );
const error = ref( '' );
const router = useRouter();
const userStore = useUserStore();

const truncateFileName = ( name ) =>
{
    const maxLength = 20;
    return name.length > maxLength ? name.substring( 0, maxLength ) + '...' : name;
};

const fetchFiles = async () =>
{
    try
    {
        const response = await fetch( 'http://localhost:5000/files' );
        if ( !response.ok )
        {
            throw new Error( 'Failed to fetch files' );
        }
        files.value = await response.json();
    } catch ( err )
    {
        error.value = err.message;
    } finally
    {
        isLoading.value = false;
    }
};

const downloadFile = ( url ) =>
{
    const link = document.createElement( 'a' );
    link.href = url;
    link.download = true;
    link.click();
};

const previewFile = ( id ) =>
{
    router.push( { name: 'FilePreview', params: { fileId: id } } );
};

const deleteFile = async ( id ) =>
{
    try
    {
        const response = await fetch( `http://localhost:5000/files/${ id }`, {
            method: 'DELETE',
        } );
        if ( !response.ok )
        {
            throw new Error( 'Failed to delete file' );
        }
        files.value = files.value.filter( file => file.id !== id );
    } catch ( err )
    {
        error.value = err.message;
    }
};

onMounted( fetchFiles );
</script>

<style scoped>
.file-list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    color: white;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.loading,
.no-files {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
}

.file-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.file-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid #00ff00ba;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
    width: 180px;
    box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
}

.file-preview-image {
    max-width: 100%;
    max-height: 120px;
    object-fit: contain;
    border-radius: 10px;
    margin-bottom: 10px;
}

.file-actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

button {
    background: #00ff0061;
    color: black;
    padding: 8px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: 0.3s;
}

button:hover {
    background: #02ff02;
}

.delete-button {
    background: red;
    color: white;
}

.delete-button:hover {
    background: darkred;
}

.error-message {
    color: red;
    font-size: 1.2rem;
    margin-top: 10px;
}
</style>
