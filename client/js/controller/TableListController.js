var TableListController = {
    onRetrieve: function onRetrieve(data) {
        var tableList = new I.Models.TableList(0);
        tableList.fromAbbArray(data.tableList, true);
        dataPool.set('tableList', 0, tableList);
        tableListView.renderAll();

        var columnList = new I.Models.ColumnList(0);
        for (var id in tableList.list) {
            columnList.retrieve(id);
        }
    },
};
