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
Exporter.prototype.clickExportName = function clickExportName(id) {
    var self = this;
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

            self.restoreExport('client', graph.convertNetData(obj.ecc));
            self.restoreExport('server', graph.convertNetData(obj.ecs));

            canvas.set(obj.ecc, obj.ecs);
            canvas.render();
        }, obj);
    });
};
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
            this.addNewTable(tab, level, data.graphTableIds[graphTableId]);
        }
    }
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
    uiExporter.domAddTable(tab, level, tableId, graphTableId);
};
