var Exporter = function Exporter() {};

Exporter.prototype.switchTab = function(tab) {
    graph.switchTab(tab);
    canvas.render();
};
Exporter.prototype.clickCreateExport = function clickCreateExport() {
    var self = this;
    view.get('createExport', function(html) {
        $('#indexRightBlock').empty().html(html);
        $('#exportSettingTabs').tabs();
    });
    $.post('./getTableList', { req: 'getTableList' }, function(json) {
        var obj = Util.parse(json);
        view.get('createExportTableList', function(html) {
            var list = $('#tabExportList').html(html).find('input').button();
            self.bindTableDrag(list);
            canvas = new Canvas();
            graph = new Graph();
            self.bindExportSetting();
        }, obj);
    });
};

Exporter.prototype.createExport = function createExport() {
    var exportName = $('#createExportName').val();
    if (exportName === '') throw new Exception(50301);

    var description = $('#createExportDescription').val();

    var clientFileName = $('#clientFileName').val();
    var clientPath = $('#clientPath').val();

    var serverFileName = $('#serverFileName').val();
    var serverPath = $('#serverPath').val();

    graph.client.filename = clientFileName;
    graph.client.path = clientPath;

    graph.server.filename = serverFileName;
    graph.server.path = serverPath;

    param = {
        req: 'createExport',
        exportName: exportName,
        description: description,
        client: graph.toUpload('client'),
        server: graph.toUpload('server'),
    };

    // add canvas
    param.client['canvas'] = canvas.client.toUpload();
    param.server['canvas'] = canvas.server.toUpload();

    $.post('./createExport', param, function(json) {
        var obj = Util.parse(json);
        tab.clickTabExport();
    });

};
Exporter.prototype.delLink = function delLink() {
    // del canvasData
    var selected = canvas[graph.tab].getSelected();
    if (!selected) return;
    
    canvas[graph.tab].del(selected);
    graph.delLink(selected);
    canvas.render();
};

Exporter.prototype.clickExportName = function clickExportName(id) {
    var self = this;
    var param = {
        req: 'getExportConfig',
        id: id,
    };
    $.post('./getExportConfig', param, function(json) {
        var obj = Util.parse(json);

        console.log(obj);

        view.get('modifyExport', function(html) {
            $('#indexRightBlock').empty().html(html);
            $('#exportSettingTabs').tabs();

            canvas = new Canvas();
            graph = new Graph();
            self.restoreExport('client', graph.convertNetData(obj.ecc));
            self.restoreExport('server', graph.convertNetData(obj.ecs));

            canvas.set(obj.ecc, obj.ecs);
        }, obj);
    });
};

Exporter.prototype.restoreExport = function restoreExport(tab, data) {
    console.log(data);
    var el = $('#exportTab' + Util.upperCaseFirst(tab)).find('.addLevel');
    // add level
    for (var level in data.graphStructure) {
        this.addLevel(el);
    }

    // add table
    var graphTableId;
    for (var level in data.graphStructure) {
        for (var index in data.graphStructure[level]) {
            graphTableId = data.graphStructure[level][index];
            this.addNewTable(tab, level, data.graphTableIds[graphTableId]);
        }
    }
};

Exporter.prototype.addNewTable = function addNewTable(tab, level, tableId) {
    // add to graph
    var graphTableId = graph.addNewTable(level, tableId);

    // add dom
    var el = $('#exportTab' + Util.upperCaseFirst(tab)).find('.level' + level);
    $.post('/getStructure', { req: 'getStructure', id: tableId }, function(json) {
        var obj = Util.parse(json);
        view.get('graphTableStructure', function(html) {
            el.append(html)
                .find('.graphTableId').last().val(graphTableId);
            exporter.bindGraphTable(el);
        }, obj);
    });
};

