var ExporterDefineView = function ExporterDefineView() {
    this.name = '#ExporterDefine';
    this.renderAll = function renderAll(exporter) {
        // exporter define
        var data = { exporter: exporter };
        var html = Renderer.make('ExporterDefine', data);
        $('#Content').empty().html(html);

        // render level
        html = '';
        for (var i = 1; i <= 3; ++i) {
            html += this.makeLevelHTML(i);
        }
        $('#ExporterDefine-Levels').html(html);
        
        // render table select
        var tableOptionHTML = this.makeTableOption(exporter.id);
        $('#ExporterDefine-Exporter-' + exporter.id + '-RootTable,.ExporterDefine-RootTable-Select').html(tableOptionHTML);
    };
    this.makeTableOption = function makeTableOption(exporterId) {
        var tableList = dataPool.get('tableList', 0);
        var html = '';
        tableList.getKeys().forEach(function(n, i) {
            var table = tableList.get(n);
            html += Renderer.make('ExporterDefine-RootTableOption', { table: table });
        });
        return html;
    };
    this.makeLevelHTML = function renderLevel(level) {
        return Renderer.make('ExporterDefine-Level', { level: level });
    };
    this.renderExporterUpdate = function renderExporterUpdate(exporter) {
        if (!this.isViewOpened(exporter.id)) return;

        this.renderExporterName(exporter);
        this.renderExporterDescription(exporter);
        this.renderExporterPath(exporter);
    };
    this.renderExporterName = function renderExporterName(exporter) {
        var el = $('#ExporterDefine-Exporter-' + exporter.id + '-Name');
        if (el.val() === exporter.name) return;
        el.val(exporter.name);
    };
    this.renderExporterDescription = function renderExporterDescription(exporter) {
        var el = $('#ExporterDefine-Exporter-' + exporter.id + '-Description');
        if (el.val() === exporter.description) return;
        el.val(exporter.description);
    };
    this.renderExporterPath = function renderExporterPath(exporter) {
        var el = $('#ExporterDefine-Exporter-' + exporter.id + '-Path');
        if (el.val() === exporter.path) return;
        el.val(exporter.path);
    };
    this.renderTableName = function renderTableName(table) {
        var selectEl = $('.ExporterDefine-RootTable-Select');
        if (selectEl.length === 0) return;

        $('.RootTableOption-' + table.id + '-TableId').html(table.name);
    };
    this.isViewOpened = function isViewOpened(exporterId) {
        var el = $('#ExporterDefine-Exporter-' + exporterId + '-Id');
        return el.length !== 0;
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
    this.onExporterPathChange = function onExporterPathChange(id, el) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        if (exporter.path == el.value) return;
        exporter.path = el.value;
        exporter.update();
    };
};
