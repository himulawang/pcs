var ExportLogic = function ExportLogic() {};

ExportLogic.prototype.getExportList = function getExportList(lc, params) {
    lc.add({
        fn: ExportLogicLib.getExportList,
        imports: {},
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.cbGetExportList,
        imports: { _exportList: null },
        exports: {},
    });
};
ExportLogic.prototype.createExport = function createExport(lc, params) {
    lc.add({
        fn: ExportLogicLib.getExportList,
        imports: {},
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.verifyExportNameNotExists,
        imports: { _exportList: null, exportName: params.exportName, skipId: null },
        exports: {},
    });
    lc.add({
        fn: ExportLogicLib.addExport,
        imports: { 
            exportName: params.exportName,
            description: params.description,
            _exportList: null
        },
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.addExportConfig,
        imports: { 
            _exportList: null,
            client: params.client,
            server: params.server,
        },
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.cbCreateExport,
        imports: {},
        exports: {},
    });
};
ExportLogic.prototype.getExportConfig = function getExportConfig(lc, params) {
    lc.add({
        fn: ExportLogicLib.getExportList,
        imports: {},
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.verifyExportExists,
        imports: { _exportList: null, id: params.id },
        exports: { ept: 'ept' },
    });
    lc.add({
        fn: ExportLogicLib.getClientExportConfig,
        imports: { id: params.id },
        exports: { clientExportConfig: 'clientExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.getServerExportConfig,
        imports: { id: params.id },
        exports: { serverExportConfig: 'serverExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.cbGetExportConfig,
        imports: { _ept: null, _clientExportConfig: null, _serverExportConfig: null },
        exports: {},
    });
};
ExportLogic.prototype.modifyExport = function modifyExport(lc, params) {
    lc.add({
        fn: ExportLogicLib.getExportList,
        imports: {},
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.verifyExportNameNotExists,
        imports: { _exportList: null, exportName: params.exportName, skipId: params.id },
        exports: {},
    });
    lc.add({
        fn: ExportLogicLib.verifyExportExists,
        imports: { _exportList: null, id: params.id },
        exports: { ept: 'ept' },
    });
    lc.add({
        fn: ExportLogicLib.updateExport,
        imports: { 
            _ept: null,
            _exportList: null,
            exportName: params.exportName,
            description: params.description,
        },
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.getClientExportConfig,
        imports: { id: params.id },
        exports: { clientExportConfig: 'clientExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.getServerExportConfig,
        imports: { id: params.id },
        exports: { serverExportConfig: 'serverExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.updateClientExportConfig,
        imports: { client: params.client, _clientExportConfig: null },
        exports: { clientExportConfig: 'clientExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.updateServerExportConfig,
        imports: { server: params.server, _serverExportConfig: null },
        exports: { serverExportConfig: 'serverExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.cbModifyExport,
        imports: {},
        exports: {},
    });
};
ExportLogic.prototype.deleteExport = function deleteExport(lc, params) {
    lc.add({
        fn: ExportLogicLib.getExportList,
        imports: {},
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.verifyExportExists,
        imports: { _exportList: null, id: params.id },
        exports: { ept: 'ept' },
    });
    lc.add({
        fn: ExportLogicLib.delExport,
        imports: { _ept: null, _exportList: null },
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.deleteClientExportConfig,
        imports: { id: params.id },
        exports: {},
    });
    lc.add({
        fn: ExportLogicLib.deleteServerExportConfig,
        imports: { id: params.id },
        exports: {},
    });
    lc.add({
        fn: ExportLogicLib.cbDeleteExport,
        imports: {},
        exports: {},
    });
};
/*
ExportLogic.prototype.exportData = function exportData(lc, params) {
    lc.add({
        fn: ExportLogicLib.getExportList,
        imports: {},
        exports: { exportList: 'exportList' },
    });
    lc.add({
        fn: ExportLogicLib.verifyExportExists,
        imports: { _exportList: null, id: params.id },
        exports: { ept: 'ept' },
    });
    lc.add({
        fn: ExportLogicLib.getClientExportConfig,
        imports: { id: params.id },
        exports: { clientExportConfig: 'clientExportConfig' },
    });
    lc.add({
        fn: ExportLogicLib.storeBatchTableData,
        imports: { _clientExportConfig: null },
        exports: {},
    });
    lc.add({
        fn: ExportLogicLib.getServerExportConfig,
        imports: { id: params.id },
        exports: { serverExportConfig: 'serverExportConfig' },
    });
};
*/
exports.ExportLogic = new ExportLogic();
