exports.DataController = {
    Create: function Create(connection, api, params) {
        var id = params.tableId;
        var dataList = dataPool.get('dataList', id);
        var dataPK = dataPool.get('dataPK', id);

        var DataModelClass = I.Lib.DynamicMaker.getModelClass(id);
        var newData = new DataModelClass();
        newData.setPK(dataPK.incr());

        dataList.addSync(newData);

        var data = {
            tableId: id,
            data: newData.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
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
