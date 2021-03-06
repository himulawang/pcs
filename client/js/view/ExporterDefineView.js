var ExporterDefineView = function ExporterDefineView() {
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

        this.onCheck(exporter.id);

        Resizer.exporterDefine();
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
    this.makeRootTableColumn = function makeRootTableColumn(exporter, column) {
        return Renderer.make('ExporterDefine-RootTable-Column', { exporter: exporter, column: column });
    };
    this.makeTableColumn = function makeTableColumn(exporter, level, blockId, column) {
        return Renderer.make('ExporterDefine-Table-Column', { exporter: exporter, level: level, blockId: blockId, column: column });
    };
    this.bindRootTableColumnDropEvent = function bindRootTableColumnDropEvent(columnId) {
        var el = $('#ExporterDefine-Table-root-' + columnId + '-Column')[0];
        if (!el) return;
        el.addEventListener('dragover', this.onLinkDragOver, false);
        el.addEventListener('drop', this.onLinkDrop, false);
    };
    this.bindTableColumnDropEvent = function bindTableColumnDropEvent(blockId, columnId) {
        var el = $('#ExporterDefine-Table-' + blockId + '-' + columnId + '-Column')[0];
        el.addEventListener('dragover', this.onLinkDragOver, false);
        el.addEventListener('drop', this.onLinkDrop, false);
    };
    this.bindTableLinkDragEvent = function bindTableLinkDragEvent(blockId, columnId) {
        $('#ExporterDefine-Link-' + blockId + '-' + columnId)[0].addEventListener('dragstart', this.onLinkDragStart, false);
    };
    this.renderRemove = function renderRemove(id) {
        if (!this.isViewOpened(id)) return;

        indexView.clearContent();
    };
    this.renderRootTable = function renderRootTable(exporter) {
        var tableId = exporter.rootTableId;
        if (tableId == 0) return;

        // delete pre root table link
        $('.ExporterDefine-Link-ToBlock-root').remove();

        var table = dataPool.get('tableList', 0).get(tableId)
        var columnList = dataPool.get('columnList', tableId);
        var html = Renderer.make('ExporterDefine-RootTable', { table: table });
        $('#ExporterDefine-RootTable').remove();
        $('.ExporterDefine-Level-1-Body').prepend(html);

        // columns
        var self = this;
        var columnHTML = ''; 
        var columnKeys = columnList.getKeys();
        columnKeys.forEach(function(columnId) {
            var column = columnList.get(columnId);
            columnHTML += self.makeRootTableColumn(exporter, column);
        });
        $('#ExporterDefine-RootTable-Columns').append(columnHTML);
        // bind column drop event
        columnKeys.forEach(function(columnId) {
            self.bindRootTableColumnDropEvent(columnId);
        });

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

        this.renderLinks(exporter);
    };
    this.renderLinks = function renderLinks(exporter) {
        var links = JSON.parse(exporter.links);
        for (var blockId in links) {
            var bind = links[blockId].bind;
            if (bind.fromLevel === null) continue;

            this.renderLink(exporter, bind.fromLevel, bind.fromBlockId, bind.fromColumnId, bind.toLevel, bind.toBlockId, bind.toColumnId, bind.color);
        }
    };
    this.renderLink = function renderLink(exporter, fromLevel, fromBlockId, fromColumnId, toLevel, toBlockId, toColumnId, color) {
        var linkClassName = 'ExporterDefine-Link-' + fromLevel + '-' + fromBlockId + '-' + fromColumnId + '-' + toLevel + '-' + toBlockId + '-' + toColumnId;
        var tables = JSON.parse(exporter.tables);

        var toTableId = tables[toBlockId];
        if (toTableId === undefined) toTableId = exporter.rootTableId;
        var data = {
            exporter: exporter,
            fromLevel: fromLevel,
            fromBlockId: fromBlockId,
            fromColumnId: fromColumnId,
            fromTableId: tables[fromBlockId],
            toLevel: toLevel,
            toBlockId: toBlockId,
            toColumnId: toColumnId,
            toTableId: toTableId,
            linkClassName: linkClassName,
            color: color,
        };
        var html = Renderer.make('ExporterDefine-Link', data);
        var id = '#ExporterDefine-Table-' + fromBlockId + '-' + fromColumnId + '-Link';
        id += ',' + '#ExporterDefine-Table-' + toBlockId + '-' + toColumnId + '-Link';
        $(id).append(html);

        var $linkClassName = '.' + linkClassName;
        var self = this;
        $($linkClassName)
            .colorpicker({ format: 'rgba' })
            .on('changeColor', function(e){
                self.onLinkColorChange(exporter.id, fromBlockId, e.color.toHex(), $linkClassName);
        });
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
        var links = JSON.parse(exporter.links);
        var preLevelName = links[blockId].preLevelName === null ? '' : links[blockId].preLevelName;
        var html = Renderer.make('ExporterDefine-Table', { exporter: exporter, table: table, blockId: blockId, level: level, preLevelName: preLevelName });
        $('.ExporterDefine-Level-' + level + '-Body').append(html);

        // columns
        var self = this;
        var columnHTML = ''; 
        var columnKeys = columnList.getKeys();
        columnKeys.forEach(function(columnId) {
            var column = columnList.get(columnId);
            columnHTML += self.makeTableColumn(exporter, level, blockId, column);
        });
        $('.ExporterDefine-Columns-BlockId-' + blockId).append(columnHTML);

        // bind column drop event
        columnKeys.forEach(function(columnId) {
            // bind drop event
            self.bindTableColumnDropEvent(blockId, columnId);

            // bind drag event
            self.bindTableLinkDragEvent(blockId, columnId);
        });

        // pk
        if (links[blockId].pk !== null) {
            $('#ExporterDefine-Table-' + blockId + '-' + links[blockId].pk + '-PK').attr('checked', 'checked');
        }
        // choose
        links[blockId].choose.forEach(function(n) {
            $('#ExporterDefine-Table-' + blockId + '-' + n + '-Choose').attr('checked', 'checked');
        });
        // rename
        for (var columnId in links[blockId].rename) {
            $('#ExporterDefine-Table-' + blockId + '-' + columnId + '-Rename').val(links[blockId].rename[columnId]);
        }
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
    this.renderColumnNameChange = function renderColumnNameChange(column) {
        var el = $('.ExporterDefine-Table-' + column.id + '-' + 'ColumnName');
        if (el.text() == column.name) return;

        el.text(column.name);
    };
    this.renderAddLink = function renderAddLink(exporter, fromLevel, fromBlockId, fromColumnId, toLevel, toBlockId, toColumnId, color, preBind) {
        if (!this.isViewOpened(exporter.id)) return;
        // remove preBind
        if (preBind !== null) {
            var obj = JSON.parse(preBind);
            this.renderRemoveLink(exporter.id, obj.fromLevel, obj.fromBlockId, obj.fromColumnId, obj.toLevel, obj.toBlockId, obj.toColumnId);
        }
        this.renderLink(exporter, fromLevel, fromBlockId, fromColumnId, toLevel, toBlockId, toColumnId, color);
    };
    this.renderRemoveLink = function renderRemoveLink(exporterId, fromLevel, fromBlockId, fromColumnId, toLevel, toBlockId, toColumnId) {
        if (!this.isViewOpened(exporterId)) return;
        $('.ExporterDefine-Link-' + fromLevel + '-' + fromBlockId + '-' + fromColumnId + '-' + toLevel + '-' + toBlockId + '-' + toColumnId).remove();
    };
    this.renderLinkColorChange = function renderLinkColorChange(className, color) {
        $(className).css('background-color', color);
    };
    this.renderBlockRenameChange = function renderBlockRenameChange(exporter, blockId, rename) {
        if (!this.isViewOpened(exporter.id)) return;
        var el = $('#ExporterDefine-PreLevelName-' + blockId);

        if (el.val() == rename) return;
        el.val(rename);
    };
    this.renderColumnCreate = function renderColumnCreate(table, column) {
        var el = $('#ExporterDefine-Header');
        if (el.length === 0) return;
        var exporterId = el[0].dataset.id;
        var exporter = dataPool.get('exporterList', 0).get(exporterId);

        // root table
        var rootTableEl = $('#ExporterDefine-RootTable-Columns');
        if (rootTableEl.length === 1) {
            // columns
            var columnHTML = this.makeRootTableColumn(exporter, column);
            rootTableEl.append(columnHTML);

            // bind column drop event
            this.bindRootTableColumnDropEvent(column.id);
        }

        // common table
        var self = this;
        $('.ExporterDefine-Columns-TableId-' + table.id).each(function(i, el) {
            if (el.id === 'ExporterDefine-RootTable-Columns') return;
            var level = el.dataset.level;
            var blockId = el.dataset.blockId;
            var tableId = el.dataset.tableId;

            var columnHTML = self.makeTableColumn(exporter, level, blockId, column);
            $('.ExporterDefine-Columns-BlockId-' + blockId).append(columnHTML);

            self.bindTableColumnDropEvent(blockId, column.id);
            self.bindTableLinkDragEvent(blockId, column.id);
        });
    };
    this.renderRemoveColumn = function renderRemoveColumn(columnId) {
        $('.ExporterDefine-Table-Column-' + columnId).remove();
        $('.ExporterDefine-Link-Column-' + columnId).remove();
    };
    this.renderRemoveTable = function renderRemoveTable(tableId) {
        $('.ExporterDefine-Link-ToTable-' + tableId).remove();
        $('.ExporterDefine-Link-FromTable-' + tableId).remove();
        $('.ExporterDefine-Table-' + tableId).remove();
    };
    this.statusError = function statusError(msg) {
        $('#Exporter-Status').removeClass('alert-success').addClass('alert-error').text(msg);
    };
    this.statusSuccess = function statusSuccess(msg) {
        $('#Exporter-Status').removeClass('alert-error').addClass('alert-success').text(msg);
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
    this.onRootTableClick = function onRootTableClick(id, el) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        if (exporter.rootTableId == el.value) return;
        exporter.rootTableId = el.value;

        exporter.updateRootTable();
    };
    this.onRootTableChange = function onRootTableChange(id, el) {
        var exporter = dataPool.get('exporterList', 0).get(id);
        if (exporter.rootTableId == el.value) return;
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
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        var detail = JSON.parse(exporter.rootTableDetail);

        var preValue = detail.rename[columnId];
        if ((preValue === undefined && el.value === '') ||
            preValue == el.value
        ) return;
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
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        var links = JSON.parse(exporter.links);

        var preValue = links[blockId].rename[columnId];
        if ((preValue === undefined && el.value === '') ||
            preValue == el.value
        ) return;
        ExporterController.TableRenameChange(exporterId, blockId, columnId, el.value);
    };
    this.onBlockNameChange = function onBlockNameChange(exporterId, blockId, el) {
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        var links = JSON.parse(exporter.links);
        
        var preValue = links[blockId].preLevelName;
        if ((preValue === null && el.value === '') ||
            preValue == el.value
        ) return;
        ExporterController.BlockRenameChange(exporterId, blockId, el.value);
    };
    this.onOverDragButton = function onOverDragButton(el) {
        $(el).popover('show');
    };
    this.onOutDragButton = function onOutDragButton(el) {
        $(el).popover('hide');
    };
    this.onLinkDragStart = function onLinkDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('exporterId', this.dataset.exporterId);
        e.dataTransfer.setData('level', this.dataset.level);
        e.dataTransfer.setData('blockId', this.dataset.blockId);
        e.dataTransfer.setData('columnId', this.dataset.columnId);
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

        var id = e.dataTransfer.getData('exporterId');
        var fromLevel = e.dataTransfer.getData('level');
        var fromBlockId = e.dataTransfer.getData('blockId');
        var fromColumnId = e.dataTransfer.getData('columnId');
        var toLevel = this.dataset.level;
        var toBlockId = this.dataset.blockId;
        var toColumnId = this.dataset.columnId;

        var delta = fromLevel - toLevel;
        if (
            (delta > 1 || delta < 0) ||
            (fromBlockId == toBlockId) || 
            (delta == 0 && toBlockId !== 'root' && fromBlockId < toBlockId)
        ) return;

        ExporterController.AddLink(id, fromLevel, fromBlockId, fromColumnId, toLevel, toBlockId, toColumnId);
        return false;
    };
    this.onRemoveLink = function onRemoveLink(exporterId, blockId) {
        ExporterController.RemoveLink(exporterId, blockId);
        return false;
    };
    this.onLinkColorChange = function onLinkColorChange(exporterId, blockId, color, className) {
        ExporterController.LinkColorChange(exporterId, blockId, color, className);
    };
    this.onCheck = function onCheck(exporterId) {
        var exporterMaker = new I.Lib.ExporterMaker();
        try {
            exporterMaker.make(exporterId);
        } catch (e) {
            return this.statusError(e.message);
        }
        this.statusSuccess('Passed!');
    };
};
