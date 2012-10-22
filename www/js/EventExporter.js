var EventExporter = function EventExporter() {};

/* Navigation Create Button */
EventExporter.prototype.eventClickCreateExport = function eventClickCreateExport() {
    view.get('createExport', function(html) {
        $('#indexRightBlock').empty().html(html);
        $('#exportSettingTabs').tabs();
    });
    $.post('./getTableList', { req: 'getTableList' }, function(json) {
        var obj = Util.parse(json);
        view.get('createExportTableList', function(html) {
            uiExporter.getTabExportList().html(html);
            var list = uiExporter.getTables();

            canvas = new Canvas();
            graph = new Graph();

            eventExporter.bindTableDrag(list);
            eventExporter.bindExportSetting();
            eventExporter.bindTabButton();
            eventExporter.bindAddLevel();
        }, obj);
    });
};

/* Click Tab */
EventExporter.prototype.eventClickTab = function eventClickTab(e) {
    exporter.tab = $(this).html().toLowerCase();
    canvas.render();
};
EventExporter.prototype.bindTabButton = function bindTabButton() {
    uiExporter.getTabButtonClient().bind('click', this.eventClickTab);
    uiExporter.getTabButtonServer().bind('click', this.eventClickTab);
};

/* Add Level */
EventExporter.prototype.eventClickAddLevel = function eventClickAddLevel(e) {
    // get element
    var zone = uiExporter.getActiveTab();

    // change value
    var level = graph.addLevel(exporter.tab);

    // dom
    uiExporter.domAddLevel(this, zone, level);
};
EventExporter.prototype.bindAddLevel = function bindAddLevel(e) {
    uiExporter.getTabClient().find('.buttonAddLevel').bind('click', this.eventClickAddLevel);
    uiExporter.getTabServer().find('.buttonAddLevel').bind('click', this.eventClickAddLevel);
};

/* Table Drag To Level */
EventExporter.prototype.eventDragStartTable = function eventDragStartTable(e) {
    var id = $(this).siblings('.tableId').val();
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('tableId', id);
    e.dataTransfer.setData('dragType', 'tableToLevel');
    return false;
};
EventExporter.prototype.eventDragEnterGraph = function eventDragEnterGraph(e) {
    this.classList.add('dragOverGraph');
    return false;
};
EventExporter.prototype.eventDragOverGraph = function eventDragOverGraph(e) {
    e.preventDefault();
    return false;
};
EventExporter.prototype.eventDragLeaveGraph = function eventDragLeaveGraph(e) {
    this.classList.remove('dragOverGraph');
    return false;
};
EventExporter.prototype.eventDropToGraph = function eventDropToGraph(e) {
    e.stopPropagation();

    if (e.dataTransfer.getData('dragType') === 'tableToLevel') {
        var level = $(this).find('.levelValue').val();
        var tableId = e.dataTransfer.getData('tableId');

        exporter.addNewTable(exporter.tab, level, tableId);
    }
    return false;
};
EventExporter.prototype.eventDragEndGraph = function eventDragEndGraph(e) {
    $('.levelGraph').removeClass('dragOverGraph');
};
EventExporter.prototype.bindGraphDrop = function bindGraphDrop(el) {
    el.addEventListener('dragenter', this.eventDragEnterGraph, false);
    el.addEventListener('dragover', this.eventDragOverGraph, false);
    el.addEventListener('dragleave', this.eventDragLeaveGraph, false);
    el.addEventListener('drop', this.eventDropToGraph, false);
    el.addEventListener('dragend', this.eventDragEndGraph, false);
};
EventExporter.prototype.bindTableDrag = function bindTableDrag(list) {
    var list = uiExporter.getTables();
    var self = this;
    list.each(function(i, n) {
        n.addEventListener('dragstart', self.eventDragStartTable, false);
        n.addEventListener('dragend', self.eventDragEndGraph, false);
    });
};

