var ExporterController = {
    updateExporter: function updateExporter(id, data) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        exporter.fromAbbArray(data, true);
        return exporter;
    },
    onCreate: function onCreate(data) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = new I.Models.Exporter();
        exporter.fromAbbArray(data.exporter);

        exporterList.set(exporter);

        exporterListView.renderCreate(exporter);
    },
    onUpdate: function onUpdate(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

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
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderRootTable(exporter);
    },
    AddLevel: function AddLevel(id) {
        iWebSocket.send('C0910', { id: id });
    },
    onAddLevel: function onAddLevel(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderAddLevel(exporter, data.level);
    },
    RemoveLevel: function RemoveLevel(id, level) {
        iWebSocket.send('C0911', { id: id, level: level });
    },
    onRemoveLevel: function onRemoveLevel(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderRemoveLevel(exporter, data.level);
    },
    AddBlock: function AddBlock(id, level, tableId) {
        iWebSocket.send('C0902', { id: id, level: level, tableId: tableId });
    },
    onAddBlock: function onAddBlock(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderAddBlock(exporter, data.level, data.tableId, data.blockId);
    },
    RemoveBlock: function RemoveBlock(exporterId, level, blockId) {
        iWebSocket.send('C0903', { id: exporterId, level: level, blockId: blockId });
    },
    onRemoveBlock: function onRemoveBlock(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderRemoveBlock(exporter, data.level, data.blockId);
    },
    RootTablePKChange: function RootTablePKChange(exporterId, columnId) {
        iWebSocket.send('C0906', { id: exporterId, columnId: columnId });
    },
    onRootTablePKChange: function onRootTablePKChange(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderRootTablePKChange(exporter, data.columnId);
    },
    RootTableChooseChange: function RootTableChooseChange(exporterId, columnId, checked) {
        iWebSocket.send('C0905', { id: exporterId, columnId: columnId, checked: checked });
    },
    onRootTableChooseChange: function onRootTableChooseChange(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderRootTableChooseChange(exporter, data.columnId, data.checked);
    },
    RootTableRenameChange: function RootTableRenameChange(exporterId, columnId, rename) {
        iWebSocket.send('C0904', { id: exporterId, columnId: columnId, rename: rename });
    },
    onRootTableRenameChange: function onRootTableRenameChange(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderRootTableRenameChange(exporter, data.columnId, data.rename);
    },
    TablePKChange: function TablePKChange(exporterId, blockId, columnId) {
        iWebSocket.send('C0907', { id: exporterId, blockId: blockId, columnId: columnId });
    },
    onTablePKChange: function onTablePKChange(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderTablePKChange(exporter, data.blockId, data.columnId);
    },
    TableChooseChange: function TableChooseChange(exporterId, blockId, columnId, checked) {
        iWebSocket.send('C0908', { id: exporterId, blockId: blockId, columnId: columnId, checked: checked });
    },
    onTableChooseChange: function onTableChooseChange(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderTableChooseChange(exporter, data.blockId, data.columnId, data.checked);
    },
    TableRenameChange: function TableRenameChange(exporterId, blockId, columnId, rename) {
        iWebSocket.send('C0909', { id: exporterId, blockId: blockId, columnId: columnId, rename: rename });
    },
    onTableRenameChange: function onTableRenameChange(data) {
        var exporter = this.updateExporter(data.id, data.exporter);

        exporterDefineView.renderTableRenameChange(exporter, data.blockId, data.columnId, data.rename);
    },
};
