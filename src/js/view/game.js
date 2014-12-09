define('view/game', ['view/pattern', 'view/template', 'view/mask'], function(Pattern, BaseView, Mask) {
    'use strict';

    return BaseView.extend({
        initialize: function() {
            this.masks = [];
            this.listenTo(this.model, 'game:over', this.onGameOver);
            this.render();
        },

        renderMain: function($el) {
            this.renderTemplate(
                $el.find('.game__content'),
                $el.find('.game__template').text(),
                {
                    model: this.model
                }
            );
        },

        render: function() {
            var me = this,
                $el = this.$('.game-screen-' + this.model.get('screen')),
                $pattern;
            console.log('render parent');

            $el.attr('class', $el.attr('class').replace(/\s*level-\d/g, ''));
            $el.addClass('level-' + this.model.get('level'));
            this.renderMain($el);

            $el.show();
            $pattern = $el.find('.pattern');

            if (this.model.isPatterning() && $pattern.length) {
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

            this.$el.show();
        },

        onGameOver: function() {
            console.log('game view over');
            if (this.pattern) {
                this.pattern.stop();
            }

            this.unbind();
            this.stopListening();
        },

        destroy: function() {
            this.$('.game-screen-' + this.model.get('screen')).hide();
            this.$el.hide();
            if (this.pattern) {
                this.pattern.destroy();
                this.pattern = null;
            }
            console.log('destroy game');
            this.model = null;

            this.masks.forEach(function(mask) {
                mask.destroy();
            });
            this.masks = [];

            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }

    });
});
