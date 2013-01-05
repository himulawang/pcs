var DialogView = Backbone.View.extend({
    tagName: 'div',
    id: 'Dialog',
    className: 'modal hide fade',
    renderException: function renderException(data) {
        data = data || {};
        this.$el.html(Renderer.make('DialogException', data));
        $('#DialogPanel').html(this.el)
        $('#Dialog').modal();
    },
});

