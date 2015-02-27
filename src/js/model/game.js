define('model/game', ['backbone', 'jquery', 'model/session', 'model/stats', 'es5shim'], function(B, $, Session, Stats) {
    'use strict';

    return B.Model.extend({
        initialize: function() {
            this.stats = new Stats();
            this.listenTo(this.stats, 'menu:show', this.onMenuShow);
        },

        url: function() {
            return 'json/person.json';
        },

        loadPersons: function() {
            this.fetch({
                success: _.bind(this.onSuccess, this)
            });
        },

        getSettings: function() {
            var settings = this.stats.getSettings();
            console.log('load settings', settings);
            return settings;
        },

        getStats: function() {
            var all = this.get('items'),
                known = this.stats.getKnown(),
                unknown = this.stats.getUnknown();

            return {
                aaa: {
                    correct: known.filter(this.getFilter(1)).length,
                    all: all.filter(this.getFilter(1)).length
                },
                aa: {
                    correct: known.filter(this.getFilter(2)).length,
                    all: all.filter(this.getFilter(2)).length
                },
                all: all.length,
                incorrect: unknown.length,
                correct: known.length
            }
        },

        saveSetting: function(key, newValue) {
            var settings = this.stats.getSettings();
            settings[key] = newValue;
            this.stats.saveSettings(settings);
            console.log('save settings', settings);
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
                    //top 30 of unknown
                    var count = 0;
                    return function(item) {
                        if (item.score >= 0) {
                            return false;
                        }
                        count++;
                        return count <= 30;
                    };
                    break;
            }
        },

        getSession: function(params) {
            var filtered = this.get('items'),
                session = new Session({
                    items: filtered,
                    level: params.difficulty,
                    screen: params.mode
                });

            this.listenTo(session, 'game:over', this.showResults);
            this.listenTo(session, 'game:end', this.gameOver);
            this.session = session;

            return session;
        },

        onSuccess: function() {
            var me = this,
                stats = this.stats.getStats();
            //migrate score
            this.get('items').forEach(function(item) {
                var finded = stats.filter(function (find) {
                    return find.name == item.name;
                });
                if (finded.length) {
                    item.score = finded[0].score;
                }
            });

            setTimeout(function() {
                //sleep!!1 Im idiot, kill me plz!
                me.trigger('data:loaded');
            }, 800);
        },

        gameStart: function(mode, cond, difficulty) {
            console.log('game start', mode);
            this.trigger('game:start', {
                mode: mode,
                cond: cond,
                difficulty: difficulty
            });
        },

        showResults: function (answers) {
            this.stats.setResults(answers);

            this.trigger('results:show', this.stats);
        },

        onMenuShow: function () {
            this.session.gameEnd();
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
