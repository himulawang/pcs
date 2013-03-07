var IndexView = function IndexView() {
    this.render = function render() {
        var html = Renderer.make('Index');
        $('body').html(html);
    };
    this.newTableDefine = function newTableDefine() {
        var table = new I.Models.Table();
        table.create();
    };
    this.newExporterDefine = function newExporterDefine() {
        var exporter = new I.Models.Exporter();
        exporter.create();
    };
    this.clearContent = function clearContent() {
        $('#Content').empty();
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
