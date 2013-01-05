var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'pcs';

// init on ready
var view, tab, table, importer, graph, exporter, eventExporter, uiExporter, fs;

// init on using
var canvas;

/* websocket */
var iWebSocket;

$(function() {
    /* view */
    window.indexView = new IndexView();
    window.dialogView = new DialogView();
    window.tableListView = new TableListView();
    window.createTableStructureView = new CreateTableStructureView();
    window.createTableStructureOptionView = new CreateTableStructureOptionView();
    window.modifyTableStructureView = new ModifyTableStructureView();
    window.modifyTableStructureOptionView = new ModifyTableStructureOptionView();
    indexView.render();

    /* model */
    tableList = new TableList();

    NetController.Connect(function() {
        TableController.GetTableList();
    });
});
