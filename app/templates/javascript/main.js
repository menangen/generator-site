import handlers from "./handlers"
<% if (javascript === 'vue') { %>import Vue from 'vue'
import App from "./components/app.vue"

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App)
    }
});
<% } %>
document.addEventListener("DOMContentLoaded", handlers.loadComplete);