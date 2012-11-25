var TableListView = Backbone.View.extend({
    tagName: 'div',
    id: 'tabTableList',
    render: function renderTableList(tableListData, view) {
        view.$el.html(Renderer.make('tabTableList', tableListData));
        $('#tabTable').html(view.el);
        view.delegateEvents();
    },
    events: {
        //'click #btnTableList': 'getTableList',
    },
});

