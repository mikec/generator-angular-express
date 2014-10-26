module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    setEnvVars();

    grunt.initConfig({

        clean: {
            dist: 'dist/'
        },

        copy: {
            app_unminified: {
                expand: true,
                cwd: 'app',
                src: ['**/*.js', '!**/*_test.js', '**/*.html'],
                dest: 'dist/app/unminified'
            },
            app_minified: {
                expand: true,
                cwd: 'app',
                src: ['**/*.js', '!**/*_test.js', '**/*.html'],
                dest: 'dist/app/minified'
            },
            server: {
                expand: true,
                cwd: 'server',
                src: ['**', '!views/**'],
                dest: 'dist/server'
            },
            server_unminified: {
                expand: true,
                cwd: 'server',
                src: ['views/**'],
                dest: 'dist/server/unminified'
            },
            server_minified: {
                expand: true,
                cwd: 'server',
                src: ['views/**'],
                dest: 'dist/server/minified'
            },
            bower_copy: {
                expand: true,
                src: ['bower_components/**'],
                dest: 'dist/app/unminified'
            }<% if (filters.knexAndBookshelf) { %>,
            knexfile: {
                src: 'knexfile.js',
                dest: 'dist/knexfile.js'
            }<% } %>
        },

        jshint: {
            app: {
                options: {
                    browser: true,
                    globals: {
                        angular: false,
                        <%= appname %>: true
                    },
                    laxcomma: true,
                    maxlen: 120,
                    unused: true,
                    undef: true
                },
                files: {
                    src: [
                        'app/**/*.js',
                        '!app/**/*_test.js'
                    ]
                }
            },
            server: {
                options: {
                    node: true,
                    laxcomma: true,
                    maxlen: 120,
                    unused: true,
                    undef: true
                },
                files: {
                    src: ['server/**/*.js']
                }
            }
        },

        less: {
            unminified: {
                files: {
                    'dist/app/unminified/app.css': 'app/app.less'
                }
            },
            minified: {
                files: {
                    'dist/app/minified/app.css': 'app/app.less'
                }
            }
        },

        useminPrepare: {
            html: 'dist/server/minified/views/index.html',
            options: {
                dest: 'dist/app/minified',
                root: 'dist/app/unminified'
            }
        },

        usemin: {
            html: 'dist/server/minified/views/index.html'
        },

        express: {
            server: {
                options: {
                    script: 'dist/server/main.js',
                    port: 9999
                }
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                autoWatch: false,
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            less: {
                files: 'app/**/*.less',
                tasks: ['compile-less']
            },
            app: {
                files: ['app/**/*.js', 'app/**/*.html'],
                tasks: [
                    'jshint:app',
                    'copy-app-dist',
                    'prepare-dist'
                ]
            },
            server: {
                files: ['server/**'],
                tasks: [
                    'jshint:server',
                    'copy-server-dist',
                    'prepare-dist',
                    'express'
                ]
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['build-dist', 'express']
            }
        }

    });

    grunt.registerTask('copy-app-dist', 'Copy app files to dist',
    function() {
        grunt.task.run([
            'copy:app_unminified',
            'copy:bower_copy'
        ]);
        if(minOption()) {
            grunt.task.run('copy:app_minified');
        }
    });

    grunt.registerTask('copy-server-dist', 'Copy server files to dist',
    function() {
        grunt.task.run('copy:server'); <% if (filters.knexAndBookshelf) { %>
        grunt.task.run('copy:knexfile'); <% } %>
        grunt.task.run('copy:server_unminified');
        if(minOption()) {
            grunt.task.run('copy:server_minified');
        }
    });

    grunt.registerTask('compile-less', 'Compile LESS to CSS',
    function() {
        grunt.task.run('less:unminified');
        if(minOption()) {
           grunt.task.run('less:minified');
        }
    });

    grunt.registerTask('prepare-dist', function() {
        if(minOption()) {
            grunt.task.run([
                'useminPrepare',
                'concat:generated',
                'uglify:generated',
                'usemin'
            ]);
        }
    });

    grunt.registerTask('build-dist', [
        'clean',
        'copy-app-dist',
        'copy-server-dist',
        'compile-less',
        'prepare-dist'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build-dist',
        'express',
        'karma',
        'watch'
    ]);

    function setEnvVars() {
        if(minOption()) {
            process.env.MINIFY = 'yes';
        }
    }

    function minOption() {
        return grunt.option('minify') || grunt.option('min');
    }

}