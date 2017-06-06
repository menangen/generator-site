<template lang="pug">
    .span {{ time }}
</template>

<script>
    export default {
        computed: {
            time() {
                return new Date().toLocaleString()
            }
        }
    }
</script>