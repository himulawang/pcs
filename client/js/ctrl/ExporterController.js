var ExporterController = {
    onCreate: function onCreate(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = new I.Models.Exporter();
        exporter.fromAbbArray(data.exporter);

        exporterList.set(exporter);

        exporterListView.renderCreate(exporter);
    },
    onUpdate: function onUpdate(data) {
    },
    remove: function remove(id) {
        dataPool.get("exporterList", 0).get(id).remove(id);
    },
    onRemove: function onRemove(data) {
        var id = data.id;
        var exporterList = dataPool.get('exporterList', 0);
        exporterList.unset(id);

        exporterListView.renderRemoveExporter(id);
    },
};

