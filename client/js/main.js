var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'pcs';

/* websocket */
var iWebSocket;

$(function() {
    /* view */
    window.indexView = new IndexView();
    indexView.render();
    window.tableListView = new TableListView();
    window.tableDefineView = new TableDefineView();
    window.dialogView = new DialogView();
    window.dynamicMaker = new DynamicMaker();
    /*
    window.createTableStructureView = new CreateTableStructureView();
    window.createTableStructureOptionView = new CreateTableStructureOptionView();
    window.modifyTableStructureView = new ModifyTableStructureView();
    window.modifyTableStructureOptionView = new ModifyTableStructureOptionView();
    */

    
    /* data */
    window.dataPool = new I.DataPool();

    NetController.Connect(function() {
        new I.Models.TableList(0).retrieve();
    });
});
