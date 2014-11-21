define('view/main', ['backbone', 'jquery'], function(B, $) {
    'use strict';

    return B.View.extend({
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

            this.$('.radio_element').removeClass(checked);
            $el.addClass(checked);
        },

        start: function(e) {
            var $el = $(e.target),
                mode = $el.data('id');

            this.model.gameStart(mode);
        },

        _onGameStart: function() {
            this.$el.hide();
        },

        _onGameOver: function() {
            this.$el.show();
        },

        render: function() {

        }
    });
});
