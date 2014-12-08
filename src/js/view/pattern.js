define('view/pattern', ['backbone', 'jquery', 'bgfix'], function(B, $) {
    'use strict';

    var maxPatterns = 2,
        pxHorizontalInSecond = 40,
        pxVerticalInSecond = 40;

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
                'background-position': '0 0'
            });
            this.posY = 0;
            this.$el.addClass('pattern-' + this.currentPattern);

            this.animate();
        },

        getDiff: function (px, distortionShare) {
            var offset = Math.floor(px * distortionShare / 2);
            return this.getRandom(offset) + px;
        },

        animate: function() {
            var me = this;

            this.posY += me.getDiff(pxVerticalInSecond, 0.3);

            this.$el.animate(
                {
                    'background-position': '0 ' + this.posY + 'px'
                },
                1000,
                'linear',
                function() {
                    me.animate();
                }
            );
        },

        destroy: function() {
            console.log('pattern destroy');
            this.$el.removeClass('pattern-' + this.currentPattern);
            this.$el.stop();

            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }
    });
});
