var ExportAction = function ExportAction() {};

ExportAction.prototype.getExportList = function getExportList(syn, params, cb) {
    return ExportLogic.getExportList(syn, params, cb);
};

ExportAction.prototype.createExport = function createExport(syn, params, cb) {
    return ExportLogic.createExport(syn, params, cb);
};

ExportAction.prototype.getExportConfig = function getExportConfig(syn, params, cb) {
    return ExportLogic.getExportConfig(syn, params, cb);
};

exports.ExportAction = new ExportAction();
