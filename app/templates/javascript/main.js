import handlers from "./handlers"
<% if (javascript === 'vue') { %>import Vue from 'vue'
import App from "./components/app.vue"

new Vue({
    el: '#app',
    render: createElement => {
        return createElement(App)
    }
});
<% } %><% if (javascript === 'preact') { %>import { h, render } from 'preact';

render((
    <div id="app">
        <span>Hello, <%= projectName %>!</span>
        <button onClick={ e => alert("Hello, from <%= projectName %>!") }>Click Me</button>
        <p>
            <a href="#">Inline anchor</a>
        </p>
    </div>
), document.body);
<% } %>
document.addEventListener("DOMContentLoaded", handlers.loadComplete, false);