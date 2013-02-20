exports.ColumnController = {
    Create: function Create(connection, api, params) {
        var listId = params.listId;
        var columnList = dataPool.get('columnList', listId);
        var pk = dataPool.get('column', 'PK').incr();

        var column = new I.Models.Column();
        column.setPK(pk);
        column.markAddSync();
        columnList.addSync(column);

        var data = {
            id: pk,
            listId: listId,
            column: column.toAbbArray(),
        };
        connectionPool.broadcast(api, data);

        /*
        // if tableData exists change it
        var dataList = dataPool.get('dataList', listId);
        if (dataList === undefined) return;

        var rawData = dataList.toAbbArray();
        var newColumnAbb = 'c' + I.Util.getLength(columnList.list);
        // add new column to raw data
        for (var i in rawData) {
            rawData[i][newColumnAbb] = '';
        }

        // regenerate class
        I.Lib.DynamicMaker.make(listId);

        var DataListClass = I.Lib.DynamicMaker.getListClass(listId);
        newDataList = new DataListClass(listId);
        newDataList.fromAbbArray(rawData, true);
        */
    },
    Update: function Update(connection, api, params) {
        var columnList = dataPool.get('columnList', params.listId);
        var column = columnList.get(params.id);
        column.fromAbbArray(params.column); 
        columnList.updateSync(column);

        var data = {
            listId: params.listId,
            id: column.id,
            column: column.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Remove: function Remove(connection, api, params) {
        var columnList = dataPool.get('columnList', params.listId);
        columnList.delSync(params.id);

        var data = {
            listId: params.listId,
            id: params.id,
        };
        connectionPool.broadcast(api, data);
    },
};
