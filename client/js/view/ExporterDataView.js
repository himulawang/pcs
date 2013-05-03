var ExporterDataView = function ExporterDataView() {
    this.renderAll = function renderAll(exporter) {
        // exporter data
        var data = { exporter: exporter };
        var html = Renderer.make('ExporterData', data);
        $('#Content').empty().html(html);

        this.onPreview(exporter.id);

        Resizer.exporterData();
    };
    this.renderExporterUpdate = function renderExporterUpdate(exporter) {
        if (!this.isViewOpened(exporter.id)) return;

        this.renderExporterName(exporter);
        this.renderExporterDescription(exporter);
        this.renderExporterPath(exporter);
    };
    this.renderExporterRemove = function renderExporterRemove(id) {
        if (!this.isViewOpened(id)) return;

        indexView.clearContent();
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
    this.statusError = function statusError(msg) {
        $('#Exporter-Status').removeClass('alert-success').addClass('alert-error').text(msg);
    };
    this.statusSuccess = function statusSuccess(msg) {
        $('#Exporter-Status').removeClass('alert-error').addClass('alert-success').text(msg);
    };
    this.isViewOpened = function isViewOpened(exporterId) {
        var el = $('#ExporterData-Exporter-' + exporterId + '-Id');
        return el.length !== 0;
    };
    // event
    this.onDownload = function onDownload(exporterId) {
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        var exporterMaker = this.onPreview(exporterId);

        if (!exporterMaker) return;
        FileSystem.saveToLocal(exporter.name, JSON.stringify(exporterMaker.results));
    };
    this.onCheck = function onCheck(exporterId) {
        var exporterMaker = new I.Lib.ExporterMaker();
        try {
            exporterMaker.make(exporterId);
        } catch (e) {
            this.statusError(e.message);
            return false;
        }
        this.statusSuccess('Passed!');
        return exporterMaker;
    };
    this.onPreview = function onPreview(exporterId) {
        var exporterMaker = this.onCheck(exporterId);
        if (!exporterMaker) return;

        try {
            if (I.Util.getLength(exporterMaker.results) === 0) throw new I.Exception(50205);
        } catch (e) {
            this.statusError(e.message);
            return false;
        }

        var html = jsonFormatter.jsonObjToHTML(exporterMaker.preview);
        $('#ExporterData-View-Body').empty().html(html).click(jsonFormatter.generalClick);
        $('#ExporterData-Raw-Body').val(JSON.stringify(exporterMaker.results));
        return exporterMaker;
    };
    this.onExportToServer = function onExportToServer(exporterId) {
        ExporterController.ExportToServer(exporterId);
    };
    this.downloadAll = function downloadAll() {
        var exporterList = dataPool.get('exporterList', 0);

        for (var exporterId in exporterList.list) {
            var exporter = exporterList.get(exporterId);
            var exporterMaker = new I.Lib.ExporterMaker();
            try {
                exporterMaker.make(exporterId);
            } catch (e) {
                continue;
            }
            FileSystem.saveToLocal(exporter.name, JSON.stringify(exporterMaker.results));
        }
    };
    this.allToServer = function allToServer() {
        ExporterController.AllToServer();
    };
};
