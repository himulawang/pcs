var ExporterDataView = function ExporterDataView() {
    this.name = '#ExporterData';
    this.renderAll = function renderAll(exporter) {
        // exporter data
        var data = { exporter: exporter };
        var html = Renderer.make('ExporterData', data);
        $('#Content').empty().html(html);

        new ExporterValidator().preview(exporter.id);
    };
    this.renderExporterUpdate = function renderExporterUpdate(exporter) {
        if (!this.isViewOpened(exporter.id)) return;

        this.renderExporterName(exporter);
        this.renderExporterDescription(exporter);
        this.renderExporterPath(exporter);
    };
    this.renderExporterName = function renderExporterName(exporter) {
        var el = $('#ExporterData-Exporter-' + exporter.id + '-Name');
        if (el.val() === exporter.name) return;
        el.val(exporter.name);
    };
    this.renderExporterDescription = function renderExporterDescription(exporter) {
        var el = $('#ExporterData-Exporter-' + exporter.id + '-Description');
        if (el.val() === exporter.description) return;
        el.val(exporter.description);
    };
    this.renderExporterPath = function renderExporterPath(exporter) {
        var el = $('#ExporterData-Exporter-' + exporter.id + '-Path');
        if (el.val() === exporter.path) return;
        el.val(exporter.path);
    };
    this.isViewOpened = function isViewOpened(exporterId) {
        var el = $('#ExporterData-Exporter-' + exporterId + '-Id');
        return el.length !== 0;
    };
    // event
    this.download = function download(exporterId) {
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        var exporterValidator = new ExporterValidator()
        if (!exporterValidator.preview(exporterId)) return;
        FileSystem.saveToLocal(exporter.name, JSON.stringify(exporterValidator.results));
    };
};
