var path = require('path');
var angularExpressGen = require('../app/index');

module.exports = angularExpressGen.extend({

    start: function() {
      this.init();
      this.appname = path.basename(process.cwd());
      this.appVarName = this._.camelize(this.appname);
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
        message: 'What module do you want to add it to? ' + $this.appVarName + '.'
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

      var lessFilePath = 'app/app.less';
      var lessFileStr = this.readFileAsString(lessFilePath);

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
        addLessImport.call(this);
        templateComponentFile.call(this, '.less');
      }

      this.writeFileFromString(indexFileStr, indexFilePath);
      this.writeFileFromString(lessFileStr, lessFilePath);

      function addComponentScript(postfix) {
        indexFileStr =
          indexFileStr.replace(
            '<!-- endbuild -->',
            '<script src=\"' +
              '/' + this.componentPath + '/' + this.name + postfix +
            '"></script>\n\t\t<!-- endbuild -->'
          );
      }

      function addLessImport() {
        lessFileStr = lessFileStr + '\n' +
                        '@import "/' + this.componentPath +
                                    '/' + this.name + '.less";';
      }

      function templateComponentFile(postfix) {
        this.template(
          '../../templates/component/component' + postfix,
          'app/' + this.componentPath + '/' + this.name + postfix,
          this
        );
      }

    },

    createComponentModule: function() {
      if(this.createModule) {
        this.addModule(this.moduleName);
      }
    }

});

function moduleExists(moduleName) {
    var path = "app/modules.js";
    var fileStr = this.readFileAsString(path);
    var fullModName = this.appVarName + '.' + moduleName;
    return fileStr.indexOf("angular.module('" + fullModName + "'") !== -1;
}
