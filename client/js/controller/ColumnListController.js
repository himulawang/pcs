var ColumnListController = {
    onGet: function onGet(data) {
        var columnList = new I.Models.ColumnList(data.id);
        columnList.fromAbbArray(data.columnList);

        dataPool.set('columnList', data.id, columnList);
    },
};

