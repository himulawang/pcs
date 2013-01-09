var TableListController = {
    onRetrieve: function onRetrieve(data) {
        var tableList = new TableList(0);
        tableList.fromAbbArray(data.tableList);
        dataPool.set('tableList', 0, tableList);
        tableListView.renderAll();

        var columnList = new ColumnList(0);
        for (var id in tableList.list) {
            columnList.retrieve(id);
        }
    },
};
