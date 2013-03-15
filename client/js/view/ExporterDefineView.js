var ExporterDefineView = function ExporterDefineView() {
    this.name = '#ExporterDefine';
    this.renderAll = function renderAll(exporter) {
        // exporter define
        var data = { exporter: exporter };
        var html = Renderer.make('ExporterDefine', data);
        $('#Content').empty().html(html);

        // render level
        var levels = JSON.parse(exporter.levels);
        html = '';
        var maxLevel = I.Util.max(levels);
        for (var level in levels) {
            html += this.makeLevelHTML(exporter, level, maxLevel);
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
    this.makeLevelHTML = function makeLevelHTML(exporter, level, maxLevel) {
        var displayRemoveLevel = level == maxLevel;
        return Renderer.make('ExporterDefine-Level', { exporter: exporter, level: level, displayRemoveLevel: displayRemoveLevel });
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

        var detail = JSON.parse(exporter.rootTableDetail);
        // pk
        if (detail.pk !== null) {
            $('#ExporterDefine-RootTable-' + detail.pk + '-PK').attr('checked', 'checked');
        }
        // choose
        detail.choose.forEach(function(n) {
            $('#ExporterDefine-RootTable-' + n + '-Choose').attr('checked', 'checked');
        });
        // rename
        for (var columnId in detail.rename) {
            $('#ExporterDefine-RootTable-' + columnId + '-Rename').val(detail.rename[columnId]);
        }
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

        // columns
        var columnHTML = ''; 
        var columnKeys = columnList.getKeys();
        columnKeys.forEach(function(n) {
            var column = columnList.get(n);
            columnHTML += Renderer.make('ExporterDefine-Table-Column', { exporter: exporter, blockId: blockId, column: column });
        });
        $('.ExporterDefine-Columns-BlockId-' + blockId).append(columnHTML);
        // bind column drop event
        var self = this;
        columnKeys.forEach(function(n) {
            var el = $('#ExporterDefine-Table-' + blockId + '-' + n + '-Column')[0];
            el.addEventListener('dragover', self.onLinkDragOver, false);
            el.addEventListener('drop', self.onLinkDrop, false);
        });

        var links = JSON.parse(exporter.links);
        // pk
        if (links[blockId].pk !== null) {
            $('#ExporterDefine-Table-' + blockId + '-' + links[blockId].pk).attr('checked', 'checked');
        }
        // choose
        links[blockId].choose.forEach(function(n) {
            $('#ExporterDefine-Table-' + blockId + '-' + n + '-Choose').attr('checked', 'checked');
        });

        // bind drag event
        $('#ExporterDefine-Link-' + blockId)[0].addEventListener('dragstart', this.onLinkDragStart, false);
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
    this.renderAddLevel = function renderAddLevel(exporter, level) {
        if (!this.isViewOpened(exporter.id)) return;

        // hide preLevel removeLevel button
        var preLevel = parseInt(level) - 1;
        $('#ExporterDefine-RemoveLevel-' + preLevel).addClass('hide');

        // make html
        var html = this.makeLevelHTML(exporter, level, level);
        $('#ExporterDefine-Levels').append(html);

        // render table select
        var tableOptionHTML = this.makeTableOption(exporter.id);
        $('#ExporterDefine-Level-' + level).find('.ExporterDefine-Table-Select').html(tableOptionHTML);
    };
    this.renderRemoveLevel = function renderRemoveLevel(exporter, level) {
        if (!this.isViewOpened(exporter.id)) return;

        // remove level
        $('#ExporterDefine-Level-' + level).remove();

        var preLevel = level - 1;
        if (preLevel === 1) return;
        $('#ExporterDefine-RemoveLevel-' + preLevel).removeClass('hide');
    };
    this.renderRootTablePKChange = function renderRootTablePKChange(exporter, columnId) {
        if (!this.isViewOpened(exporter.id)) return;
        $('#ExporterDefine-RootTable-' + columnId + '-PK').attr('checked', 'checked');
    };
    this.renderRootTableChooseChange = function renderRootTableChooseChange(exporter, columnId, checked) {
        if (!this.isViewOpened(exporter.id)) return;
        var el = $('#ExporterDefine-RootTable-' + columnId + '-Choose');

        checked ? el.attr('checked', 'checked') : el.removeAttr('checked');
    };
    this.renderRootTableRenameChange = function renderRootTableRenameChange(exporter, columnId, rename) {
        if (!this.isViewOpened(exporter.id)) return;
        var el = $('#ExporterDefine-RootTable-' + columnId + '-Rename');

        if (el.val() == rename) return;
        el.val(rename);
    };
    this.renderTablePKChange = function renderTablePKChange(exporter, blockId, columnId) {
        if (!this.isViewOpened(exporter.id)) return;
        $('#ExporterDefine-Table-' + blockId + '-' + columnId + '-PK').attr('checked', 'checked');
    };
    this.renderTableChooseChange = function renderTableChooseChange(exporter, blockId, columnId, checked) {
        if (!this.isViewOpened(exporter.id)) return;
        var el = $('#ExporterDefine-Table-' + blockId + '-' + columnId + '-Choose');

        checked ? el.attr('checked', 'checked') : el.removeAttr('checked');
    };
    this.renderTableRenameChange = function renderTableRenameChange(exporter, blockId, columnId, rename) {
        if (!this.isViewOpened(exporter.id)) return;
        var el = $('#ExporterDefine-Table-' + blockId + '-' + columnId + '-Rename');

        if (el.val() == rename) return;
        el.val(rename);
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
    this.onAddLevel = function onAddLevel(id) {
        ExporterController.AddLevel(id);
    };
    this.onRemoveLevel = function onRemoveLevel(id, level) {
        dialogView.renderDeleteExporterDefineLevelConfirm(id, level);
    };
    this.onAddBlock = function onAddBlock(id, level, el) {
        var tableId = $(el).prev('select').val();
        ExporterController.AddBlock(id, level, tableId);
    };
    this.onRemoveTable = function onRemoveTable(exporterId, level, tableId, blockId) {
        dialogView.renderDeleteExporterDefineTableConfirm(exporterId, level, tableId, blockId);
    };
    this.onRootTablePKChange = function onRootTablePKChange(exporterId, columnId) {
        ExporterController.RootTablePKChange(exporterId, columnId);
    };
    this.onRootTableChooseChange = function onRootTableChooseChange(exporterId, columnId, el) {
        var checked = $(el).attr('checked') ? 1 : 0;
        ExporterController.RootTableChooseChange(exporterId, columnId, checked);
    };
    this.onRootTableChooseRename = function onRootTableChooseRename(exporterId, columnId, el) {
        ExporterController.RootTableRenameChange(exporterId, columnId, el.value);
    };
    this.onTablePKChange = function onTablePKChange(exporterId, blockId, columnId) {
        ExporterController.TablePKChange(exporterId, blockId, columnId);
    };
    this.onTableChooseChange = function onTableChooseChange(exporterId, blockId, columnId, el) {
        var checked = $(el).attr('checked') ? 1 : 0;
        ExporterController.TableChooseChange(exporterId, blockId, columnId, checked);
    };
    this.onTableChooseRename = function onTableChooseRename(exporterId, blockId, columnId, el) {
        ExporterController.TableRenameChange(exporterId, blockId, columnId, el.value);
    };
    this.onOverDragButton = function onOverDragButton(el) {
        $(el).popover('show');
    };
    this.onOutDragButton = function onOutDragButton(el) {
        $(el).popover('hide');
    };
    this.onLinkDragStart = function onLinkDragStart(e) {
        var blockId = this.dataset.blockId;
        console.dir(this);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('blockId', blockId);
        console.log(e.dataTransfer);
    };
    this.onLinkDragOver = function onLinkDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';
        return false;
    };
    this.onLinkDrop = function onLinkDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        console.log(e);
        console.log(e.dataTransfer.getData('blockId'));
        console.log(this);

        return false;
    };
};
