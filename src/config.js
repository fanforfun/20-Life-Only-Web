require.config({
    name: 'app',
    urlArgs: 'boost=' + Math.random(),
    paths: {
        jquery: '../vendor/jquery/dist/jquery.min',
        underscore: '../vendor/underscore-amd/underscore-min',
        backbone: '../vendor/backbone-amd/backbone-min',
        velocity: '../vendor/velocity/jquery.velocity.min',
        modernizr: '../vendor/modernizr/modernizr'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});