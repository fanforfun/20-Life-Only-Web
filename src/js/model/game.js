define('model/game', ['backbone', 'jquery', 'model/session', 'es5shim'], function(B, $, Session) {
    'use strict';

    return B.Model.extend({
        initialize: function() {

        },

        url: function() {
            return 'json/person.json';
        },

        loadPersons: function() {
            this.fetch({
                success: _.bind(this.onSuccess, this)
            });
        },

        getFilter: function(cond) {
            /*jshint -W027*/
            switch (cond) {
                case 1:
                    return function(item) {
                        return item.priority <= 2;
                    };
                    break;
                case 2:
                    return function(item) {
                        return item.priority == 3;
                    };
                    break;
                default:
                case 3:
                    return function(item) {
                        return item.priority == params.cond;
                    };
                    break;
            }
        },

        getSession: function(params) {
            var filter = this.getFilter(params.cond),
                filtered = this.get('items').filter(filter),
                session = new Session({
                    items: filtered,
                    level: params.difficulty,
                    screen: params.mode
                });

            this.listenTo(session, 'game:end', this.gameOver);
            this.session = session;

            return session;
        },

        onSuccess: function() {
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
