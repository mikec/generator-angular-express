module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        jasmine_node: {
            all: ['test/']
        },

        watch: {
            js: {
                files: [
                    'test/**/*',
                    'app/**/*',
                    'component/**/*',
                    'templates/**/*'
                ],
                tasks: 'test'
            }
        }

    });

    grunt.registerTask('default', ['test']);
    grunt.registerTask('test', ['jasmine_node']);

};