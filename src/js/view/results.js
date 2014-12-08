define('view/results', ['jquery', 'view/template', 'view/pattern', 'underscore'], function($, BaseView, Pattern, _) {
    'use strict';

    return BaseView.extend({
        initialize: function() {
            this.render();
        },

        events: {
            'click': 'onClick'
        },

        onClick: function () {
            this.model.close();

            this.destroy();
        },

        render: function() {
            var me = this,
                top = this.model.getCurrentTop();

            me.$el.show();
            console.log('results!');
            this.$('.results__overlay').animate({
                    opacity: 0.9
                }, 1300,
                function () {
                    me.renderTemplate(
                        me.$('.results__content'),
                        me.$('.template').text(),
                        {
                            top: top,
                            isTop: top.length,
                            correct: me.model.getCorrectAnswerNumbers(),
                            all: me.model.getAnswerNumbers()
                        }
                    );
                }
            );
        },

        destroy: function() {
            var me = this;
            this.$('.results__overlay').animate({
                opacity: 0
            }, 1000, function (){
                me.$el.hide();
                me.$('.results__content').empty();
            });

            this.unbind();
            this.stopListening();
            this.undelegateEvents();
        }
    });
});
