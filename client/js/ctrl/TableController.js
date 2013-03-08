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

        dynamicMaker.make(pk);
    },
    onUpdate: function onUpdate(data) {
        var table = dataPool.get('tableList', 0).get(data.id);
        table.fromAbbArray(data.table, true);

        tableListView.renderTableName(table);
        tableDefineView.renderTableName(table);
        tableDefineView.renderTableDescription(table);
        exporterDefineView.renderTableName(table);
    },
    remove: function remove(id) {
        dataPool.get("tableList", 0).get(id).remove(id);
    },
    onRemove: function onRemove(data) {
        var id = data.id;
        // table
        var tableList = dataPool.get('tableList', 0);
        tableList.unset(id);

        // columnList
        dataPool.unset('columnList', id);

        // dataList
        dataPool.unset('dataList', id);

        tableListView.renderRemoveTable(id);
        tableDefineView.renderRemoveTable(id);
        tableDataView.renderRemoveTable(id);
    },
};
