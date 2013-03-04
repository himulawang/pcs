exports.DataController = {
    Create: function Create(connection, api, params) {
    },
    Update: function Update(connection, api, params) {
        var dataList = dataPool.get('dataList', params.tableId);
        var data = dataList.get(params.dataId);
        data.fromAbbArray(params.data);
        dataList.updateSync(data);

        var data = {
            tableId: params.tableId,
            columnId: params.columnId,
            dataId: params.dataId,
            data: params.data,
        };
        connectionPool.broadcast(api, data);
    },
    Remove: function Remove(connection, api, params) {
    },
};
