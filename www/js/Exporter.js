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
        }, obj);
    });
};

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
    var level = $(this).find('.levelValue').val();
    var tableId = e.dataTransfer.getData('tableId');

    // add to graph
    graph.addNewTable(level, tableId);

    // add dom
    var self = this;
    $.post('/getStructure', { req: 'getStructure', id: tableId }, function(json) {
        var obj = Util.parse(json);
        view.get('graphTableStructure', function(html) {
            $(self).append(html);
        }, obj);
    });
    return false;
};

Exporter.prototype.dragEndGraph = function dragEndGraph(e) {
    $('.levelGraph').removeClass('dragOverGraph');
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

Exporter.prototype.bindGraphDrop = function bindGraphDrop(el) {
    var self = this;
    el.addEventListener('dragenter', self.dragEnterGraph, false);
    el.addEventListener('dragover', self.dragOverGraph, false);
    el.addEventListener('dragleave', self.dragLeaveGraph, false);
    el.addEventListener('drop', self.dropToGraph, false);
    el.addEventListener('dragend', self.dragEndGraph, false);
};
