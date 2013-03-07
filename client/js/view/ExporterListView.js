var ExporterListView = function ExporterListView() {
    this.el = $('#ExporterList');
    this.renderAll = function renderAll() {
        this.el.empty();
        var exporterList = dataPool.get('exporterList', 0);
        var exporter;
        for (var id in exporterList.list) {
            exporter = exporterList.get(id);
            this.renderCreate(exporter);
        }
    };
    this.renderCreate = function renderCreate(exporter) {
        var data = { exporter: exporter };
        var html = Renderer.make('ExporterList-Exporter', data);
        this.el.append(html);
    };
    this.renderRemoveExporter = function renderRemoveExporter(id) {
        $('#ExporterList-Exporter-' + id).remove();
    };
    // event
    this.openExporterDefine = function openExporterDefine(id) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        exporterDefineView.renderAll(exporter);
    };
};
