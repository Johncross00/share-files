<template>
    <h1>Uploadez vos fichiers</h1>
    <div class="file-uploader">
        <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
            <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
            <input type="file" multiple @change="handleFileUpload" ref="fileInput" class="hidden" />
        </div>
        <div v-if="isLoading" class="progress-bar">
            <span>Uploading...</span>
            <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="file-previews" v-if="selectedFiles.length > 0">
            <div v-for="file in selectedFiles" :key="file.name" class="file-card">
                <p>{{ truncateFileName(file.name) }}</p>
                <img v-if="file.type.startsWith('image/')" :src="file.url" alt="Preview" class="file-preview-image" />
                <p v-else>Aperçu non disponible</p>
                <p>{{ (file.size / 1024).toFixed(2) }} KB</p>
            </div>
        </div>
        <button @click="uploadToServer" :disabled="selectedFiles.length === 0 || isLoading"
            class="upload-button mt-4 p-2 bg-blue-500 text-white rounded">
            <span v-if="isLoading">Uploading...</span>
            <span v-else>Envoyer les fichiers</span>
        </button>
        <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
    </div>

    <!-- Boîte de dialogue modale pour afficher les erreurs -->
    <div v-if="showErrorDialog" class="modal">
        <div class="modal-content">
            <p>{{ error }}</p>
            <button @click="closeErrorDialog">Ok</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFileStore } from '../stores/fileStore';
import { useUserStore } from '../stores/userStore';

const fileStore = useFileStore();
const userStore = useUserStore();
const isLoading = ref( false );
const error = ref( '' );
const successMessage = ref( '' );
const selectedFiles = ref( [] );
const progress = ref( 0 );
const fileInput = ref( null );
const showErrorDialog = ref( false );

const handleFileUpload = ( event ) =>
{
    const files = event.target.files;
    processFiles( files );
};

const handleDrop = ( event ) =>
{
    const files = event.dataTransfer.files;
    processFiles( files );
};

const processFiles = ( files ) =>
{
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [ 'image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'application/pdf', 'application/zip' ];

    if ( files.length > 0 )
    {
        selectedFiles.value = Array.from( files ).map( file =>
        {
            if ( file.size > maxSize )
            {
                error.value = `File ${ file.name } exceeds the maximum size of 50MB.`;
                showErrorDialog.value = true;
                return null;
            }
            if ( !allowedTypes.includes( file.type ) )
            {
                error.value = `File type ${ file.type } is not allowed.`;
                showErrorDialog.value = true;
                return null;
            }
            return {
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL( file ),
                author: userStore.user.name,
                date: new Date().toLocaleString()
            };
        } ).filter( file => file !== null );
    }
};

const triggerFileInput = () =>
{
    fileInput.value.click();
};

const delay = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );

const truncateFileName = ( name ) =>
{
    const maxLength = 20;
    if ( name.length > maxLength )
    {
        return name.substring( 0, maxLength ) + '...';
    }
    return name;
};

const uploadToServer = async () =>
{
    isLoading.value = true;
    try
    {
        for ( let index = 0; index < selectedFiles.value.length; index++ )
        {
            const file = selectedFiles.value[ index ];
            await delay( 500 ); // Délai artificiel de 500ms pour ralentir le rechargement
            const response = await fetch( 'http://localhost:5000/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( file )
            } );
            if ( !response.ok )
            {
                throw new Error( 'Failed to upload file to server' );
            }
            progress.value = ( ( index + 1 ) / selectedFiles.value.length ) * 100;
        }
        successMessage.value = 'Files uploaded to server successfully!';
        selectedFiles.value = []; // Vider la liste des fichiers sélectionnés après l'upload
    } catch ( err )
    {
        error.value = err.message;
        showErrorDialog.value = true;
    } finally
    {
        isLoading.value = false;
    }
};

const closeErrorDialog = () =>
{
    showErrorDialog.value = false;
    error.value = '';
};
</script>

<style scoped>
.file-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.drop-zone {
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
}

.drop-zone:hover {
    background-color: #f0f0f047;
}

.hidden {
    display: none;
}

.progress-bar {
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    max-width: 600px;
}

.progress {
    width: 0;
    height: 5px;
    background-color: rgb(0, 255, 34);
    transition: width 0.5s;
}

.file-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.file-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    width: 150px;
}

.file-preview-image {
    max-width: 100%;
    max-height: 100px;
    object-fit: contain;
}

.text-red-500 {
    color: red;
}

.text-green-500 {
    color: green;
}

.upload-button {
    margin-top: 20px;
    /* Ajouter de l'espace entre le bouton et la grille de sélection des fichiers */
}

.upload-button:disabled {
    background-color: rgba(230, 124, 124, 0.99);
    /* Changer la couleur du bouton lorsqu'il est désactivé */
    cursor: not-allowed;
}

/* Styles pour la boîte de dialogue modale */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    color: red;
    font-weight: bold;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}
</style>