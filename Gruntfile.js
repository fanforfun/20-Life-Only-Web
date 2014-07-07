/*global module */
(function(module) {
    'use strict';

    module.exports = function(grunt) {

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                js: {
                    options: {
                        separator: ';'
                    },
                    src: ['src/js/**/*.js'],
                    dest: 'build/js/app.js~',
                    build: 'build/js/app.js'
                },
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
                js: ['build/**/*.*~']
            },
            uglify: {
                dist: {
                    options: {
                        banner: '/*! <%= pkg.fullname %> <%= pkg.version %>, <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                    },
                    files: {
                        '<%= concat.js.build %>': ['<%= concat.js.build %>']
                    }
                }
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

        grunt.registerTask('default', [
            'htmlhint', 'jscs', 'jshint',
            'less',
            'csslint',
            'concat',
            'cssmin', 'uglify', 'htmlmin'
        ]);

    };
})(module);