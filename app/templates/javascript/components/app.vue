<template>
    <span>{{ name }}</span>
</template>

<script>
    export default {
        data() {
            return {
                name: 'Hello <%= projectName %>!'
            }
        }
    }
</script>