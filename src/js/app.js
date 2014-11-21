require(['view/router', 'model/game', 'backbone', 'jquery', 'super'],
    function(Router, Game, B, $) {
        'use strict';

        new Router({
            el: $('.app'),
            model: new Game()
        });

    }
);
