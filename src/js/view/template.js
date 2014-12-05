define('view/template', ['backbone', 'jquery', 'mustache'], function(B, $, Mustache) {
    'use strict';

    return B.View.extend({
        renderTemplate: function($el, template, options) {
            if (!options) {
                options = {};
            }

            var rendered = Mustache.render(template, options);
            $el.html(rendered);
        }
    });
});
