var ExporterListController = {
    onRetrieve: function onRetrieve(data) {
        var exporterList = new I.Models.ExporterList(0);
        exporterList.fromAbbArray(data.exporterList, true);
        dataPool.set('exporterList', 0, exporterList);
        exporterListView.renderAll();
    },
    refreshData: function refreshData(data) {
        var exporterList = dataPool.get('exporterList', 0);
        for (var exporterId in data.exporterList) {
            var exporter = exporterList.get(exporterId);
            exporter.fromAbbArray(data.exporterList[exporterId]);
        }
    },
};

