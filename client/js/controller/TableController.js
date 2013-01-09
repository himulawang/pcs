var TableController = {
    onCreate: function onCreate(data) {
        var table = new Table();
        table.fromAbbArray(data.table);
        tableList.insert(table);

        tableListView.renderCreate(table);
        tableDefineView.renderAll(table);
    },
    onUpdate: function onUpdate(data) {
        var table = dataPool.get('tableList', 0).get(data.id);
        table.fromAbbArray(data.table);

        tableListView.renderTableName(table);
        tableDefineView.renderTableName(table);
        tableDefineView.renderTableDescription(table);
    },
};
