var IndexView = Backbone.View.extend({
    tagName: 'div',
    render: function renderIndex() {
        this.$el.html(Renderer.make('Index'));
        $('body').html(this.el);
    },
    openCreateTableStructurePanel: function openCreateTableStructurePanel() {
        TableController.openCreateTableStructurePanel();
    },
    getTableList: function getTableList() {
        TableController.getTableList();
    },
    clearContent: function clearContent() {
        $('#Content').empty();
    },
});
