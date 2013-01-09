var ColumnController = {
    onCreate: function onCreate(data) {
        var columnList = dataPool.get('columnList', data.listId);
        var column = new Column();
        column.fromAbbArray(data.column);

        columnList.insert(column);
        tableDefineView.renderAddColumn(data.listId, column);
    },
    onUpdate: function onUpdate(data) {
        var columnList = dataPool.get('columnList', data.listId);
        var column = columnList.get(data.id);
        column.fromAbbArray(data.column);

        tableDefineView.renderColumnName(data.listId, column);
        tableDefineView.renderColumnIsPK(data.listId, column);
        tableDefineView.renderColumnAllowEmpty(data.listId, column);
        tableDefineView.renderColumnType(data.listId, column);
        tableDefineView.renderColumnClient(data.listId, column);
        tableDefineView.renderColumnServer(data.listId, column);
        tableDefineView.renderColumnDescription(data.listId, column);
    },
};
