var TableListView = Backbone.View.extend({
    tagName: 'div',
    //id: 'tabTableList',
    render: function renderTableList(tableListData) {
        tableListView.$el.html(Renderer.make('TabTableList', tableListData));
        $('#tabTable').empty().html(tableListView.el);
    },
    getTableStructure: function getTableStructure(tableId) {
        TableController.getTableStructure(tableId);
    },
});
