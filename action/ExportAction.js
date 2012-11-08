var ExportAction = function ExportAction() {};

ExportAction.prototype.getExportList = function getExportList(lc, params) {
    return ExportLogic.getExportList(lc, params);
};

ExportAction.prototype.getExportConfig = function getExportConfig(lc, params) {
    return ExportLogic.getExportConfig(lc, params);
};

ExportAction.prototype.createExport = function createExport(lc, params) {
    return ExportLogic.createExport(lc, params);
};

ExportAction.prototype.modifyExport = function modifyExport(lc, params) {
    return ExportLogic.modifyExport(lc, params);
};

ExportAction.prototype.deleteExport = function deleteExport(lc, params) {
    return ExportLogic.deleteExport(lc, params);
};

ExportAction.prototype.exportData = function exportData(lc, params) {
    return ExportLogic.deleteExport(lc, params);
};

exports.ExportAction = new ExportAction();
