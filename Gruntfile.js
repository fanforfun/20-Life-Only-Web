/*global module */
(function(module) {
    'use strict';

    module.exports = function(grunt) {
        //TODO explode http://habrahabr.ru/post/215267/
        //TODO auto prefixer

        //TODO version to js/css
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                css: {
                    options: {
                        separator: ''
                    },
                    src: ['src/vendor/HTML5-Reset/assets/css/reset.css', '<%= less.assets.prepared %>'],
                    dest: 'build/css/styles.css~~~~',
                    build: 'build/css/styles.css~~~~'
                }
            },
            clean: {
                all: ['build/**/*.*~']
            },
            less: {
                assets: {
                    options: {
                        ieCompat: false,
                        strictUnits: true,
                        paths: 'src/less'
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
                        'build/css/styles.css': ['<%= autoprefixer.css.dest %>']
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
                        'build/index.html': '<%= pkg.html %>~'
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
                options: {
                    reporter: require('jshint-stylish')
                },
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
            autoprefixer: {
                options: {
                    browsers: ['> 1%', 'last 5 versions', 'Firefox > 20', 'Opera 12.1'],
                    remove: false
                },
                css: {
                    src: '<%= concat.css.build %>',

                    dest: 'build/css/styles.css~~~~~'
                }
            },
            imagemin: {
                dynamic: {
                    files: [{
                        expand: true,
                        cwd: 'src/img/',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: 'src/img'
                    }]
                }
            },
            requirejs: {
                compile: {
                    options: {
                        waitSeconds : 0,
                        baseUrl: 'src/js',
                        mainConfigFile:'./src/js/config.js',
                        out: 'build/js/app.js',
                        //TODO ret back
                        //optimize: 'uglify2',
                        optimize: 'none',
                        logLevel: 0,
                        generateSourceMaps: false,
                        preserveLicenseComments: true,
                        removeCombined: true,
                        findNestedDependencies: true,
                        fileExclusionRegExp: /^\./,
                        paths : {
                            requireLib : '../vendor/requirejs/require'
                        },
                        include : [
                            'requireLib'
                        ],
                        inlineText: true,
                        done: function(done, output) {
                            var duplicates = require('rjs-build-analysis').duplicates(output);

                            if (duplicates.length > 0) {
                                grunt.log.subhead('Duplicates found in requirejs build:');
                                grunt.log.warn(duplicates);
                                return done(new Error('r.js built duplicate modules, please check the excludes option.'));
                            }

                            done();
                        }
                    }
                }
            },
            preprocess : {
                web : {
                    src : '<%= pkg.html %>',
                    dest : '<%= pkg.html %>~'
                }
            },
            copy: {
                htaccess: {
                    files: [{
                        expand: true,
                        nonull: true,
                        cwd: 'src/',
                        src: '.htaccess',
                        dest: 'build/',
                        flatten: true,
                        filter: 'isFile'
                    }]
                },
                manifest: {
                    files: [{
                        expand: true,
                        nonull: true,
                        cwd: 'src/',
                        src: 'offline.appcache',
                        dest: 'build/',
                        flatten: true,
                        filter: 'isFile'
                    }]
                },
                json: {
                    files: [{
                        expand: true,
                        nonull: true,
                        cwd: 'src/json/',
                        src: '**',
                        dest: 'build/json/',
                        flatten: true,
                        filter: 'isFile'
                    }]
                }
            },
            watch: {
                dev: {
                    options: {
                        livereload: true
                    },
                    files: ['Gruntfile.js', 'src/**/*.*'],
                    tasks: ['build']
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
        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.loadNpmTasks('grunt-htmlhint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-jscs');

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-csslint');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-autoprefixer');

        grunt.loadNpmTasks('grunt-contrib-htmlmin');
        grunt.loadNpmTasks('grunt-contrib-imagemin');
        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-preprocess');

        grunt.registerTask('lint', [
            'htmlhint', 'jscs', 'jshint'
        ]);

        grunt.registerTask('build:css', [
            'less', 'csslint', 'concat', 'autoprefixer:css', 'cssmin'
        ]);

        grunt.registerTask('build:html', [
            'preprocess:web', 'htmlmin'
        ]);

        grunt.registerTask('build:img', [
            'imagemin'
        ]);

        //TODO image embed
        grunt.registerTask('build:static', [
            'build:css', 'build:js', 'build:html', 'copy:htaccess', 'copy:manifest', 'copy:json'
        ]);

        grunt.registerTask('build:js', [
            'requirejs:compile'
        ]);

        grunt.registerTask('build', [
            'lint',
            'build:static'
        ]);

        grunt.registerTask('default', [
            'build'
        ]);

    };
})(module);
