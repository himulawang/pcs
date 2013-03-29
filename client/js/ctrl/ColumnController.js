var ColumnController = {
    onCreate: function onCreate(data) {
        var columnList = dataPool.get('columnList', data.listId);
        var column = new I.Models.Column();
        column.fromAbbArray(data.column);

        columnList.set(column);
        tableDefineView.renderAddColumn(data.listId, column);

        var orm = dynamicMaker.makeOrm(data.listId);
        dynamicMaker.makeModelClass(orm);

        var table = dataPool.get('tableList', 0).get(data.listId);
        exporterDefineView.renderColumnCreate(table, column);
    },
    onUpdate: function onUpdate(data) {
        var columnList = dataPool.get('columnList', data.listId);
        var column = columnList.get(data.id);
        column.fromAbbArray(data.column);

        tableDefineView.renderColumnName(data.listId, column);
        tableDefineView.renderColumnIsPK(data.listId, column);
        tableDefineView.renderColumnAllowEmpty(data.listId, column);
        tableDefineView.renderColumnType(data.listId, column);
        tableDefineView.renderColumnDescription(data.listId, column);

        tableDataView.renderColumnNameChange(data.listId, column);
        tableDataView.renderColumnTypeChange(data.listId, column);

        exporterDefineView.renderColumnNameChange(column);
    },
    onRemove: function onRemove(data) {
        var columnList = dataPool.get('columnList', data.listId);
        columnList.unset(data.id);

        tableDefineView.renderRemoveColumn(data.listId, data.id);

        var orm = dynamicMaker.makeOrm(data.listId);
        dynamicMaker.makeModelClass(orm);

        ExporterListController.refreshData(data);

        exporterDefineView.renderRemoveColumn(data.id);
    },
};
