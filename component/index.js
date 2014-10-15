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

      var indexFilePath = 'server/views/index.html';
      var indexFileStr = this.readFileAsString(indexFilePath);

      if(this.hasController) {
        addComponentScript.call(this, '-controller.js');
        templateComponentFile.call(this, '-controller.js');
        templateComponentFile.call(this, '-controller_test.js');
      }
      if(this.hasHtmlTemplate) {
        templateComponentFile.call(this, '.html');
      }
      if(this.hasDirective) {
        addComponentScript.call(this, '-directive.js');
        templateComponentFile.call(this, '-directive.js');
        templateComponentFile.call(this, '-directive_test.js');
      }
      if(this.hasService) {
        addComponentScript.call(this, '-service.js');
        templateComponentFile.call(this, '-service.js');
        templateComponentFile.call(this, '-service_test.js');
      }
      if(this.hasStylesheet) {
        templateComponentFile.call(this, '.less');
      }

      this.writeFileFromString(indexFileStr, indexFilePath);

      function addComponentScript(postfix) {
        indexFileStr =
          indexFileStr.replace(
            '<!-- endbuild -->',
            '<script src=\"' +
              '/components/' + this.name + '/' + this.name + postfix +
            '"></script>\n\t\t<!-- endbuild -->'
          );
      }

      function templateComponentFile(postfix) {
        this.template(
          'component' + postfix,
          'app/components/' + this.name + '/' + this.name + postfix,
          this
        );
      }

    },

    addModule: function() {
      var path = "app/modules.js";
      var fileStr = this.readFileAsString(path);
      var mod = this.appname + '.' + this.name;
      fileStr += '\n' + mod + ' = ' +
                'angular.module(\'' +
                  mod + '\', []);';
      fileStr = fileStr.replace(
        '/* module dependencies */',
        ', \'' + mod + '\'\n\t/* module dependencies */'
      );
      this.writeFileFromString(fileStr, path);
    }

});