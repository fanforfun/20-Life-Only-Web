define('view/game', ['backbone', 'view/pattern'], function(B, Pattern) {
    'use strict';

    return B.View.extend({
        initialize: function() {

            this.render();
        },

        render: function() {
            console.log('render parent');
            this.$el.show();
            this.$('.game-screen-' + this.model.get('screen')).show();

            this.pattern = new Pattern({
                el: this.$('.pattern')
            });
        },

        destroy: function() {
            this.$('.game-screen-' + this.model.get('screen')).hide();
            this.$el.hide();
            this.pattern.destroy();
            this.pattern = null;

            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }

    });
});
