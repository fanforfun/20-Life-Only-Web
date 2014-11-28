define('model/session', ['backbone', 'jquery'], function(B, $) {
    'use strict';

    return B.Model.extend({
        initialize: function() {
            var items = this.get('items'),
                questions,
                me = this;

            items.forEach(function(item) {
                item.hash = me.randHash() + me.randHash();
            });

            questions = items.slice(0);
            this.shuffle(questions);
            this.set('questions', questions);

            this.shuffle(items);
            this.set('items', items);
        },

        randHash: function () {
            return Math.random().toString(36).substr(2);
        },

        shuffle: function(array) {
            var counter = array.length * 2 + Math.floor(Math.random() * (array.length - 1) + 1),
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

        getNext: function() {
            var questions = this.get('questions');
            if (!questions.length) {
                return null;
            }

            return questions.shift();
        },

        gameOver: function() {
            console.log('session game over');
            this.trigger('game:over');
        }
    });
});
