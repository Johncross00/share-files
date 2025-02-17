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
                <!-- <p>{{ (file.size / 1024).toFixed(2) }} KB</p> -->
            </div>
        </div>
        <button @click="uploadToServer" class="mt-4 p-2 bg-blue-500 text-white rounded">Upload to Server</button>
        <p v-if="error" class="text-red-500">{{ error }}</p>
        <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFileStore } from '../stores/fileStore';

const fileStore = useFileStore();
const isLoading = ref( fileStore.isLoading );
const error = ref( fileStore.error );
const successMessage = ref( '' );
const selectedFiles = ref( [] );
const progress = ref( 0 );
const fileInput = ref( null );

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

const processFiles = async ( files ) =>
{
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [ 'image/png', 'image/jpeg', 'application/pdf' ];

    if ( files.length > 0 )
    {
        selectedFiles.value = Array.from( files ).map( file =>
        {
            if ( file.size > maxSize )
            {
                error.value = `File ${ file.name } exceeds the maximum size of 5MB.`;
                return null;
            }
            if ( !allowedTypes.includes( file.type ) )
            {
                error.value = `File type ${ file.type } is not allowed.`;
                return null;
            }
            return {
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL( file )
            };
        } ).filter( file => file !== null );

        for ( let index = 0; index < selectedFiles.value.length; index++ )
        {
            const file = selectedFiles.value[ index ];
            await delay( 500 ); // Délai artificiel de 500ms
            fileStore.uploadFile( file ).then( () =>
            {
                progress.value = ( ( index + 1 ) / selectedFiles.value.length ) * 100;
                if ( index === selectedFiles.value.length - 1 )
                {
                    successMessage.value = 'All files uploaded successfully!';
                }
            } ).catch( ( err ) =>
            {
                error.value = err.message;
            } );
        }
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
    try
    {
        for ( const file of selectedFiles.value )
        {
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
        }
        successMessage.value = 'Files uploaded to server successfully!';
    } catch ( err )
    {
        error.value = err.message;
    }
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
    background-color: blue;
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
</style>