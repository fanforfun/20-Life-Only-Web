define('model/game', ['backbone', 'jquery'], function(B, $) {
    'use strict';

    return B.Model.extend({
        initialize: function() {

        },

        gameStart: function(mode) {
            console.log('game start', mode);
            this.trigger('game:start', mode);
        },

        gameOver: function() {
            console.log('game over');
            this.trigger('game:over');
        }
    });
});
