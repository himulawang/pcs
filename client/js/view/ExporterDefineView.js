var ExporterDefineView = function ExporterDefineView() {
    this.name = '#ExporterDefine';
    this.renderAll = function renderAll(exporter) {
        // exporter define
        var data = { exporter: exporter };
        var html = Renderer.make('ExporterDefine', data);
        $('#Content').empty().html(html);
    };
    // event
    this.onExporterNameChange = function onExporterNameChange(id, el) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        if (exporter.name == el.value) return;
        exporter.name = el.value;
        exporter.update();
    };
    this.onExporterDescriptionChange = function onExporterDescriptionChange(id, el) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        if (exporter.description == el.value) return;
        exporter.description = el.value;
        exporter.update();
    };
};