/* Table Drag & Drop */
Exporter.prototype.bindTableDrag = function bindTableDrag(list) {
    var self = this;
    list.each(function(i, n) {
        n.addEventListener('dragstart', self.dragStartTable, false);
        n.addEventListener('dragend', self.dragEndGraph, false);
    });
};
Exporter.prototype.dragStartTable = function dragStartTable(e) {
    var id = $(this).siblings('.tableId').val();
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('tableId', id);
    e.dataTransfer.setData('dragType', 'tableToLevel');
    return false;
};
Exporter.prototype.dragEnterGraph = function dragEnterGraph(e) {
    this.classList.add('dragOverGraph');
};
Exporter.prototype.dragOverGraph = function dragOverGraph(e) {
    e.preventDefault();
    return false;
};
Exporter.prototype.dragLeaveGraph = function dragLeaveGraph(e) {
    this.classList.remove('dragOverGraph');
};
Exporter.prototype.dropToGraph = function dropToGraph(e) {
    e.stopPropagation();

    if (e.dataTransfer.getData('dragType') === 'tableToLevel') {
        var level = $(this).find('.levelValue').val();
        var tableId = e.dataTransfer.getData('tableId');

        exporter.addNewTable(graph.tab, level, tableId);
    }
    return false;
};
Exporter.prototype.dragEndGraph = function dragEndGraph(e) {
    $('.levelGraph').removeClass('dragOverGraph');
};
Exporter.prototype.bindGraphDrop = function bindGraphDrop(el) {
    var self = this;
    el.addEventListener('dragenter', self.dragEnterGraph, false);
    el.addEventListener('dragover', self.dragOverGraph, false);
    el.addEventListener('dragleave', self.dragLeaveGraph, false);
    el.addEventListener('drop', self.dropToGraph, false);
    el.addEventListener('dragend', self.dragEndGraph, false);
};
Exporter.prototype.addLevel = function addLevel(el) {
    var btn = $(el);
    var zone = btn.parent().parent();
    var level = Util.getLength(graph[graph.tab].graphStructure) + 1;
    graph[graph.tab].graphStructure[level] = [];

    // title
    var titleEl = document.createElement('span');
    titleEl.innerHTML = 'Level' + level;
    btn.before(titleEl);

    // graph
    var graphEl = document.createElement('div');
    graphEl.classList.add('levelGraph');
    graphEl.classList.add('border');
    graphEl.classList.add('left');
    graphEl.classList.add('level' + level);

    var hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.value = level;
    hiddenInput.classList.add('levelValue');
    graphEl.appendChild(hiddenInput);

    this.bindGraphDrop(graphEl);
    zone.find('.graph').append(graphEl);
};

/* GraphTable Event Bind */
Exporter.prototype.bindGraphTable = function bindGraphTable(tableEl) {
    var self = this;
    tableEl.find('.graphTableStructureSelectedInput').bind('change', this.changeSelectedInput);
    tableEl.find('.graphTableStructureColumnName').each(function(i, n) {
        n.addEventListener('dragstart', self.dragStartColumnName, false);
    });
    tableEl.find('.graphTableStructureColumn').each(function(i, n) {
        n.addEventListener('drop', self.dropToColumn, false);
    });
};
Exporter.prototype.changeSelectedInput = function changeSelectedInput(e) {
    var graphTableId = $(this).parent().parent().parent().parent().find('.graphTableId').val();
    var columnId = $(this).parent().parent().find('.columnId').val();
    this.checked ? graph.selectColumn(graphTableId, columnId) : graph.cancelColumn(graphTableId, columnId);
};
Exporter.prototype.dragStartColumnName = function dragStartColumnName(e) {
    var graphTableId = $(this).parent().parent().parent().find('.graphTableId').val();
    var columnId = $(this).parent().find('.columnId').val();
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('graphTableId', graphTableId);
    e.dataTransfer.setData('columnId', columnId);
    e.dataTransfer.setData('dragType', 'linkColumn');
    return false;
};
Exporter.prototype.dropToColumn = function dropToColumn(e) {
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
        fromColumnEl = exporter.getColumnElByColumnId(fromGraphTableId, fromColumnId)[0];
        toColumnEl = exporter.getColumnElByColumnId(toGraphTableId, toColumnId)[0];
        var fromPos = canvas.calColumnPositionOnCanvas(fromColumnEl.getBoundingClientRect());
        var toPos = canvas.calColumnPositionOnCanvas(toColumnEl.getBoundingClientRect());
        canvas[graph.tab].add(fromGraphTableId, fromPos, toPos, type);

        canvas.render();
    }
    return false;
};

/* exportSetting Event Bind */
Exporter.prototype.bindExportSetting = function bindExportSetting() {
    $('#exportSetting').bind('mousemove', this.moveExportSetting);
    $('#exportSetting').bind('click', this.clickExportSetting);
};
Exporter.prototype.moveExportSetting = function moveExportSetting(e) {
    var canvasPos = canvas.calClientPosToCanvas(e);
    var except = canvas.collision(e, canvasPos);
    canvas.render(except);
};
Exporter.prototype.clickExportSetting = function clickExportSetting(e) {
    var canvasPos = canvas.calClientPosToCanvas(e);
    var selected = canvas.collision(e, canvasPos);
    canvas.unselectAllLine();
    if (!selected) return;

    canvas.selectLine(selected);
    canvas.render();
};

/* Get Element */
Exporter.prototype.getColumnElByColumnId = function getColumnElByColumnId(graphTableId, columnId) {
    var tableEl;
    var tableId = '#exportTab' + Util.upperCaseFirst(graph.tab);
    $(tableId).find('.graphTableId').each(function(i, n) {
        if ($(n).val() == graphTableId) tableEl = n;
    });
    var columnEl;
    $(tableEl).parent().parent().find('.columnId').each(function(i, n) {
        var el = $(n);
        if (el.val() == columnId) columnEl = el.parent().parent();
    });
    return columnEl;
};

/* Mouse Over & Out*/
Exporter.prototype.mouseoverExportList = function mouseoverExportList(el) {
    $(el).find('.exportListButtons').removeClass('hide');
};
Exporter.prototype.mouseoutExportList = function mouseoutExportList(el) {
    $(el).find('.exportListButtons').addClass('hide');
};
