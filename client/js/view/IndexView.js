var IndexView = function IndexView() {
    this.render = function render() {
        var html = Renderer.make('Index');
        $('body').html(html);
    };
    this.newTableDefine = function newTableDefine() {
        var table = new Table();
        table.create();
    };
    /*
    openCreateTableStructurePanel: function openCreateTableStructurePanel() {
        TableController.openCreateTableStructurePanel();
    },
    getTableList: function getTableList() {
        TableController.getTableList();
    },
    clearContent: function clearContent() {
        $('#Content').empty();
    },
    */
};
