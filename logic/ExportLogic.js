var ExportLogic = function ExportLogic() {};

ExportLogic.prototype.getExportList = function getExportList(syn, params, cb) {
    // retrieve exportList
    var exportList;
    syn.add(function() {
        ExportListModel.retrieve(0, function(err, data) {
            if (err) return cb(err);
            exportList = data;
            syn.emit('next');
        });
    });

    // return
    syn.on('final', function() {
        cb(null, { el: exportList.toClient() });
    });
};

ExportLogic.prototype.createExport = function createExport(syn, params, cb) {
    // retrieve exportList
    var exportList;
    syn.add(function() {
        ExportListModel.retrieve(0, function(err, data) {
            if (err) return cb(err);
            exportList = data;
            syn.emit('next');
        });
    });

    // verify exists exportName
    syn.add(function() {
        var list = exportList.getList();
        for (var i in list) {
            if (list[i].name.toLowerCase() === params.exportName.toLowerCase()) {
                return cb(new I.Exception(20101));
            }
        }
        syn.emit('next');
    });

    // add export
    syn.add(function() {
        var ept = new Export();
        ept.name = params.exportName;
        ept.description = params.description;
        ept.sort = 0;

        exportList.add(ept);
        ExportListModel.update(exportList, function(err, data) {
            if (err) return cb(err);
            exportList = data;
            syn.emit('next');
        });
    });

    // add export config
    syn.add(function() {
        var pk = exportList.last().getPK();

        // client
        var exportConfigClient = new ExportConfig();
        exportConfigClient.id = pk + ICSConst.EXPORT_CONFIG_CLIENT_SUFFIX;
        exportConfigClient.path = params.client.path;
        exportConfigClient.fileName = params.client.filename;
        exportConfigClient.graphTableIds = params.client.graphTableIds;
        exportConfigClient.graphStructure = params.client.graphStructure;
        exportConfigClient.columnDetail = params.client.columnDetail;
        exportConfigClient.canvas = params.client.canvas;

        // server
        var exportConfigServer = new ExportConfig();
        exportConfigServer.id = pk + ICSConst.EXPORT_CONFIG_SERVER_SUFFIX;
        exportConfigServer.path = params.server.path;
        exportConfigServer.fileName = params.server.filename;
        exportConfigServer.graphTableIds = params.server.graphTableIds;
        exportConfigServer.graphStructure = params.server.graphStructure;
        exportConfigServer.columnDetail = params.server.columnDetail;
        exportConfigServer.canvas = params.server.canvas;

        ExportConfigModel.add(exportConfigClient, function(err, data) {
            if (err) return cb(err);
            ExportConfigModel.add(exportConfigServer, function(err, data) {
                if (err) return cb(err);
                syn.emit('next');
            });
        });
    });

    // return
    syn.on('final', function() {
        cb(null, {});
    });
};

ExportLogic.prototype.getExportConfig = function getExportConfig(syn, params, cb) {
    var ept;
    var exportConfigClient, exportConfigServer;

    // get export
    syn.add(function() {
        ExportListModel.retrieve(0, function(err, data) {
            if (err) return cb(err);
            var exportList = data;

            ept = exportList.get(params.id);
            if (ept === null) return cb(new I.Exception(20102));
            syn.emit('next');
        });
    });

    // get client export config
    syn.add(function() {
        ExportConfigModel.retrieve(params.id + ICSConst.EXPORT_CONFIG_CLIENT_SUFFIX, function(err, data) {
            if (err) return cb(err);
            exportConfigClient = data;
            syn.emit('next');
        });
    });

    // get server export config
    syn.add(function() {
        ExportConfigModel.retrieve(params.id + ICSConst.EXPORT_CONFIG_SERVER_SUFFIX, function(err, data) {
            if (err) return cb(err);
            exportConfigServer = data;
            syn.emit('next');
        });
    });

    // return
    syn.on('final', function() {
        cb(null, {
            e: ept.toClient(),
            ecc: exportConfigClient.toClient(),
            ecs: exportConfigServer.toClient(),
        });
    });
};

exports.ExportLogic = new ExportLogic();
