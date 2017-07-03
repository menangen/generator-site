/**
 * Created by menangen on 31.05.17.
 */
const Generator = require("yeoman-generator");
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
            this.projectName = "website";
            this.preprocessor = false;
            this.css = false;
            this.includePath = { less: "", sass: "" };
            this.javascript = false;
            this.installGit = false;
            this.runNPM = false;
    }

    prompting() {
        return this.prompt([
            {
                type: "input",
                name: "name",
                message: "Please type the project name:",
                default: this.appname // Default to current folder name
            },
            {
                type: "list",
                name: "preprocessor",
                message: "Please select preprocesor:",
                choices: ["Less.js", "Sass (node-sass)"],
                default: 0 // Default is Less
            },
            {
                type: "list",
                name: "css",
                message: "Would you like to use CSS Framework like Twitter Bootstrap?",
                choices: [
                    "Without any css framework",
                    "ungrid (ultra minimal table like grid)",
                    "mini.css",
                    "Bootstrap 3"
                ],
                default: 0
            },
            {
                type: "expand",
                name: "javascript",
                message:
                    "Would you like to setup Javascript with Rollup and js Framework?\n" +
                    chalk.red(
                        "Without javascript (n)\t"
                    )
                    +chalk.yellow(
                        "ES6 Rollup JS modules (y)\t"
                    )
                    +chalk.green(
                        "Vue + ES6 Rollup (v)\t"
                    )
                    +chalk.green("Preact + ES6 Rollup (p)\n"),

                choices: [
                    {
                        key: 'n',
                        name: chalk.red('No javascript'),
                        value: 'no'
                    },
                    {
                        key: 'y',
                        name: chalk.yellow('ES6 with Rollup.js'),
                        value: 'rollup'
                    },

                    new inquirer.Separator(),
                    {
                        key: 'v',
                        name: chalk.green('Vue.js') + chalk.grey(' (Reactive, component-oriented view layer for modern web interfaces)'),
                        value: 'vue'
                    },
                    {
                        key: 'p',
                        name: chalk.green('Preact') + chalk.grey(' (Fast 3kb React alternative with the same ES6 API)'),
                        value: 'preact'
                    },

                ]
            },
            {
                type: "confirm",
                name: "git",
                message: "Would you like to use Git?"
            },
            {
                type: "confirm",
                name: "npm",
                message: chalk.green("Would you like to run ") + chalk.red("npm install") + chalk.green(" ?")
            }
            ]).then(
                (answers) => {
                    this.projectName = answers.name;

                    switch (answers.preprocessor) {
                        case "Less.js":
                            this.preprocessor = "less";
                            break;
                        case "Sass (node-sass)":
                            this.preprocessor = "sass";
                            break;
                    }

                    switch (answers.css) {

                        case "Bootstrap 3":
                            this.css = "bootstrap";
                            this.includePath.less = "node_modules/bootstrap-less";
                            this.includePath.sass = "node_modules/bootstrap-sass/assets/stylesheets";
                            break;
                        case "ungrid (ultra minimal table like grid)":
                            this.css = "ungrid";
                            break;
                        case "mini.css":
                            this.css = "mini";
                            this.includePath.sass = "node_modules/mini.css/src";
                            break;

                        default:
                            this.css = false;
                    }

                    this.javascript = answers.javascript !== "no" ? answers.javascript : false;
                    this.installGit = answers.git;
                    this.runNPM = answers.npm;

                    this.log("App name", chalk.blue.underline.bold(this.projectName));

                    if (this.css) {
                        this.log(
                            chalk.black.bgMagenta(
                                this.css + " included in " + this.preprocessor + " code")
                        )
                    }
                    else this.log("CSS Preprocessor", chalk.black.bgMagenta(this.preprocessor));

                    let withColor;
                    switch (answers.javascript) {
                        case "no":
                            withColor = chalk.black.bgRed;
                            break;
                        case "vue":
                        case "react":
                            withColor = chalk.black.bgGreen;
                            break;
                        default:
                            withColor = chalk.black.bgYellow;
                            break
                    }

                    this.log("Javascript", withColor(answers.javascript));


                });
    }

    configuring() {
        if (this.installGit) {

            this.fs.copyTpl(
                this.templatePath("gitignore"),
                this.destinationPath(".gitignore")
            );
            this.spawnCommand("git", ["init"]);
        }
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath("npm/package.json"),
            this.destinationPath("package.json"),
            {
                projectName: this.projectName,
                preprocessor: this.preprocessor,
                css: this.css,
                includePath: this.includePath,
                javascript: this.javascript
            }
        );

        this.fs.copyTpl(
            this.templatePath("pug/index.pug"),
            this.destinationPath("src/pug/index.pug"),
            {
                projectName: this.projectName,
                preprocessor: this.preprocessor,
                css: this.css,
                javascript: this.javascript
            }
        );

        if (this.preprocessor === "less") {
            this.fs.copyTpl(
                this.templatePath("less/styles.less"),
                this.destinationPath("src/less/styles.less"),
                {
                    css: this.css
                }
            );

            switch (this.css) {
                case "bootstrap":
                    this.fs.copyTpl(
                        this.templatePath("less/bootstrap.less"),
                        this.destinationPath("src/less/bootstrap.less")
                    );
                    break;
                case "ungrid":
                    this.fs.copyTpl(
                        this.templatePath("less/ungrid.less"),
                        this.destinationPath("src/less/ungrid.less")
                    );
                    break;
            }
        }


        if (this.preprocessor === "sass") {
            this.fs.copyTpl(
                this.templatePath("sass/styles.scss"),
                this.destinationPath("src/sass/styles.scss"),
                {
                    css: this.css
                }
            );

            switch (this.css) {
                case "bootstrap":
                    this.fs.copyTpl(
                        this.templatePath("sass/bootstrap.sass"),
                        this.destinationPath("src/sass/bootstrap.sass")
                    );
                    break;

                case "ungrid":
                    this.fs.copyTpl(
                        this.templatePath("sass/ungrid.scss"),
                        this.destinationPath("src/sass/ungrid.scss")
                    );
                    break;

                case "mini":
                    this.fs.copyTpl(
                        this.templatePath("sass/mini.sass"),
                        this.destinationPath("src/sass/mini.sass")
                    );
                    break;
            }

            this.fs.copyTpl(
                this.templatePath("sass/mobile.scss"),
                this.destinationPath("src/sass/mobile.scss")
            );
        }

        if (this.javascript) {
            // Rollup
            this.fs.copyTpl(
                this.templatePath("rollup/rollup.config.js"),
                this.destinationPath("rollup.config.js"),
                {
                    projectName: this.projectName,
                    javascript: this.javascript
                }
            );
            // Eslint
            this.fs.copyTpl(
                this.templatePath("eslint/.eslintrc.js"),
                this.destinationPath(".eslintrc.js"),
                {
                    javascript: this.javascript
                }
            );
            // Javascript ES6 modules
            // main
            this.fs.copyTpl(
                this.templatePath("javascript/main.js"),
                this.destinationPath("src/javascript/main.js"),
                {
                    projectName: this.projectName,
                    javascript: this.javascript
                }
            );
            // handlers
            this.fs.copyTpl(
                this.templatePath("javascript/handlers.js"),
                this.destinationPath("src/javascript/handlers.js")
            );
            // models
            this.fs.copyTpl(
                this.templatePath("javascript/models.js"),
                this.destinationPath("src/javascript/models.js"),
                {
                    projectName: this.projectName
                }
            );
            // vue component
            if (this.javascript === 'vue') {
                this.fs.copyTpl(
                    this.templatePath("javascript/components/app.vue"),
                    this.destinationPath("src/javascript/components/app.vue"),
                    {
                        projectName: this.projectName
                    }
                );
                this.fs.copyTpl(
                    this.templatePath("javascript/components/time.vue"),
                    this.destinationPath("src/javascript/components/time.vue")
                );
            }
        }
    }

    install() {
        if (this.installGit) {
            const gitTrackingFiles = ["add", "src/", "package.json"];

            if (this.javascript) {
                gitTrackingFiles.push("rollup.config.js");
                gitTrackingFiles.push(".eslintrc.js");
            }

            this.spawnCommand("git", gitTrackingFiles);
        }

        if (this.runNPM) this.npmInstall();
    }

    end() {

        if (this.runNPM) {
            this.patchFile = this.fs.read(this.templatePath('patch/http_server.patch'));
            const patchProcess = this.spawnCommand("patch", [
                "node_modules/http-server/bin/http-server",
                "-b"
            ], {stdio: 'pipe'});

            patchProcess.stdout.pipe(process.stdout);
            patchProcess.stdin.write(this.patchFile);

            patchProcess.stdin.end();
        }
        else {
            this.log('http-server": "^0.10.0" has URL opening bug on Safari ', chalk.yellow("goo.gl/gRQSSW"));
        }
    }
};