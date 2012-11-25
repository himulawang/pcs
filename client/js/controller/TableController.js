var TableController = {
    getTableList: function getTableList() {
        new LogicController().add({
            fn: tableList.getTableListData,
            imports: {},
            exports: { tableListData: 'tableListData' },
        }).add({
            fn: tableListView.render,
            imports: { _tableListData: null, view: tableListView },
            exports: {},
        }).next();
    },
};
