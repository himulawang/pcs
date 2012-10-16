var Exporter = function Exporter() {};

Exporter.prototype.clickCreateExport = function clickCreateExport() {
    var self = this;
    view.get('createExport', function(html) {
        $('#indexRightBlock').html(html);
        $('#exportSettingTabs').tabs();
    });
    $.post('./getTableList', { req: 'getTableList' }, function(json) {
        var obj = Util.parse(json);
        view.get('createExportTableList', function(html) {
            var list = $('#tabExportList').html(html).find('input').button();
            self.bindTableDrag(list);
            canvas = new Canvas();
            self.bindExportSetting();
        }, obj);
    });
};

Exporter.prototype.createExport = function createExport() {

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

        // add to graph
        var graphTableId = graph.addNewTable(level, tableId);

        // add dom
        var self = this;
        $.post('/getStructure', { req: 'getStructure', id: tableId }, function(json) {
            var obj = Util.parse(json);
            view.get('graphTableStructure', function(html) {
                $(self).append(html)
                    .find('.graphTableId').last().val(graphTableId);
                exporter.bindGraphTable(self);
            }, obj);
        });
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
    tableEl = $(tableEl);
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
    $('#exportSetting').bind('mousemove', this.clickExportSetting);
};
Exporter.prototype.clickExportSetting = function clickExportSetting(e) {
    canvas.collision(e);
};

/* Get Element */
Exporter.prototype.getColumnElByColumnId = function getColumnElByColumnId(graphTableId, columnId) {
    var tableEl;
    $('.graphTableId').each(function(i, n) {
        if ($(n).val() == graphTableId) tableEl = n;
    });
    var columnEl;
    $(tableEl).parent().parent().find('.columnId').each(function(i, n) {
        var el = $(n);
        if (el.val() == columnId) columnEl = el.parent().parent();
    });
    return columnEl;
};


