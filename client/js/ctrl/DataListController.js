var DataListController = {
    Import: function Import(id) {
        iWebSocket.send('C0501', { id: id, dataList: Importer.data });
    },
    onImport: function onImport(data) {
        var id = data.id;
        var DataListClass = dynamicMaker.getListClass(id);
        var dataList = new DataListClass(id);
        dataList.fromAbbArray(data.dataList, true);
        dataPool.set('dataList', id, dataList);

        tableDataView.renderImport(id);
    },
};

