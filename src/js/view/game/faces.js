define('view/game/faces', ['view/game', 'view/pattern', 'view/mask'], function(Game, Pattern, Mask) {
    'use strict';

    return Game.extend({
        initialize: function() {
            var model = this.model;

            this._super("initialize");
            this.listenTo(this.model, 'correct', this.onCorrect);
            this.listenTo(this.model, 'incorrect', this.onIncorrect);
            this.listenTo(this.model, 'answer', this.showAnswer);
            this.listenTo(this.model, 'game:over', this.onGameOver);
            this.listenTo(this.model, 'level:new', this.renderFaces);

            console.log('game faces');

        },

        events: {
            'click .element': 'onSelectElement',
            'click .skip': 'onSkip'
        },

        /**
         * @override
         */
        renderFaces: function() {
            var me = this,
                $el = this.$('.game-screen-' + this.model.get('screen')),
                $pattern;

            $el.find('.faces__list_wrap').empty();
            setTimeout(function() {

            }, 400);
            this.renderTemplate(
                $el.find('.faces__list_wrap'),
                $el.find('.game__template_face').text(),
                {
                    questions: this.model.getVisualQuestions(),
                    question: this.model.getCurrent(),
                    timer: this.model.getTimer() / 1000
                }
            );

            $pattern = $el.find('.pattern');

            if (this.model.isPatterning() && $pattern.length && !this.pattern) {
                this.pattern = new Pattern({
                    el: $pattern
                });
            }

            if (this.model.isMasking()) {
                this.$('.img_face').each(function(key, item) {
                    me.masks.push(
                        new Mask({
                            el: $(item)
                        })
                    );
                });
            }

            setTimeout(function() {
                $el.find('.faces__list').css({
                    width: me.model.getQuestions().length < 11 ? '70%' : '70%'
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
                    question: this.model.getCurrent(),
                    timer: this.model.getTimer() / 1000
                }
            );

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
                time = (3000 - this.model.getRandom(6) * 100) / this.model.getSpeedKoef();

            $someEl.stop().animate({
                top: shiftY + 'px',
                left: shiftX + 'px'
            }, Math.ceil(time),
            function() {
                me.shakingFaces();
            });
        },

        startTimer: function() {
            this.whenTimerDies = +(new Date()) + this.model.getTimer();
            var me = this,
                timer = this.whenTimerDies,
                isAnimated = false,
                lastSecs = 5,
                $timer = me.$('.timer');
            this.interval = setInterval(function() {
                var current = +(new Date()),
                    last = me.whenTimerDies - current,
                    timeLast = (last / 1000).toFixed(1);

                if (timer < me.whenTimerDies) {
                    console.log('timer increase!', timeLast);
                    $timer.stop().animate({
                        'font-size': '+=2px'
                    }, 200, 'easeOutElastic');

                } else if (timer > me.whenTimerDies) {
                    $timer.stop().animate({left : '3', top: '1vw'},30)
                        .animate({left : '-3', top: '3vw'},30)
                        .animate({left : '1', top: '0vw'},30).
                        animate({left : '-1', top: '3vw'},30)
                        .animate({left: '0', top: '2vw'},30);
                    console.log('timer descrease!', timeLast);
                }
                timer = me.whenTimerDies;

                $timer.html(timeLast < 0.1 ? '' : timeLast);

                if (last <= 0 || !me.model.isPlaying()) {
                    console.log('time out!');
                    clearInterval(me.interval);
                    me.model.gameOver(true);
                    return;
                }

                if (!isAnimated && last <= lastSecs * 1000) {
                    console.log('last ' + lastSecs + ' secs!');
                    $timer.stop().animate({
                        'font-size': '+=3vw'
                    }, lastSecs * 1000, 'easeOutElastic');
                    isAnimated = true;
                }
            }, 50);
        },

        onGameOver: function () {
            this.$('.name_question').hide();
            this.$('.skip').hide();
            this.$('.timer').hide();
            this._super('onGameOver');
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
            this.whenTimerDies += 4 * 1000;

            this.showNew(current);
        },

        onIncorrect: function(current) {
            console.log('incorrect');
            this.whenTimerDies -= 3 * 1000;

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
