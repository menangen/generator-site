<template lang="pug">
    .container
        .row
            .col-md-12
                p
                    span {{ name }}
                    timeComponent
                    ul
                        li(v-for="user in users") {{ user }}
</template>

<script>
    import timeComponent from "./time.vue"
    export default {
        components: { timeComponent },
        data() {
            return {
                name: "Hello, <%= projectName %>!",
                users: ["Pushkin", "Lermontov", "Dostoevski"]
            }
        }
    }
</script>