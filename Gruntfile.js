/*global module */
(function(module) {
    'use strict';

    module.exports = function(grunt) {
        //TODO explode http://habrahabr.ru/post/215267/

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                css: {
                    options: {
                        separator: ''
                    },
                    src: ['src/vendor/HTML5-Reset/assets/css/reset.css', '<%= less.assets.prepared %>'],
                    dest: 'build/css/styles.less~',
                    build: 'build/css/styles.css'
                }
            },
            clean: {
                all: ['build/**/*.*~']
            },
            less: {
                assets: {
                    options: {
                        paths: 'src/less',
                        strictUnits: true
                    },
                    prepared: 'build/css/styles.css~~',
                    files: {
                        '<%= less.assets.prepared %>': 'src/less/**/*.less'
                    }
                }
            },
            cssmin: {
                dist: {
                    options: {
                        keepSpecialComments: true,
                        banner: '/*! <%= pkg.fullname %> <%= pkg.version %>, <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                    },
                    files: {
                        '<%= concat.css.build %>': ['<%= concat.css.dest %>']
                    }
                }
            },
            htmlmin: {
                dist: {
                    options: {
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: {
                        'build/index.html': '<%= pkg.html %>'
                    }
                }
            },
            jscs: {
                src: 'src/js/**/*.js',
                options: {
                    config: '.jscsrc'
                }
            },
            jshint: {
                jshintrc: '.jshintrc',
                files: ['src/js/**/*.js']
            },
            htmlhint: {
                options: {
                    htmlhintrc: '.htmlhintrc'
                },
                html1: {
                    src: ['src/*.html']
                }
            },
            csslint: {
                options: {
                    csslintrc: '.csslintrc'
                },
                strict: {
                    src: ['<%= less.assets.prepared %>']
                }
            },
            requirejs: {
                compile: {
                    options: {
                        baseUrl: 'src/js',
                        mainConfigFile:'./src/config.js',
                        out: 'build/js/app.js',
                        optimize: 'none', //TODO 'uglify'
                        logLevel: 0,
                        findNestedDependencies: true,
                        fileExclusionRegExp: /^\./,
                        inlineText: true
                    }
                }
            },
            watch: {
                dev: {
                    options: {
                        livereload: true
                    },
                    files: ['.*', 'Gruntfile.js', 'src/**/*.*'],
                    tasks: ['default']
                },
                livereload: {
                    options: {
                        livereload: true,
                        spawn: true,
                        interrupt: true,
                        nospaces: true,
                        livereloadOnError: false
                    },
                    files: ['build/**/*']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.loadNpmTasks('grunt-htmlhint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-jscs');

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-csslint');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-htmlmin');
        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-requirejs');

        grunt.registerTask('default', [
            'htmlhint', 'jscs', 'jshint',
            'less',
            'csslint',
            'concat',
            'cssmin', 'htmlmin',
            'requirejs'
        ]);

    };
})(module);