var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../util.js');
var exec = require('exec');

module.exports = yeoman.generators.NamedBase.extend({

    init: function () {
      this.appname = this.name || path.basename(process.cwd());
      this.appVarName = this._.camelize(this.appname);
      this.filters = {};

      this.addModule = function(moduleName) {
        var path = "app/modules.js";
        var fileStr = genUtils.insertModuleDep(
                        this.readFileAsString(path),
                        this.appVarName,
                        moduleName);
        this.writeFileFromString(fileStr, path);
      };

    },

    promptUser: function() {
      var next = this.async();
      this.prompt([{
        type: 'confirm',
        name: 'postgres',
        message: 'Would you like to use postgres?',
      },
      {
        type: 'input',
        name: 'dbName',
        message: 'What is the name of your postgres database?',
        when: function(answers) {
          return answers.postgres;
        }
      },
      {
        type: 'confirm',
        name: 'dbCreate',
        message: 'Create this database?',
        when: function(answers) {
          return answers.postgres;
        }
      },
      {
        type: 'input',
        name: 'dbUser',
        message: 'What is the name of your postgres user?',
        when: function(answers) {
          return answers.postgres;
        }
      },
      {
        type: 'confirm',
        name: 'dbUserCreate',
        message: 'Create a role for this user?',
        when: function(answers) {
          return answers.postgres;
        }
      },
      {
        type: 'confirm',
        name: 'knexAndBookshelf',
        message: 'Use knex and Bookshelf.js for data modeling?',
        when: function(answers) {
          return answers.postgres;
        }
      }], function(answers) {
        if(answers.postgres) {
          this.filters.postgres = true;
          this.dbName = answers.dbName;
          this.dbUser = answers.dbUser;
          this.dbCreate = answers.dbCreate;
          this.dbUserCreate = answers.dbUserCreate;
          if(answers.knexAndBookshelf) this.filters.knexAndBookshelf = true;
        }
        next();
      }.bind(this));
    },

    dbCreate: function() {
      if(this.dbCreate) {
        console.log("Creating postgres database: " + this.dbName);
        exec(['createdb', this.dbName], function(err, out, code) {
          if (err instanceof Error)
            throw err;
          process.stderr.write(err);
          process.stdout.write(out);
        });
      }
      if(this.dbUserCreate) {
        console.log("Creating postgres user: " + this.dbUser);
        exec(['createuser', '-s', '-r', '-d', this.dbUser], function(err, out, code) {
          if (err instanceof Error)
            throw err;
          process.stderr.write(err);
          process.stdout.write(out);
        });
      }
    },

    generate: function() {
        this.sourceRoot(path.join(__dirname, '../templates'));

        this.template('bower.json', 'bower.json');
        this.template('Gruntfile.js', 'Gruntfile.js');
        this.template('package.json', 'package.json');

        genUtils.processDirectory(this, 'app', 'app');
        genUtils.processDirectory(this, 'test', 'test');

        genUtils.processDirectory(this, 'server/views', 'server/views');
        this.template('server/main.js', 'server/main.js');

        if(this.filters.knexAndBookshelf) {
          this.template('knexfile.js', 'knexfile.js');
          genUtils.processDirectory(this, 'db', 'db');
          genUtils.processDirectory(this, 'server/models', 'server/models');
        }
    },

    end: function() {
      this.installDependencies({
        skipInstall: this.options['skip-install']
      });
    }

});