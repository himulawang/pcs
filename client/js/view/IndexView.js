var IndexView = Backbone.View.extend({
    tagName: 'div',
    className: 'row-fluid',
    render: function renderIndex() {
        this.$el.html(Renderer.make('Index'));
        $('body').html(this.el);
        this.delegateEvents();
    },
    events: {
        'click #Refresh-TableList-Button': 'getTableList',
    },
    getTableList: function() {
        TableController.getTableList();
    },
});
