define('model/session', ['backbone', 'underscore', 'jquery'], function(B, _, $) {
    'use strict';

    return B.Model.extend({
        initialize: function() {
            this.set('playing', true);

            this.set('answers', []);
            var items = this.get('items').slice(0),
                questions,
                me = this,
                id = 1;

            items.forEach(function(item) {
                item.id = id;
                item.hash = me.randHash() + me.randHash();
                id++;
            });

            questions = items.slice(0);
            this.shuffle(questions);
            this.set('questions', questions);

            this.shuffle(items);
            this.set('items', items);
            console.log('init session');
        },

        getSpeedKoef: function() {
            return Math.pow(4 - this.get('level'), 2);
        },

        isShaking: function() {
            return this.get('level') >= 2;
        },

        isPatterning: function() {
            return this.get('level') >= 2;
        },

        isMasking: function() {
            return this.get('level') >= 3;
        },

        getTimer: function() {
            var secPerPerson,
                personNumbers = this.get('items').length;
            switch (this.get('level')) {
                case 3:
                    secPerPerson = 0.1;
                    break;
                case 2:
                    secPerPerson = 5;
                    break;
                default:
                case 1:
                    secPerPerson = 10;
                    break;
            }

            return secPerPerson * personNumbers * 1000;
        },

        randHash: function() {
            return Math.random().toString(36).substr(2);
        },

        shuffle: function(array) {
            var counter = array.length * 4 + Math.floor(Math.random() * (array.length - 1) + 1),
                temp,
                oldIndex,
                index;

            // While there are elements in the array
            while (counter > 0) {
                oldIndex = counter % array.length;
                // Pick a random index
                index = Math.floor(Math.random() * (array.length - 1));

                // And swap the last element with it
                temp = array[oldIndex];
                array[oldIndex] = array[index];
                array[index] = temp;

                // Decrease counter by 1
                counter--;
            }
        },

        getItems: function() {
            return this.get('items');
        },

        getQuestions: function() {
            return this.get('questions');
        },

        getAnswers: function() {
            return this.get('answers');
        },

        saveAnswer: function(current, isCorrect) {
            var answers = this.getAnswers();
            answers.push(
                $.extend(true, {
                    isCorrect: isCorrect
                }, current)
            );
            this.set('answers', answers);
        },

        getNext: function() {
            var questions = this.get('questions'),
                next = questions.shift();
            if (!questions.length) {
                this.gameOver();
                return null;
            }

            return next;
        },

        getCurrent: function() {
            var questions = this.get('questions');
            if (!questions.length) {
                return null;
            }

            return _.first(questions);
        },

        getRandom: function(max) {
            return Math.floor(Math.random() * (max - 1) + 1);
        },

        checkCurrent: function(hash) {
            var current = this.getCurrent(),
                isCorrect;

            if (!current) {
                return this.gameOver();
            }

            isCorrect = current.hash == hash;

            this.saveAnswer(current, isCorrect);

            this.trigger('answer', {
                current: current,
                isCorrect: isCorrect
            });
            if (isCorrect) {
                this.trigger('correct', current);
            } else {
                this.trigger('incorrect', current);
            }

            return isCorrect;
        },

        isPlaying: function() {
            return this.get('playing');
        },

        gameOver: function() {
            console.log('session over');
            var me = this;
            me.set('playing', false);

            console.log('save questions?');
            this.get('questions').forEach(function(current) {
                me.saveAnswer(current, false);
                me.trigger('answer', {
                    current: current,
                    isCorrect: false
                });
            });

            this.trigger('game:over', this.getAnswers());
        },

        gameEnd: function() {
            this.trigger('game:end');
        },

        destroy: function() {
            this.set('questions', []);
            this.set('items', []);
            this.set('answers', []);
            this._super("destroy");
        }
    });
});
