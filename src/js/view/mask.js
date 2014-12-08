define('view/mask', ['backbone', 'jquery'], function(B, $) {
    'use strict';

    return B.View.extend({
        initialize: function() {
            this.render();
        },

        render: function() {
            var rules = {},
                rand,
                $el = this.$el.closest('li');

            rand = Math.ceil(Math.random() * 10) + 1;
            $el.addClass('filter-' + rand);

            rand = Math.ceil(Math.random() * 10) + 1;
            $el.addClass('rotate-' + rand);
        },

        destroy: function() {
            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }
    });
});
