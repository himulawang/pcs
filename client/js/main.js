var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'pcs';

/* websocket */
var iWebSocket;

$(function() {
    /* view */
    window.indexView = new IndexView();
    window.tableListView = new TableListView();
    /*
    window.dialogView = new DialogView();
    window.createTableStructureView = new CreateTableStructureView();
    window.createTableStructureOptionView = new CreateTableStructureOptionView();
    window.modifyTableStructureView = new ModifyTableStructureView();
    window.modifyTableStructureOptionView = new ModifyTableStructureOptionView();
    */
    indexView.render();

    /* model */
    tableList = new TableList(0);

    NetController.Connect(function() {
        tableList.retrieve();
    });

});
