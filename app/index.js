var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../util.js');

module.exports = yeoman.generators.Base.extend({

    init: function () {
      this.argument('name', { type: String, required: false });
      this.appname = this.name || path.basename(process.cwd());
      this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
    },

    generate: function() {
        this.sourceRoot(path.join(__dirname, './templates'));
        genUtils.processDirectory(this, '.', '.');
    },

    end: function() {
      this.installDependencies({
        skipInstall: this.options['skip-install']
      });
    }

});