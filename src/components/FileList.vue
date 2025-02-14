<template>
    <div>
        <div v-if="isLoading">Chargement des fichiers...</div>
        <ul v-if="!isLoading">
            <li v-for="file in files" :key="file.id">
                <div>
                    <span>{{ file.name }}</span>
                    <span>{{ file.size }}</span>
                    <span>{{ file.date }}</span>
                    <span>{{ file.author }}</span>
                    <button @click="deleteFile(file.id)">Supprimer</button>
                </div>
            </li>
        </ul>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script>
import { useFileStore } from '../store/fileStore';

export default {
    setup ()
    {
        const fileStore = useFileStore();

        const files = fileStore.getFileList;
        const isLoading = fileStore.isLoading;
        const error = fileStore.getError;

        const deleteFile = ( id ) =>
        {
            fileStore.deleteFile( id );
        };

        return {
            files,
            isLoading,
            error,
            deleteFile
        };
    }
};
</script>
