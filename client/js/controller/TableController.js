var TableController = {
    onCreate: function onCreate(data) {
        var table = new I.Models.Table();
        table.fromAbbArray(data.table);
        dataPool.get('tableList', 0).set(table);

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
