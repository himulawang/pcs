var ColumnListController = {
    onRetrieve: function onRetrieve(data) {
        var columnList = new ColumnList(data.id);
        columnList.fromAbbArray(data.columnList);

        dataPool.set('columnList', data.id, columnList);
    },
};

