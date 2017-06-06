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
            this.installLess = false;
            this.installSass = false;
            this.installBootstrap = false;
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
                name: "css",
                message: "Please select preprocesor:",
                choices: ["Less", "Sass"],
                default: 0 // Default Less
            },
            {
                type: "confirm",
                name: "bootstrap",
                message: "Would you like to enable Bootstrap 3?"
            },
            {
                type: "expand",
                name: "javascript",
                message:
                    "Would you like to setup Javascript with Rollup and js Framework?\n" +
                    chalk.yellow(
                        'Rollup JS modules (y)\t'
                    )
                    +chalk.red(
                        'Not use javascript (n)\t'
                    )
                    +chalk.green(
                        'Vue + Rollup (v)\t'
                    )
                    +chalk.green('Preact + Rollup (p)\n'),
                choices: [

                    {
                        key: 'y',
                        name: chalk.yellow('ES6 with Rollup.js'),
                        value: 'rollup'
                    },
                    {
                        key: 'n',
                        name: chalk.red('No javascript'),
                        value: 'no'
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
                    this.log("App name", chalk.yellow(this.projectName));
                    this.log("CSS Framework", chalk.yellow(answers.css));
                    this.log("Javascript", chalk.red(answers.javascript));

                    this.installLess = answers.css === "Less";
                    this.installSass = answers.css === "Sass";
                    this.installBootstrap = answers.bootstrap;
                    this.javascript = answers.javascript !== "no" ? answers.javascript: false;
                    this.installGit = answers.git;
                    this.runNPM = answers.npm;

                    if (this.installBootstrap) this.log("Bootstrap 3 included as npm module");
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
                less: this.installLess,
                sass: this.installSass,
                bootsrap: this.installBootstrap,
                javascript: this.javascript
            }
        );

        this.fs.copyTpl(
            this.templatePath("pug/index.pug"),
            this.destinationPath("src/pug/index.pug"),
            {
                projectName: this.projectName,
                javascript: this.javascript
            }
        );

        if (this.installLess) {
            this.fs.copyTpl(
                this.templatePath("less/styles.less"),
                this.destinationPath("src/less/styles.less"),
                {
                    bootsrap: this.installBootstrap
                }
            );
            if (this.installBootstrap) {
                this.fs.copyTpl(
                    this.templatePath("less/bootstrap.less"),
                    this.destinationPath("src/less/bootstrap.less")
                );
            }
        }


        if (this.installSass) {
            this.fs.copyTpl(
                this.templatePath("sass/styles.scss"),
                this.destinationPath("src/sass/styles.scss"),
                {
                    bootsrap: this.installBootstrap
                }
            );

            if (this.installBootstrap) {
                this.fs.copyTpl(
                    this.templatePath("sass/bootstrap.sass"),
                    this.destinationPath("src/sass/bootstrap.sass")
                );
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
            /* Javascript ES6 modules */
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
            this.spawnCommand("git", ["add", "package.json", "src/"]);
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
            this.log('http-server": "^0.10.0" has URL opening bug on Safari ', chalk.yellow("https://github.com/craigmichaelmartin/http-server/commit/1779827b911d7149d9918c1ba4881a583f77b841#diff-4ede5aceb32bc9cc9c1a5923aac46bda"));
        }
    }
};