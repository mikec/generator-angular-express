generator-angular-express
-------------------------
[Yeoman](http://yeoman.io/) generator for [AngularJS](https://angularjs.org/) + [Express](http://expressjs.com/) + [PostgreSQL](http://www.postgresql.org) projects

Usage
=====

Install `generator-angular-express`:
```
npm install -g generator-angular-express
```

Make a directory, and `cd` into it:
```
mkdir my-project && cd $_
```

If you want to use the database options, make sure you have [PostgreSQL](http://www.postgresql.org) installed and `psql` included in your path.

Run `yo angular-express`, optionally passing an app name:
```
yo angular-express [app-name]
```

What you get
============

Client side stuff:

* An AngularJS app, structured around this [style guide](http://google-styleguide.googlecode.com/svn/trunk/angularjs-google-style.html)
* Automatic compilation of all .less files in `/app`
* [Karma](http://karma-runner.github.io/0.12/index.html) to run the `*._test.js` files in `/app`, configured for [Jasmine](http://jasmine.github.io/)
* JS minification by running `grunt --min`
* JSHint warnings for all js files in `/app`
* bower.json file for dependency management
* Grunt watchers for changes to js, less, and html

Server side stuff:

* All code built and served from the `/dist` directory, after running `grunt`
* JSHint warnings for all js files in `/server`
* package.json file for node module dependencies
* Grunt watchers for changes to all server files

Database stuff:

* Automatic creation of PostgreSQL database and user
* [Knex](http://knexjs.org/) configured for use with `knex migrate` and `knex seed`
* ... working on adding [Bookshelf.js](http://bookshelfjs.org/) ...


Run the Generated Project
=========================

`grunt` to build and serve (default http://localhost:9999)

`grunt --min || grunt --minify` to build and serve with minified code

Using Knex
==========

Some sample files will be created in `/db/migrations` and `/db/seeds`. These are just here as an example, you can delete them and add your own.

You can run migrations with `knex migrate:latest` and run seeds with `knex seed:run`. More info in the [knex docs](http://knexjs.org/).


