var TableController = {
    onCreate: function onCreate(data) {
        var table = new I.Models.Table();
        table.fromAbbArray(data.table);
        dataPool.get('tableList', 0).set(table);

        var pk = table.id;
        var columnList = new I.Models.ColumnList(pk);
        columnList.fromAbbArray(data.columnList);
        dataPool.set('columnList', pk, columnList);

        tableListView.renderCreate(table);
        tableDefineView.renderAll(table);
    },
    onUpdate: function onUpdate(data) {
        var table = dataPool.get('tableList', 0).get(data.id);
        table.fromAbbArray(data.table, true);

        tableListView.renderTableName(table);
        tableDefineView.renderTableName(table);
        tableDefineView.renderTableDescription(table);
    },
};
