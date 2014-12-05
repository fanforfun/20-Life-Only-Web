define('view/pattern', ['backbone', 'jquery'], function(B, $) {
    'use strict';

    var maxPatterns = 2,
        pxHorizontalInSecond = 40,
        pxVerticalInSecond = 80;

    return B.View.extend({
        initialize: function() {
            var pattern = this.getRandom(maxPatterns);
            console.log('pattern ' + pattern);
            this.currentPattern = this.getRandom(maxPatterns);
            this.render();
        },

        getRandom: function(max) {
            return Math.floor(Math.random() * (max - 1) + 1);
        },

        render: function() {
            this.$el.css({
                'background-position-y': 0,
                'background-position-x': 0
            });
            this.$el.addClass('pattern-' + this.currentPattern);

            this.animate();
        },

        getDiff: function (px, distortionShare) {
            var offset = Math.floor(px * distortionShare / 2);
            return this.getRandom(offset) - offset + px;
        },

        animate: function() {
            var me = this,
                xDiff = me.getDiff(pxHorizontalInSecond, 1),
                yDiff = me.getDiff(pxVerticalInSecond, 0.3);

            this.$el.animate(
                {
                    'background-position-x': (xDiff >= 0 ? '+' : '-') + '=' + xDiff,
                    'background-position-y': (yDiff >= 0 ? '+' : '-') + '=' + yDiff
                },
                1000,
                'linear',
                function() {
                    me.animate();
                }
            );
        },

        destroy: function() {
            this.$el.removeClass('pattern-' + this.currentPattern);
            this.$el.stop();

            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }
    });
});
