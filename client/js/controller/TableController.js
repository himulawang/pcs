var TableController = {
    getTableList: function getTableList() {
        new LogicController().add({
            fn: tableList.getTableListData,
            imports: {},
            exports: { tableListData: 'tableListData' },
        }).add({
            fn: tableListView.render,
            imports: { _tableListData: null },
            exports: {},
        }).next();
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
    openCreateTableStructurePanel: function openCreateTableStructurePanel() {
        new LogicController().add({
            fn: createTableStructureView.render,
            imports: {},
            exports: {},
        }).add({
            fn: createTableStructureOptionView.render,
            imports: {},
            exports: {},
        }).next();
    },
};
