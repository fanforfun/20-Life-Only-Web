define('view/main', ['jquery', 'view/template', 'view/pattern', 'underscore'], function($, BaseView, Pattern, _) {
    'use strict';

    return BaseView.extend({
        initialize: function() {
            console.log('main');
            this.listenTo(this.model, 'game:start', this._onGameStart);
            this.listenTo(this.model, 'game:over', this._onGameOver);

            this.render();
        },

        events: {
            'click .radio_element': '_onSettingsChange',
            'click .mode_start': 'start'
        },

        _onSettingsChange: function(e) {
            var $el = $(e.target),
                checked = 'radio_element__checked',
                $parent,
                key;
            if ($el.hasClass(checked) || $el.hasClass('radio_element__disabled')) {
                return;
            }
            $parent = $el.closest('.radio');

            key = $parent.attr('class').replace('radio', '').replace('settings_', '').trim();
            this.model.saveSetting(key, $el.data('id'));

            $parent.find('.radio_element').removeClass(checked);
            $el.addClass(checked);
        },

        start: function(e) {
            var $el = $(e.target),
                mode = $el.data('id'),
                settings = this.model.getSettings(),
                cond =  settings.filter,
                difficulty =  settings.difficulty;

            mode = parseInt(mode, 10);
            cond = parseInt(cond, 10);
            difficulty = parseInt(difficulty, 10);

            this.model.gameStart(mode, cond, difficulty);
        },

        _onGameStart: function() {
            if (this.pattern) {
                this.pattern.destroy();
            }
            this.pattern = null;
            this.$el.hide();
        },

        _onGameOver: function() {
            //this.$el.show();
            this.render();
        },

        render: function() {
            return this.model.gameStart(3, 1, 1);
            var me = this,
                settings = this.model.getSettings(),
                stats = this.model.getStats(),
                params;

            if (stats.all == 0) {
                params = {
                    isAllKnown: false,
                    isProgressWell: false,
                    isHardcore: false,
                    knownPercent: 0,
                    known: 0,
                    all: 0,
                    aaa: 0,
                    aa: 0,
                    incorrect: 0
                };
            } else {
                params = {
                    all: stats.all,
                    knownPercent: Math.floor(stats.correct / stats.all * 100),
                    known: stats.correct,
                    aaa: Math.floor(stats.aaa.correct / stats.aaa.all * 100),
                    aa: Math.floor(stats.aa.correct / stats.aa.all * 100),
                    incorrect:  Math.ceil(stats.incorrect / stats.all * 100)
                };
                params.isAllKnown = (params.known == params.all);
                params.isProgressWell = (params.known > 9);
                params.isFifty = params.known > 40; //TODO in model
                params.isHardcore = false;
            }

            this.renderTemplate(
                this.$('.screen'),
                this.$('.template').text(),
                params
            );

            _.each(settings, function(value, key) {
                var $el = me.$('.settings_' + key).find('[data-id=' + value + ']');
                if ($el.hasClass('radio_element__disabled')) {
                    value -= 1;
                    $el = me.$('.settings_' + key).find('[data-id=' + value + ']');
                    me.model.saveSetting(key, value);
                }
                $el.addClass('radio_element__checked');
            });

            this.$el.slideDown(500);

            this.pattern = new Pattern({
                el: this.$('.pattern')
            });
        }
    });
});
