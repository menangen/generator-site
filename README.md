How to setup:
===================

 1. [Install Latest Node.js LTS Version: v6.11.0](https://nodejs.org/en/download/)
 2. Install latest version of [yo](http://yeoman.io/learning/) by command `sudo npm install -g yo` for **Linux/Mac** or `npm install -g yo` for **Windows**
 3. Clone repo and goto folder by command `git clone --depth 1 --single-branch https://github.com/menangen/generator-site.git && cd generator-site`
 4. Run setup `npm install`
 5. Link global generator into system `sudo npm link` for **Linux/Mac** or `npm link` for **Windows**

> **Note:**
> - Use admin rights for Installation **yo** and **only linking** *generator-site* into your system *(Windows or Mac)*

6. Create a new folder and run in terminal command like `mkdir project && cd project`
7. For start generator in *project* folder and setup project: `yo site`
8. Then you have to setup npm environment: `npm install`

How to use:
===================

 1. Prepare folder by `mkdir project && cd project`
 2. Run generator by `yo site`

How to run tasks:
===================
> `npm run build` *compile production build to **dist/***
> `npm run watch` *watch code and recompile **pug** and **less**/**sass***
> `npm run serve` *open website in new window*

Other watching tasks
===================
> `npm run pug:watch`
> `npm run less:watch`
> `npm run js:watch`