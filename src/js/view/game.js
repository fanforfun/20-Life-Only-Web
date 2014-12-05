define('view/game', ['view/pattern', 'view/template', 'view/mask'], function(Pattern, BaseView, Mask) {
    'use strict';

    return BaseView.extend({
        initialize: function() {

            this.render();
        },

        renderMain: function ($el) {
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
                    new Mask({
                        el: $(item)
                    });
                });
            }

            this.$el.show();
        },

        destroy: function() {
            this.$('.game-screen-' + this.model.get('screen')).hide();
            this.$el.hide();
            if ( this.pattern) {
                this.pattern.destroy();
                this.pattern = null;
            }
            this.model = null;

            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }

    });
});
