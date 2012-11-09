exports.ExportLogicLib = {
    getExportList: function getExportList() {
        /*
         * @import void
         * @export ExportList       exportList
         * */
        var self = this;
        ExportListModel.retrieve(0, function(err, data) {
            if (err) return self.cb(err);
            self.set('exportList', data);
            self.next();
        });
    },
    addExport: function addExport(exportName, description, exportList) {
        /*
         * @import String           exportName
         * @import String           description
         * @import ExportList       exportList
         * @export ExportList       exportList
         * */
        var self = this;

        var ept = new Export();
        ept.name = exportName;
        ept.description = description;
        ept.sort = 0; //TODO

        exportList.add(ept);
        ExportListModel.update(exportList, function(err, data) {
            if (err) return self.cb(err);
            self.set('exportList', data);
            self.next();
        });
    },
    delExport: function delExport(ept, exportList) {
        /*
         * @import Export           ept
         * @import ExportList       exportList
         * @export ExportList       exportList
         * */
        var self = this;
        exportList.del(ept);
        ExportListModel.update(exportList, function(err, data) {
            if (err) return self.cb(err);
            self.set('exportList', data);
            self.next();
        });
    },
    updateExport: function updateExport(ept, exportList, exportName, description) {
        /*
         * @import Export           ept
         * @import ExportList       exportList
         * @import String           exportName
         * @import String           description
         * @export ExportList       exportList
         * */
        var self = this;
        ept.name = exportName;
        ept.description = description;
        ept.sort = 0;

        exportList.update(ept);

        ExportListModel.update(exportList, function(err, data) {
            if (err) return self.cb(err);
            self.set('exportList', data);
            self.next();
        });
    },
    addExportConfig: function addExportConfig(exportList, client, server) {
        /*
         * @import ExportList       exportList
         * @import Object           client
         * @import Object           server
         * @export ExportList       exportList
         * */
        var self = this;
        var pk = exportList.last().getPK();

        // client
        var exportConfigClient = new ExportConfig();
        exportConfigClient.id = pk + ICSConst.EXPORT_CONFIG_CLIENT_SUFFIX;
        exportConfigClient.path = client.path;
        exportConfigClient.fileName = client.filename;
        exportConfigClient.graphTableIds = client.graphTableIds;
        exportConfigClient.graphStructure = client.graphStructure;
        exportConfigClient.columnDetail = client.columnDetail;
        exportConfigClient.canvas = client.canvas;

        // server
        var exportConfigServer = new ExportConfig();
        exportConfigServer.id = pk + ICSConst.EXPORT_CONFIG_SERVER_SUFFIX;
        exportConfigServer.path = server.path;
        exportConfigServer.fileName = server.filename;
        exportConfigServer.graphTableIds = server.graphTableIds;
        exportConfigServer.graphStructure = server.graphStructure;
        exportConfigServer.columnDetail = server.columnDetail;
        exportConfigServer.canvas = server.canvas;

        ExportConfigModel.add(exportConfigClient, function(err, data) {
            if (err) return self.cb(err);
            ExportConfigModel.add(exportConfigServer, function(err, data) {
                if (err) return self.cb(err);
                self.next();
            });
        });
    },
    verifyExportExists: function verifyExportExists(exportList, id) {
        /*
         * @import ExportList       exportList
         * @import Number           id
         * @export Export           ept
         * */
            ept = exportList.get(id);
            if (ept === null) return this.cb(new I.Exception(20102));
            this.set('ept', ept);
            this.next();
    },
    verifyExportNameNotExists: function verifyExportNameNotExists(exportList, exportName, skipId) {
        /*
         * @import ExportList       exportList
         * @import String           exportName
         * @import Number           skipId
         * @export void
         * */
        var list = exportList.getList();
        exportName = exportName.toLowerCase();
        for (var i in list) {
            if (i == skipId) continue;
            if (list[i].name.toLowerCase() === exportName) return this.cb(new I.Exception(20101));
        }
        this.next();
    },
    getClientExportConfig: function getClientExportConfig(id) {
        /*
         * @import Number           id
         * @import String           exportName
         * @export ExportConfig     clientExportConfig
         * */
        var self = this;
        ExportConfigModel.retrieve(id + ICSConst.EXPORT_CONFIG_CLIENT_SUFFIX, function(err, data) {
            if (err) return self.cb(err);
            self.set('clientExportConfig', data);
            self.next();
        });
    },
    updateClientExportConfig: function updateClientExportConfig(client, clientExportConfig) {
        /*
         * @import Object           client
         * @import ExportConfig     clientExportConfig
         * @export ExportConfig     clientExportConfig
         * */
        var self = this;
        clientExportConfig.path = client.path;
        clientExportConfig.fileName = client.filename;
        clientExportConfig.graphTableIds = client.graphTableIds;
        clientExportConfig.graphStructure = client.graphStructure;
        clientExportConfig.columnDetail = client.columnDetail;
        clientExportConfig.canvas = client.canvas;

        ExportConfigModel.update(clientExportConfig, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    deleteClientExportConfig: function deleteClientExportConfig(id) {
        /*
         * @import Number           id
         * @export void
         * */
        var self = this;
        ExportConfigModel.del(id + ICSConst.EXPORT_CONFIG_CLIENT_SUFFIX, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    getServerExportConfig: function getServerExportConfig(id) {
        /*
         * @import Number           id
         * @import String           exportName
         * @export ExportConfig     serverExportConfig
         * */
        var self = this;
        ExportConfigModel.retrieve(id + ICSConst.EXPORT_CONFIG_SERVER_SUFFIX, function(err, data) {
            if (err) return self.cb(err);
            self.set('serverExportConfig', data);
            self.next();
        });
    },
    updateServerExportConfig: function updateServerExportConfig(server, serverExportConfig) {
        /*
         * @import Object           server
         * @import ExportConfig     serverExportConfig
         * @export ExportConfig     serverExportConfig
         * */
        var self = this;
        serverExportConfig.path = server.path;
        serverExportConfig.fileName = server.filename;
        serverExportConfig.graphTableIds = server.graphTableIds;
        serverExportConfig.graphStructure = server.graphStructure;
        serverExportConfig.columnDetail = server.columnDetail;
        serverExportConfig.canvas = server.canvas;

        ExportConfigModel.update(serverExportConfig, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    deleteServerExportConfig: function deleteServerExportConfig(id) {
        /*
         * @import Number           id
         * @export void
         * */
        var self = this;
        ExportConfigModel.del(id + ICSConst.EXPORT_CONFIG_SERVER_SUFFIX, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    exportData: function exportData(config) {
        /*
         * @import ExportConfig     config
         * @export void
        'id',
        'path',
        'fileName',
        'graphTableIds',
        'graphStructure',
        'columnDetail',
        'canvas',
         * */
        var graphStructure = config.graphStructure;
        var graphTableIds = config.graphTableIds;

        var structures, graphTableId;
        for (var level in graphStructure) {
            structures = graphStructure[level];
            for (var structureIndex in structures) {
                graphTableId = structures[structureIndex];
                tableId = graphTableIds[graphTableId];
            }
        }
    },
    cbGetExportList: function cbGetExportList(exportList) {
        /*
         * @import ExportList       exportList
         * @export void
         * */
        this.cb(null, { el: exportList.toClient() });
    },
    cbCreateExport: function cbCreateExport() {
        /*
         * @import void
         * @export void
         * */
        this.cb(null, {});
    },
    cbGetExportConfig: function cbGetExportConfig(ept, clientExportConfig, serverExportConfig) {
        this.cb(null, {
            e: ept.toClient(),
            ecc: clientExportConfig.toClient(),
            ecs: serverExportConfig.toClient(),
        });
    },
    cbModifyExport: function cbModifyExport() {
        /*
         * @import void
         * @export void
         * */
        this.cb(null, {});
    },
    cbDeleteExport: function cbDeleteExport() {
        /*
         * @import void
         * @export void
         * */
        this.cb(null, {});
    },
};
