var ExportAction = function ExportAction() {};

ExportAction.prototype.getExportList = function getExportList(syn, params, cb) {
    return ExportLogic.getExportList(syn, params, cb);
};

exports.ExportAction = new ExportAction();
