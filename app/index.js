var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../util.js');

module.exports = yeoman.generators.Base.extend({

    init: function () {
      this.argument('name', { type: String, required: false });
      this.appname = this.name || path.basename(process.cwd());
      this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
      this.filters = {};
    },

    promptUser: function() {
      var next = this.async();
      this.prompt([{
        type: 'confirm',
        name: 'postgres',
        message: 'Would you like to use postgres with bookshelf/knex for data modeling?',
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
        type: 'input',
        name: 'dbName',
        message: 'What is the name of your postgres database?',
        when: function(answers) {
          return answers.postgres;
        }
      },
      {
        type: 'confirm',
        name: 'knexMigrations',
        message: 'Generate files for knex migrations?',
        when: function(answers) {
          return answers.postgres;
        }
      }], function(answers) {
        if(answers.postgres) {
          this.filters.postgres = true;
          this.dbName = answers.dbName;
          this.dbUser = answers.dbUser;
        }
        if(answers.knexMigrations) this.filters.knexMigrations = true;
        next();
      }.bind(this));
    },

    generate: function() {
        this.sourceRoot(path.join(__dirname, './templates'));
        this.template('bower.json', 'bower.json');
        this.template('Gruntfile.js', 'Gruntfile.js');
        this.template('package.json', 'package.json');
        genUtils.processDirectory(this, 'app', 'app');
        genUtils.processDirectory(this, 'server', 'server');
        genUtils.processDirectory(this, 'test', 'test');
        if(this.filters.knexMigrations) {
          this.template('knexfile.js', 'knexfile.js');
          genUtils.processDirectory(this, 'db', 'db');
        }
    },

    end: function() {
      this.installDependencies({
        skipInstall: this.options['skip-install']
      });
    }

});