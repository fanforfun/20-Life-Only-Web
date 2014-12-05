define('view/game/positions', ['view/game'], function(Game) {
    'use strict';

    return Game.extend({
        initialize: function() {
            var model = this.model;

            this._super("initialize");

            console.log('game positions');

            setTimeout(function() {
                model.gameOver();
            }, 1000);
        },

        render: function() {
            console.log('render names');
            this._super("render");
        },

        destroy: function() {
            this._super("destroy");
        }
    });
});
