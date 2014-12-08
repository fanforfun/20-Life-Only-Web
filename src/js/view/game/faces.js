define('view/game/faces', ['view/game'], function(Game) {
    'use strict';

    return Game.extend({
        initialize: function() {
            var model = this.model;

            this._super("initialize");
            this.listenTo(this.model, 'correct', this.onCorrect);
            this.listenTo(this.model, 'incorrect', this.onIncorrect);
            this.listenTo(this.model, 'answer', this.showAnswer);

            console.log('game faces');

        },

        events: {
            'click .element': 'onSelectElement',
            'click .skip': 'onSkip'
        },

        /**
         * @override
         */
        renderMain: function($el) {
            var me = this;
            console.log('render faces');

            this.renderTemplate(
                $el.find('.game__content'),
                $el.find('.game__template').text(),
                {
                    questions: this.model.getItems(),
                    question: this.model.getCurrent(),
                    timer: this.model.getTimer() / 1000
                }
            );

            setTimeout(function() {
                $el.find('.faces__list').css({
                    width: me.model.getQuestions().length < 11 ? '60%' : '70%'
                });
                var top = $el.find('.faces').height() / 2 - $el.find('.faces__list').height() / 2;
                me.top = top;
                $el.find('.faces__list_wrap').animate({
                    top: top + 'px'
                }, 500, function() {
                    if (me.model.isShaking()) {
                        me.shakingFaces();
                    }
                });
            }, 100);

            this.startTimer();
        },

        shakingFaces: function() {
            if (!this.model || !this.model.isPlaying()) {
                return;
            }
            var me = this,
                $someEl = this.$('.faces__list_wrap'),
                maxWidth = Math.ceil($someEl.width() * 0.2),
                maxHeight = Math.ceil($someEl.height() * 0.4),
                randX = this.model.getRandom(maxWidth),
                randY = this.model.getRandom(maxHeight),
                shiftY = this.top + randY - maxHeight / 2,
                shiftX = randX - maxWidth / 2,
                time = 600 + this.model.getRandom(8) * 100 * this.model.getSpeedKoef();

            $someEl.stop().animate({
                top: shiftY + 'px',
                left: shiftX + 'px'
            }, Math.ceil(time),
            function() {
                me.shakingFaces();
            });
        },

        startTimer: function() {
            var me = this,
                time = +(new Date()) + this.model.getTimer(),
                isAnimated = false,
                lastSecs = 5,
                $timer = me.$('.timer');
            this.interval = setInterval(function() {
                var current = +(new Date()),
                    last = time - current,
                    timeLast = (last / 1000).toFixed(1);

                $timer.html(timeLast < 0.1 ? timeLast : '');

                if (last <= 0) {
                    console.log('time out!');
                    clearInterval(me.interval);
                    me.model.gameOver();
                    return;
                }

                if (!isAnimated && last <= lastSecs * 1000) {
                    console.log('last ' + lastSecs + ' secs!');
                    $timer.stop().animate({
                        'font-size': '+=5vw',
                        top: '-=2v'
                    }, lastSecs * 1000, 'easeOutBounce');
                    isAnimated = true;
                }
            }, 50);
        },

        onSelectElement: function(e) {
            var $target = $(e.target),
                hash;

            $target = $target.hasClass('element') ? $target : $target.closest('.element');
            if ($target.hasClass('answered')) {
                return;
            }

            hash = $target.data('hash');

            this.model.checkCurrent(hash);
        },

        onSkip: function(e) {
            var $target = $(e.target);

            this.model.checkCurrent(null);
        },

        onCorrect: function(current) {
            console.log('correct');

            this.showNew(current);
        },

        onIncorrect: function(current) {
            console.log('incorrect');

            this.showNew(current);
        },

        showAnswer: function(params) {
            var current = params.current,
                $correctOne = this.$('[data-hash=' + current.hash + ']');
            $correctOne.find('.img_face').animate({
                opacity: 0.2
            }, 700);
            $correctOne.addClass('answered');
            $correctOne.addClass(params.isCorrect ? 'correct' : 'incorrect');
            $correctOne.find('.name_answer').html(current.name);
        },

        showNew: function(current) {
            this.model.getNext();
            if (!this.model) {
                return;
            }
            var $el = this.$('.name_question'),
                newOne = this.model.getCurrent();

            if (newOne === null) {
                newOne = {
                    id: '',
                    name: ''
                };
            }

            $el.data('id', newOne.id);
            $el.html(newOne.name);
        },

        render: function() {
            console.log('render names');
            this._super("render");
        },

        destroy: function() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this._super("destroy");
        }
    });
});
