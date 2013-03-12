var ExporterController = {
    onCreate: function onCreate(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = new I.Models.Exporter();
        exporter.fromAbbArray(data.exporter);

        exporterList.set(exporter);

        exporterListView.renderCreate(exporter);
    },
    onUpdate: function onUpdate(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(data.id);
        exporter.fromAbbArray(data.exporter, true);

        exporterListView.renderExporterName(exporter);
        exporterDefineView.renderExporterUpdate(exporter);
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
    onUpdateRootTable: function onUpdateRootTable(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(data.id);
        exporter.fromAbbArray(data.exporter, true);

        exporterDefineView.renderRootTable(exporter);
    },
    AddBlock: function AddBlock(id, level, tableId) {
        iWebSocket.send('C0902', { id: id, level: level, tableId: tableId });
    },
    onAddBlock: function onAddBlock(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(data.id);

        exporter.fromAbbArray(data.exporter, true);

        exporterDefineView.renderAddBlock(exporter, data.level, data.tableId, data.blockId);
    },
    RemoveBlock: function RemoveBlock(exporterId, level, blockId) {
        iWebSocket.send('C0903', { id: exporterId, level: level, blockId: blockId });
    },
    onRemoveBlock: function onRemoveBlock(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(data.id);

        exporter.fromAbbArray(data.exporter, true);

        exporterDefineView.renderRemoveBlock(exporter, data.level, data.blockId);
    },
    RootTableRenameChange: function RootTableRenameChange(exporterId, columnId, rename) {
        iWebSocket.send('C0904', { id: exporterId, columnId: columnId, rename: rename });
    },
    onRootTableRenameChange: function onRootTableRenameChange(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(data.id);

        exporter.fromAbbArray(data.exporter, true);

        exporterDefineView.renderRootTableRenameChange(exporter, data.level, data.blockId);
    },
};
