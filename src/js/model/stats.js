define('model/stats', ['backbone', 'store', 'underscore', 'es5shim'], function(B, store, _) {
    'use strict';

    return B.Model.extend({
        initialize: function() {
        },

        getSettings: function() {
            return store('settings') || {
                filter: 1,
                difficulty: 1
            };
        },

        saveSettings: function(data) {
            store('settings', data);
        },

        getStats: function() {
            return store('stats') || [];
        },

        saveStats: function(data) {
            store('stats', data);
        },

        getAnswerNumbers: function() {
            return this.get('current').length;
        },

        getCorrectAnswerNumbers: function() {
            var filtered = this.get('current').filter(function(item) {
                return item.isCorrect;
            });
            return filtered.length;
        },

        getKnown: function () {
            return this.getStats().filter(function(item) {
                return item.score > 0;
            });
        },

        getUnknown: function () {
            return this.getStats().filter(function(item) {
                return item.score < 0;
            });
        },

        getCurrentTop: function () {
            var current = _.sortBy(this.get('current'), function(item) {
                return item.score;
            }).slice(0, 5);
            console.log(current);

            return current;
        },

        setResults: function (results) {
            var stats = this.getStats(),
                current = results.slice(0);
            //TODO compare and save

            results.forEach(function(item, key) {
                var find = stats.filter(function(value) {
                    return item.name == value.name;
                });

                if (!find.length) {
                    find = {
                        name: item.name,
                        priority: item.priority,
                        correct: 0,
                        incorrect: 0,
                        score: 0
                    };
                    stats.push(find);
                } else {
                    find = find[0];
                }

                if (item.isCorrect) {
                    find.correct++;
                } else {
                    find.incorrect++;
                }
                find.score += item.isCorrect ? 1 : -2;

                current[key].score = find.score;
            });
            this.saveStats(stats);
            this.set('current', current);

            this.trigger('results:show');
        },

        close: function () {
            this.trigger('menu:show');
        }



    });
});
