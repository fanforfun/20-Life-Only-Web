define('view/main', ['jquery','view/template', 'view/pattern'], function($, BaseView, Pattern) {
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
                checked = 'radio_element_checked';
            if ($el.hasClass(checked)) {
                return;
            }

            $el.closest('.radio').find('.radio_element').removeClass(checked);
            $el.addClass(checked);
        },

        start: function(e) {
            var $el = $(e.target),
                mode = $el.data('id'),
                cond =  this.$('.settings_filter').find('.radio_element_checked').data('id'),
                difficulty =  this.$('.settings_difficulty').find('.radio_element_checked').data('id');

            mode = parseInt(mode, 10);
            cond = parseInt(cond, 10);
            difficulty = parseInt(difficulty, 10);

            this.model.gameStart(mode, cond, difficulty);
        },

        _onGameStart: function() {
            this.pattern.destroy();
            this.pattern = null;
            this.$el.hide();
        },

        _onGameOver: function() {
            //this.$el.show();
            this.render();
        },

        render: function() {
            this.$el.slideDown(500);
            this.renderTemplate(
                this.$('.header__text'),
                this.$('.header__template').text(),
                {
                    isProgressWell: false,
                    knownPercent: 30
                }
            );

            this.pattern = new Pattern({
                el: this.$('.pattern')
            });
        }
    });
});
