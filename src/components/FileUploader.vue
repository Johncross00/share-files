<template>
    <div>
        <input type="file" multiple @change="handleFileUpload" />
        <div v-if="isLoading" class="progress-bar">
            <span>Uploading...</span>
            <div class="progress"></div>
        </div>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useFileStore } from '../store/fileStore';

export default {
    setup ()
    {
        const fileStore = useFileStore();
        const isLoading = ref( fileStore.isLoading );
        const error = ref( fileStore.getError );

        const handleFileUpload = ( event ) =>
        {
            const files = event.target.files;
            if ( files.length > 0 )
            {
                Array.from( files ).forEach( ( file ) =>
                {
                    fileStore.uploadFile( file );
                } );
            }
        };

        return {
            isLoading,
            error,
            handleFileUpload
        };
    }
};
</script>

<style scoped>
.progress-bar {
    display: flex;
    align-items: center;
}

.progress {
    width: 100%;
    height: 5px;
    background-color: gray;
}
</style>
