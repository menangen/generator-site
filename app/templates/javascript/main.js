import handlers from "./handlers"
<% if (javascript === 'vue') { %>import Vue from 'vue'
import App from "./components/app.vue"

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App)
    }
});
<% } %><% if (javascript === 'preact') { %>import { h, render } from 'preact';

render((
    <div id="foo">
        <span>Hello, <%= projectName %>!</span>
        <button onClick={ e => alert("hi!") }>Click Me</button>
        <p>
            <a href="#">Test link</a>
        </p>
    </div>
), document.body);
<% } %>
document.addEventListener("DOMContentLoaded", handlers.loadComplete);