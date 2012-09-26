var TableAction = function TableAction() {};

TableAction.prototype.createTable = function createTable(syn, params, cb) {
    return TableLogic.createTable(syn, params, cb);
};
TableAction.prototype.getTableList = function getTableList(syn, params, cb) {
    return TableLogic.getTableList(syn, params, cb);
};
TableAction.prototype.getStructure = function getStructure(syn, params, cb) {
    return TableLogic.getStructure(syn, params, cb);
};
TableAction.prototype.modifyStructure = function modifyStructure(syn, params, cb) {
    return TableLogic.modifyStructure(syn, params, cb);
};
TableAction.prototype.deleteTable = function deleteTable(syn, params, cb) {
    return TableLogic.deleteTable(syn, params, cb);
};
TableAction.prototype.uploadData = function uploadData(syn, params, cb) {
    return TableLogic.uploadData(syn, params, cb);
};
TableAction.prototype.getData = function getData(syn, params, cb) {
    return TableLogic.getData(syn, params, cb);
};

exports.TableAction = new TableAction();
