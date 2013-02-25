var ColumnController = {
    onCreate: function onCreate(data) {
        var columnList = dataPool.get('columnList', data.listId);
        var column = new I.Models.Column();
        column.fromAbbArray(data.column);

        columnList.set(column);
        tableDefineView.renderAddColumn(data.listId, column);

        var orm = dynamicMaker.makeOrm(data.listId);
        dynamicMaker.makeModelClass(orm);
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
    onRemove: function onRemove(data) {
        var columnList = dataPool.get('columnList', data.listId);
        columnList.unset(data.id);

        tableDefineView.renderRemoveColumn(data.listId, data.id);

        var orm = dynamicMaker.makeOrm(data.listId);
        dynamicMaker.makeModelClass(orm);
    },
};
