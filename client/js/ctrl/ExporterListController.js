var ExporterListController = {
    onRetrieve: function onRetrieve(data) {
        var exporterList = new I.Models.ExporterList(0);
        exporterList.fromAbbArray(data.exporterList, true);
        dataPool.set('exporterList', 0, exporterList);
        exporterListView.renderAll();
    },
};

