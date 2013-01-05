var TableController = {
    GetTableList: function GetTableList() {
        tableList.retrieve();
    },
    onGetTableList: function onGetTableList(data) {
        tableListView.render(data);
    },
    CreateTable: function CreateTable(table, columnList) {
        params = {
            table: table,
            columnList: columnList,
        };
        
        iWebSocket.send('C0102', params);
    },
    onCreateTable: function onCreateTable(data) {
        indexView.clearContent();
    },
    openCreateTableStructurePanel: function openCreateTableStructurePanel() {
        createTableStructureView.render();
    },
    openModifyTableStructurePanel: function openModifyTableStructurePanel(id) {
        new LogicController().add({
            fn: table.getStructure,
            imports: { id: id },
            exports: { tableStructure: 'tableStructure' },
        }).add({
            fn: modifyTableStructureView.render,
            imports: { _tableStructure: null },
            exports: {},
        }).add({
            fn: modifyTableStructureOptionView.render,
            imports: { _tableStructure: null },
            exports: {},
        }).next();
    },
};
