var ColumnListController = {
    onRetrieve: function onRetrieve(data) {
        var columnList = new I.Models.ColumnList(data.id);
        columnList.fromAbbArray(data.columnList, true);

        dataPool.set('columnList', data.id, columnList);
    },
};

