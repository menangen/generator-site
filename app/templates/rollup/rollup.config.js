<% if (javascript === 'vue' || javascript === 'preact') { %>const alias = require('rollup-plugin-alias');
<% if (javascript === 'vue') { %>const vue = require("rollup-plugin-vue");<% }} %>
export default {
    entry: 'src/javascript/main.js',
    format: 'umd',
    moduleName: '<%= projectName %>',
    dest: 'dist/js/bundle.js'<% if (javascript === 'vue' || javascript === 'preact') { %>,
    plugins: [<% if (javascript === 'vue') { %>
        vue({compileTemplate: true}),<% } %>
        alias({
            <% if (javascript === 'vue') { %>'vue': 'node_modules/vue/dist/vue.esm.js'<% } %>
        })
    ]<% } %>
}