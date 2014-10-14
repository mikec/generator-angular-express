var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../util.js');

module.exports = yeoman.generators.NamedBase.extend({

    init: function () {
      this.appname = path.basename(process.cwd());
      this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
      this.classname = this._.classify(this.name);
    },

    promptUser: function() {
      var next = this.async();
      this.prompt([{
        name: 'componentParts',
        type: 'checkbox',
        message: 'What should we add to your component? [SPACE to select]',
        choices: [
          {
            value: 'controller',
            name: 'Controller',
            checked: true
          },
          {
            value: 'htmlTemplate',
            name: 'HTML template',
            checked: true
          },
          {
            value: 'service',
            name: 'Service',
            checked: false
          },
          {
            value: 'directive',
            name: 'Directive',
            checked: false
          },
          {
            value: 'stylesheet',
            name: 'Stylesheet',
            checked: false
          }
        ]
      }], function (props) {
          this.hasController = props.componentParts.indexOf('controller') > -1;
          this.hasHtmlTemplate = props.componentParts.indexOf('htmlTemplate') > -1;
          this.hasService = props.componentParts.indexOf('service') > -1;
          this.hasDirective = props.componentParts.indexOf('directive') > -1;
          this.hasStylesheet = props.componentParts.indexOf('stylesheet') > -1;
          next();
      }.bind(this));

    },

    copyFiles: function() {

      templateComponentFile.call(this, '.js');

      if(this.hasController) {
        templateComponentFile.call(this, '-controller.js');
        templateComponentFile.call(this, '-controller_test.js');
      }
      if(this.hasHtmlTemplate) {
        templateComponentFile.call(this, '.html');
      }
      if(this.hasDirective) {
        templateComponentFile.call(this, '-directive.js');
        templateComponentFile.call(this, '-directive_test.js');
      }
      if(this.hasService) {
        templateComponentFile.call(this, '-service.js');
        templateComponentFile.call(this, '-service_test.js');
      }
      if(this.hasStylesheet) {
        templateComponentFile.call(this, '.less');
      }

      function templateComponentFile(postfix) {
        this.template(
          'component' + postfix,
          'app/components/' + this.name + '/' + this.name + postfix,
          this
        );
      }

    }

});