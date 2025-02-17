<template>
    <div>
        <h1>Liste des Fichiers</h1>
        <div v-if="isLoading">Chargement des fichiers...</div>
        <div class="file-previews" v-if="!isLoading">
            <div v-for="file in files" :key="file.id" class="file-card">
                <p>{{ truncateFileName(file.name) }}</p>
                <img v-if="file.type.startsWith('image/')" :src="file.url" alt="Preview" class="file-preview-image" />
                <p v-else>Aperçu non disponible</p>
                <!-- <p>{{ (file.size / 1024).toFixed(2) }} KB</p> -->
                <!-- <p>{{ file.date }}</p>
                <p>{{ file.author }}</p> -->
                <button @click="downloadFile(file.url)">Télécharger</button>
                <button @click="previewFile(file.id)">Prévisualiser</button>
                <button @click="deleteFile(file.id)">Supprimer</button>
            </div>
        </div>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const files = ref( [] );
const isLoading = ref( true );
const error = ref( '' );
const router = useRouter();

const truncateFileName = ( name ) =>
{
    const maxLength = 20;
    if ( name.length > maxLength )
    {
        return name.substring( 0, maxLength ) + '...';
    }
    return name;
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
</style>