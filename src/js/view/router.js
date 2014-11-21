define('view/router', ['backbone', 'jquery',
                'view/main',
                'view/game/names'
        ], function(B, $,
                Main,
                NamesGame
    ) {
    'use strict';

    return B.View.extend({
        initialize: function() {
            this.listenTo(this.model, 'game:start', this.start);
            this.listenTo(this.model, 'game:over', this.gameOver);

            console.log('router');
            this.render();
        },

        start: function(mode) {
            var $el = this.$('.game-screen');
            mode = parseInt(mode, 10);
            console.log('start', mode);
            this.model.set('screen', mode);
            switch (mode) {
                case 1 :
                    this.game = new NamesGame({
                        el: $el,
                        model: this.model
                    });
                    break;
                case 2 :
                    this.game = new NamesGame({
                        el: $el,
                        model: this.model
                    });
                    break;
                case 3 :
                    this.game = new NamesGame({
                        el: $el,
                        model: this.model
                    });
                    break;
                default:
                    break;
            }
        },

        gameOver: function() {
            this.game.destroy();
            delete this.game;
            this.game = null;
        },

        render: function() {
            this.main = new Main({
                el: this.$('.main-screen'),
                model: this.model
            });
        }
    });
});
