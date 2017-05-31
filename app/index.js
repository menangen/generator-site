/**
 * Created by menangen on 31.05.17.
 */
const Generator = require("yeoman-generator");
const chalk = require('chalk');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
            this.projectName = "website";
            this.installLess = false;
            this.installSass = false;
            this.installBootstrap = false;
            this.installGit = false;
            this.runNPM = false;
    }

    prompting() {
        return this.prompt([
            {
                type: "input",
                name: "name",
                message: "New folder and project name:",
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
                    this.log("App name", chalk.red(this.projectName));
                    this.log("CSS Framework", chalk.red(answers.css));

                    this.installLess = answers.css === "Less";
                    this.installSass = answers.css === "Sass";
                    this.installBootstrap = answers.bootstrap;
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
            this.templatePath("package.json"),
            this.destinationPath(`package.json`),
            {
                projectName:  this.projectName,
                less: this.installLess,
                sass: this.installSass,
                bootsrap: this.installBootstrap
            }
        );

        this.fs.copyTpl(
            this.templatePath("index.pug"),
            this.destinationPath("src/pug/index.pug")
        );

        if (this.installLess) {
            this.fs.copyTpl(
                this.templatePath("styles.less"),
                this.destinationPath("src/less/styles.less"),
                {
                    bootsrap: this.installBootstrap
                }
            );
            if (this.installBootstrap) {
                this.fs.copyTpl(
                    this.templatePath("bootstrap.less"),
                    this.destinationPath("src/less/bootstrap.less")
                );
            }
        }


        if (this.installSass) {
            this.fs.copyTpl(
                this.templatePath("styles.scss"),
                this.destinationPath("src/sass/styles.scss"),
                {
                    bootsrap: this.installBootstrap
                }
            );
            this.fs.copyTpl(
                this.templatePath("mobile.scss"),
                this.destinationPath("src/sass/mobile.scss")
            );
        }
    }

    install() {
        if (this.installGit) {
            this.spawnCommand("git", ["add", "package.json", "src/"]);
        }

        if (this.runNPM) this.npmInstall();
    }
};