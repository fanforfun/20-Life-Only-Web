require(['view/router', 'model/game', 'backbone', 'jquery', 'wallpaper', 'easing', 'bgfix', 'super'],
    function(Router, Game, B, $) {
        'use strict';

        new Router({
            el: $('.app'),
            model: new Game()
        });

    }
);
