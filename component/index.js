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
      var $this = this;
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
      },
      {
        name: 'componentPath',
        type: 'input',
        message: 'Where do you want it? app/'
      },
      {
        name: 'moduleName',
        type: 'input',
        message: 'What module do you want to add it to? ' + $this.appname + '.'
      },
      {
        name: 'createModule',
        type: 'confirm',
        message: 'This module does not exist. Do you want to create it?',
        when: function(answers) {
          return !moduleExists.call($this, answers.moduleName);
        }
      }], function (props) {
          this.componentPath = props.componentPath;
          this.moduleName = props.moduleName;
          this.createModule = props.createModule;
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
              '/' + this.componentPath + '/' + this.name + postfix +
            '"></script>\n\t\t<!-- endbuild -->'
          );
      }

      function templateComponentFile(postfix) {
        this.template(
          'component' + postfix,
          'app/' + this.componentPath + '/' + this.name + postfix,
          this
        );
      }

    },

    addModule: function() {
      if(this.createModule) {
        var path = "app/modules.js";
        var fileStr = this.readFileAsString(path);
        var mod = this.appname + '.' + this.moduleName;
        fileStr += '\n' + mod + ' = ' +
                  'angular.module(\'' +
                    mod + '\', []);';
        fileStr = fileStr.replace(
          '/* module dependencies */',
          ', \'' + mod + '\'\n\t/* module dependencies */'
        );
        this.writeFileFromString(fileStr, path);
      }
    }

});

function moduleExists(moduleName) {
    var path = "app/modules.js";
    var fileStr = this.readFileAsString(path);
    var fullModName = this.appname + '.' + moduleName;
    return fileStr.indexOf("angular.module('" + fullModName + "'") !== -1;
}
