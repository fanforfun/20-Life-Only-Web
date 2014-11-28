define('model/game', ['backbone', 'jquery', 'model/session', 'es5shim'], function(B, $, Session) {
    'use strict';

    return B.Model.extend({
        initialize: function() {

        },

        url: function() {
            return 'json/person.json';
        },

        loadPersons: function () {
            this.fetch({
                success: _.bind(this.onSuccess, this)
            });
        },

        getSession: function (condition, level) {
            var filtered = this.get('items').filter(function(item) {
                    return item.priority  == condition;
                }),
                session = new Session({
                    items: filtered,
                    level: level
                });

            this.listenTo(session, 'game:over', this.gameOver);
            this.session = session;

            return session;
        },

        onSuccess: function () {
            this.trigger('data:loaded');
        },

        gameStart: function(mode, cond, difficulty) {
            console.log('game start', mode);
            this.trigger('game:start', {
                mode: mode,
                cond: cond,
                difficulty: difficulty
            });
        },

        gameOver: function() {
            console.log('game over');

            if (this.session) {
                //TODO save to stats

                this.session.destroy();
                delete this.session;
            }

            this.trigger('game:over');
        }
    });
});
