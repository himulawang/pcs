var DataController = {
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
        var data = dataList.get(dataId);
        data.fromAbbArray(data.data, true);

        tableDataView.renderDataChange(tableId, dataId, columnId, data);
    },
};
