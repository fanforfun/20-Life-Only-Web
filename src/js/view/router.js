define('view/router', ['backbone', 'jquery',
                'view/main',
                'view/game/names',
                'view/game/positions',
                'view/game/faces',
                'view/results'
        ], function(B, $,
                Main,
                NamesGame,
                PositionsGame,
                FacesGame,
                Results
    ) {
    'use strict';

    return B.View.extend({
        initialize: function() {
            this.listenTo(this.model, 'game:start', this.start);
            this.listenTo(this.model, 'game:over', this.gameOver);
            this.listenTo(this.model, 'data:loaded', this.onLoad);
            this.listenTo(this.model, 'results:show', this.showResults);

            console.log('router');
            this.renderLoading();
        },

        events: {
            'click .overlay-start': 'render'
        },

        renderLoading: function () {
            this.$(".wallpapered").wallpaper({
                source: {
                    poster: "http://formstone.it/files/demo/space.jpg",
                    video: "https://www.youtube.com/embed/tKONNhMvPtI"
                }
            });

            this.model.loadPersons();
        },

        start: function(params) {
            var $el = this.$('.game-screen'),
                mode = params.mode,
                constr = {
                    el: $el,
                    model: this.model.getSession(params)
                };

            console.log('start', mode);
            switch (mode) {
                case 1 :
                    this.game = new NamesGame(constr);
                    break;
                case 2 :
                    this.game = new PositionsGame(constr);
                    break;
                case 3 :
                    this.game = new FacesGame(constr);
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

        onLoad: function () {
            this.$('.overlay').addClass('loaded');
        },

        render: function() {
            var $el = this.$('.main-screen');
            this.$(".wallpapered").wallpaper("destroy");
            this.$(".wallpapered").empty();
            this.$('.overlay').slideUp(500);
            this.main = new Main({
                el: $el,
                model: this.model
            });
        },

        showResults: function (statsModel) {
            var $el = this.$('.results-screen');
            this.results = new Results({
                el: $el,
                model: statsModel
            });
        }
    });
});
