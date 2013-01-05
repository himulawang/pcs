var TableListView = Backbone.View.extend({
    tagName: 'div',
    render: function render(data) {
        this.$el.html(Renderer.make('TableList', data));
        $('#TableTabBody').empty().html(this.el);
    },
    getTableStructure: function getTableStructure(tableId) {
        TableController.getTableStructure(tableId);
    },
});
