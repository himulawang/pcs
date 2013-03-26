var DataController = {
    Create: function Create(tableId) {
        iWebSocket.send('C0601', { tableId: tableId, });
    },
    onCreate: function onCreate(data) {
        var tableId = data.tableId;
        var dataList = dataPool.get('dataList', tableId);
        /*
        var preDataList = dataPool.get('dataList', tableId);

        if (preDataList) {
            var dataList = preDataList;
        } else {
            var DataListClass = dynamicMaker.getListClass(tableId);
            var dataList = new DataListClass(tableId);
        }
        */
        var DataModelClass = dynamicMaker.getModelClass(tableId);
        var newData = new DataModelClass();
        newData.fromAbbArray(data.data, true);
        dataList.set(newData);

        tableDataView.renderDataCreate(tableId, newData);
    },
    Update: function Update(tableId, columnId, data) {
        iWebSocket.send('C0602', { 
            tableId: tableId,
            dataId: data.c0,
            columnId: columnId,
            data: data.toAbbDiff(),
        });
    },
    onUpdate: function onUpdate(data) {
        var tableId = data.tableId;
        var dataId = data.dataId;
        var columnId = data.columnId;
        var dataList = dataPool.get('dataList', tableId);
        var preData = dataList.get(dataId);
        preData.fromAbbArray(data.data, true);

        tableDataView.renderDataUpdate(tableId, dataId, columnId, preData);
    },
    Remove: function Remove(tableId, rowId) {
        iWebSocket.send('C0603', {
            tableId: tableId,
            rowId: rowId,
        });
    },
    onRemove: function onRemove(data) {
        var tableId = data.tableId;
        var rowId = data.rowId;
        var dataList = dataPool.get('dataList', tableId);
        dataList.unset(rowId);

        tableDataView.renderDataRemove(tableId, rowId);
    },
};
