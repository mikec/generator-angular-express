module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files : [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'app/app.js',
            'app/app-controller.js',
            'app/**/*_test.js'
        ]
    });
};