/* GraphTable Event Bind */
EventExporter.prototype.eventChangeSelectedInput = function eventChangeSelectedInput(e) {
    var graphTableId = $(this).parent().parent().parent().parent().find('.graphTableId').val();
    var columnId = $(this).parent().parent().find('.columnId').val();
    this.checked ? graph.selectColumn(graphTableId, columnId) : graph.cancelColumn(graphTableId, columnId);
};
EventExporter.prototype.eventDragStartColumnName = function eventDragStartColumnName(e) {
    var graphTableId = $(this).parent().parent().parent().find('.graphTableId').val();
    var columnId = $(this).parent().find('.columnId').val();
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('graphTableId', graphTableId);
    e.dataTransfer.setData('columnId', columnId);
    e.dataTransfer.setData('dragType', 'linkColumn');
    return false;
};
EventExporter.prototype.eventDropToColumn = function eventDropToColumn(e) {
    e.stopPropagation();

    if (e.dataTransfer.getData('dragType') === 'linkColumn') {
        var fromGraphTableId = e.dataTransfer.getData('graphTableId');
        var fromColumnId = e.dataTransfer.getData('columnId');
        var toGraphTableId = $(this).parent().parent().find('.graphTableId').val();
        var toColumnId = $(this).find('.columnId').val();

        // drag to same table
        if (fromGraphTableId == toGraphTableId) return false;

        // update graph
        var type;
        if (graph.tableOnSameLevel(fromGraphTableId, toGraphTableId)) {
            graph.linkFlatColumn(fromGraphTableId, fromColumnId, toGraphTableId, toColumnId);
            type = 'flat';
        } else {
            graph.linkLevelColumn(fromGraphTableId, fromColumnId, toGraphTableId, toColumnId);
            type = 'level';
        }

        // add to canvasData
        fromColumnEl = uiExporter.getColumnElByColumnId(fromGraphTableId, fromColumnId)[0];
        toColumnEl = uiExporter.getColumnElByColumnId(toGraphTableId, toColumnId)[0];
        var fromPos = canvas.calColumnPositionOnCanvas(fromColumnEl.getBoundingClientRect());
        var toPos = canvas.calColumnPositionOnCanvas(toColumnEl.getBoundingClientRect());
        canvas[exporter.tab].add(fromGraphTableId, fromPos, toPos, type);

        canvas.render();
    }
    return false;
};
EventExporter.prototype.bindGraphTable = function bindGraphTable(tableEl) {
    var self = this;
    tableEl.find('.graphTableStructureSelectedInput').bind('change', this.eventChangeSelectedInput);
    tableEl.find('.graphTableStructureColumnName').each(function(i, n) {
        n.addEventListener('dragstart', self.eventDragStartColumnName, false);
    });
    tableEl.find('.graphTableStructureColumn').each(function(i, n) {
        n.addEventListener('drop', self.eventDropToColumn, false);
    });
};

/* ExportSetting Event Bind */
EventExporter.prototype.eventMoveExportSetting = function eventMoveExportSetting(e) {
    var canvasPos = canvas.calClientPosToCanvas(e);
    var except = canvas.collision(e, canvasPos);
    canvas.render(except);
};
EventExporter.prototype.eventClickExportSetting = function eventClickExportSetting(e) {
    var canvasPos = canvas.calClientPosToCanvas(e);
    var selected = canvas.collision(e, canvasPos);
    canvas.unselectAllLine();
    if (!selected) return;

    canvas.selectLine(selected);
    canvas.render();
};
EventExporter.prototype.bindExportSetting = function bindExportSetting() {
    uiExporter.getExportSetting().bind('mousemove', this.eventMoveExportSetting)
        .bind('click', this.eventClickExportSetting);
};

/* ExportList Mouse Over & Out */
EventExporter.prototype.eventMouseoverExportList = function eventMouseoverExportList(el) {
    $(el).find('.exportListButtons').removeClass('hide');
};
EventExporter.prototype.eventMouseoutExportList = function eventMouseoutExportList(el) {
    $(el).find('.exportListButtons').addClass('hide');
};

/* ExportName */
EventExporter.prototype.eventClickExportName = function eventClickExportName(id) {
    var param = {
        req: 'getExportConfig',
        id: id,
    };
    $.post('./getExportConfig', param, function(json) {
        var obj = Util.parse(json);

        view.get('modifyExport', function(html) {
            $('#indexRightBlock').empty().html(html);
            $('#exportSettingTabs').tabs();

            $.post('./getTableList', { req: 'getTableList' }, function(json) {
                var obj = Util.parse(json);
                view.get('createExportTableList', function(html) {
                    uiExporter.getTabExportList().html(html);
                    var list = uiExporter.getTables();

                    eventExporter.bindTableDrag(list);
                }, obj);
            });

            canvas = new Canvas();
            graph = new Graph();
            
            eventExporter.bindTabButton();
            eventExporter.bindExportSetting();
            eventExporter.bindAddLevel();

            exporter.restoreExport('client', graph.convertNetData(obj.ecc));
            exporter.restoreExport('server', graph.convertNetData(obj.ecs));

            canvas.set(obj.ecc, obj.ecs);
            canvas.render();
        }, obj);
    });
};
