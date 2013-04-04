var DialogView = function DialogView() {
    this.el = null;
    this.getEl = function getEl() {
        if (this.el === null) this.el = $('#Dialog');
        return this.el;
    };
    this.renderDeleteTableConfirm = function renderDeleteTableConfirm(id) {
        var table = dataPool.get('tableList', 0).get(id);
        var data = { table: table };
        var html = Renderer.make('DialogDeleteTableConfirm', data);
        this.getEl().html(html).modal('show');
    };
    this.renderDeleteExporterConfirm = function renderDeleteExporterConfirm(id) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        var data = { exporter: exporter };
        var html = Renderer.make('DialogDeleteExporterConfirm', data);
        this.getEl().html(html).modal('show');
    };
    this.renderDeleteDataRowConfirm = function renderDeleteDataRowConfirm(tableId, rowId) {
        var data = { tableId: tableId, rowId: rowId };
        var html = Renderer.make('DialogDeleteDataRowConfirm', data);
        this.getEl().html(html).modal('show');
    };
    this.renderImportTableData = function renderImportTableData(id) {
        Importer.data = [];
        var table = dataPool.get('tableList', 0).get(id);
        var data = { table: table };
        var html = Renderer.make('DialogImportTableData', data);
        this.getEl().html(html).modal('show');
    };
    this.renderDeleteExporterDefineTableConfirm = function renderDeleteExporterDefineTableConfirm(exporterId, level, tableId, blockId) {
        var table = dataPool.get('tableList', 0).get(tableId);
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        var data = { exporter: exporter, level: level, table: table, blockId: blockId };
        var html = Renderer.make('DialogDeleteExporterDefineTableConfirm', data);
        this.getEl().html(html).modal('show');
    };
    this.renderDeleteExporterDefineLevelConfirm = function renderDeleteExporterDefineLevelConfirm(id, level) {
        var data = { id: id, level: level };
        var html = Renderer.make('DialogDeleteExporterDefineLevelConfirm', data);
        this.getEl().html(html).modal('show');
    };
    this.renderAllToServerResults = function renderAllToServerResults(results) {
        var data = { results: results };
        var html = Renderer.make('DialogAllToServerResults', data);
        this.getEl().html(html).modal('show');
    };
    this.renderRestore = function renderRestore() {
        var html = Renderer.make('DialogRestore');
        this.getEl().html(html).modal('show');
    };
};
