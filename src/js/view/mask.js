define('view/mask', ['backbone', 'jquery'], function(B, $) {
    'use strict';

    return B.View.extend({
        initialize: function() {
            this.render();
        },

        render: function() {
            var rules = {},
                rand = Math.random();
            if (rand < 0.2) {
                rules.filter = 'blur(2px)';
            } else if(rand < 0.3) {
                rules.filter = 'invert(80%)';
            } else if(rand < 0.4) {
                rules.filter = 'sepia(80%)';
            } else if(rand < 0.5) {
                rules.filter = 'saturate(90%)';
            } else if(rand < 0.6) {
                rules.filter = 'hue-rotate(120deg)';
            } else if(rand < 0.7) {
                rules.filter = 'grayscale(100%)';
            } else if(rand < 0.8) {
                rules.filter = 'opacity(70%)';
            }

            rand = Math.random();
            if (rand < 0.1) {
                rules.transform = 'rotate(90deg)';
            } else if (rand < 0.2) {
                rules.transform = 'rotate(180deg)';
            } if (rand < 0.3) {
                rules.transform = 'rotate(270deg)';
            }

            if (rules.filter) {
                rules['-webkit-filter'] = rules.filter;
                rules['-moz-filter'] = rules.filter;
            }
            if (rules.transform) {
                rules['-webkit-transform'] = rules.transform;
                rules['-moz-transform'] = rules.transform;
            }
            console.log(rules);
            this.$el.closest('li').css(rules);
        }
    });
});
