var Exporter = function Exporter() {
    this.tab = 'client';
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
    var selected = canvas[this.tab].getSelected();
    if (!selected) return;
    
    canvas[this.tab].del(selected);
    graph.delLink(selected);
    canvas.render();
};
Exporter.prototype.modifyExport = function modifyExport(id) {
    var exportName = $('#modifyExportName').val();
    if (exportName === '') throw new Exception(50302);

    var description = $('#modifyExportDescription').val();
    
    var clientFileName = $('#clientFileName').val();
    var clientPath = $('#clientPath').val();

    var serverFileName = $('#serverFileName').val();
    var serverPath = $('#serverPath').val();

    graph.client.filename = clientFileName;
    graph.client.path = clientPath;

    graph.server.filename = serverFileName;
    graph.server.path = serverPath;

    param = {
        req: 'modifyExport',
        id: id,
        exportName: exportName,
        description: description,
        client: graph.toUpload('client'),
        server: graph.toUpload('server'),
    };

    // add canvas
    param.client['canvas'] = canvas.client.toUpload();
    param.server['canvas'] = canvas.server.toUpload();

    $.post('./modifyExport', param, function(json) {
        var obj = Util.parse(json);
        tab.clickTabExport();
    });
};
Exporter.prototype.deleteExport = function deleteExport(id) {
    param = {
        req: 'deleteExport',
        id: id,
    };

    $.post('./deleteExport', param, function(json) {
        var obj = Util.parse(json);
        tab.clickTabExport();
    });
};

/* Internal Function */
Exporter.prototype.restoreExport = function restoreExport(tab, data) {
    // add level
    for (var level in data.graphStructure) {
        this.addLevel(tab);
    }

    // add table
    var graphTableId;
    for (var level in data.graphStructure) {
        for (var index in data.graphStructure[level]) {
            graphTableId = data.graphStructure[level][index];
            this.addTable(tab, level, data.graphTableIds[graphTableId], data.columnDetail[graphTableId]);
        }
    }

    // overwrite graph data
    graph[tab] = data;
};
Exporter.prototype.addLevel = function addLevel(tab) {
    // get element
    var zone = uiExporter['getTab' + Util.upperCaseFirst(tab)]();
    var btn = uiExporter['getAddLevelButton' + Util.upperCaseFirst(tab)]();

    // change value
    var level = graph.addLevel(tab);

    // dom
    uiExporter.domAddLevel(btn, zone, level);
};
Exporter.prototype.addNewTable = function addNewTable(tab, level, tableId) {
    // add graph
    var graphTableId = graph.addNewTable(tab, level, tableId);

    // add dom
    uiExporter.domAddNewTable(tab, level, tableId, graphTableId);
};
Exporter.prototype.deleteTable = function deleteTable(tab, level, graphTableId, tableEl) {
    // del graph
    graph.deleteTable(tab, level, graphTableId);

    // del canvas
    canvas.render();

    // del dom
    uiExporter.domDelTable(tableEl);
};
Exporter.prototype.addTable = function addTable(tab, level, tableId, columnDetail) {
    // add graph
    var graphTableId = graph.addNewTable(tab, level, tableId);

    // add dom
    uiExporter.domAddTable(tab, level, tableId, graphTableId, columnDetail);
};
