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
            html += this.makeLevelHTML(exporter, i);
        }
        $('#ExporterDefine-Levels').html(html);
        
        // render table select
        var tableOptionHTML = this.makeTableOption(exporter.id);
        $('.ExporterDefine-Table-Select').html(tableOptionHTML);

        // change root table select option
        $('#ExporterDefine-Exporter-' + exporter.id + '-RootTable').children('.ExporterDefine-TableOption-' + exporter.rootTableId + '-TableId').attr('selected', 'selected');

        // render level 1 root table
        this.renderRootTable(exporter);

        // render tables
        this.renderTables(exporter);
    };
    this.makeTableOption = function makeTableOption(exporterId) {
        var tableList = dataPool.get('tableList', 0);
        var html = '';
        tableList.getKeys().forEach(function(n, i) {
            var table = tableList.get(n);
            html += Renderer.make('ExporterDefine-TableOption', { table: table });
        });
        return html;
    };
    this.makeLevelHTML = function makeLevelHTML(exporter, level) {
        return Renderer.make('ExporterDefine-Level', { exporter: exporter, level: level });
    };
    this.renderRootTable = function renderRootTable(exporter) {
        var tableId = exporter.rootTableId;
        if (tableId == 0) return;
        var table = dataPool.get('tableList', 0).get(tableId)
        var columnList = dataPool.get('columnList', tableId);
        var html = Renderer.make('ExporterDefine-RootTable', { table: table });
        $('#ExporterDefine-RootTable').remove();
        $('.ExporterDefine-Level-1-Body').prepend(html);

        // columns
        var columnHTML = ''; 
        columnList.getKeys().forEach(function(n) {
            var column = columnList.get(n);
            columnHTML += Renderer.make('ExporterDefine-RootTable-Column', { exporter: exporter, column: column });
        });
        $('#ExporterDefine-RootTable-Columns').append(columnHTML);

        // choose
        columnList.getKeys().forEach(function(n) {
            $('#ExporterDefine-RootTable-' + n + '-Choose').attr('checked', 'checked');
        });
    };
    this.renderTables = function renderTables(exporter) {
        var levels = JSON.parse(exporter.levels);
        var tables = JSON.parse(exporter.tables);
        for (var level in levels) {
            var blocks = levels[level];
            for (var blockIndex in blocks) {
                var blockId = blocks[blockIndex];
                var tableId = tables[blockId];
                this.renderAddBlock(exporter, level, tableId, blockId);
            }
        }
    };
    this.renderAddBlock = function renderAddBlock(exporter, level, tableId, blockId) {
        if (!this.isViewOpened(exporter.id)) return;

        var table = dataPool.get('tableList', 0).get(tableId);
        var columnList = dataPool.get('columnList', tableId);

        this.renderTable(exporter, table, columnList, level, blockId);
    };
    this.renderRemoveBlock = function renderRemoveBlock(exporter, level, blockId) {
        if (!this.isViewOpened(exporter.id)) return;

        $('#ExporterDefine-Block-' + blockId).remove();
    };
    this.renderTable = function renderTable(exporter, table, columnList, level, blockId) {
        var html = Renderer.make('ExporterDefine-Table', { exporter: exporter, table: table, blockId: blockId, level: level });
        $('.ExporterDefine-Level-' + level + '-Body').append(html);

        var columnHTML = ''; 
        columnList.getKeys().forEach(function(n) {
            var column = columnList.get(n);
            columnHTML += Renderer.make('ExporterDefine-Table-Column', { exporter: exporter, blockId: blockId, column: column });
        });
        $('.ExporterDefine-Columns-BlockId-' + blockId).append(columnHTML);

        // choose
        columnList.getKeys().forEach(function(n) {
            $('#ExporterDefine-Table-' + blockId + '-' + n + '-Choose').attr('checked', 'checked');
        });
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
        var selectEl = $('.ExporterDefine-Table-Select');
        if (selectEl.length === 0) return;

        $('.ExporterDefine-TableOption-' + table.id + '-TableId').html(table.name);
    };
    this.renderTableCreate = function renderTableCreate(table) {
        var selectEl = $('.ExporterDefine-Table-Select');
        if (selectEl.length === 0) return;

        var html = Renderer.make('ExporterDefine-TableOption', { table: table });
        selectEl.append(html);
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
    this.onRootTableChange = function onRootTableChange(id, el) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        exporter.rootTableId = el.value;

        exporter.updateRootTable();
    };
    this.onAddBlock = function onAddBlock(id, level, el) {
        var tableId = $(el).prev('select').val();
        ExporterController.AddBlock(id, level, tableId);
    };
    this.onRemoveTable = function onRemoveTable(exporterId, level, tableId, blockId) {
        dialogView.renderDeleteExporterDefineTableConfirm(exporterId, level, tableId, blockId);
    };
    this.onRootTableChooseChange = function onRootTableChooseChange(exporterId, columnId, el) {
        ExporterController.RootTableRenameChange(exporterId, columnId, el.value);
    };
};
