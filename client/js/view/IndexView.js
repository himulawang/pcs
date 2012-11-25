var IndexView = Backbone.View.extend({
    tagName: 'div',
    id: 'index',
    className: 'container-fluid',
    render: function renderIndex() {
        this.$el.html(Renderer.make('index'));
        $('body').html(this.el);
        this.delegateEvents();
    },
    events: {
        'click #btnTableList': 'getTableList',
    },
    getTableList: function() {
        TableController.getTableList();
    },
});
