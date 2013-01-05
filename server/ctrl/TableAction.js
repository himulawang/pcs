var TableAction = function TableAction() {};

TableAction.prototype.createTable = function createTable(lc, params) {
    return TableLogic.createTable(lc, params);
};
TableAction.prototype.getTableList = function getTableList(lc, params) {
    return TableLogic.getTableList(lc, params);
};
TableAction.prototype.getStructure = function getStructure(lc, params) {
    return TableLogic.getStructure(lc, params);
};
TableAction.prototype.modifyStructure = function modifyStructure(lc, params) {
    return TableLogic.modifyStructure(lc, params);
};
TableAction.prototype.deleteTable = function deleteTable(lc, params) {
    return TableLogic.deleteTable(lc, params);
};
TableAction.prototype.uploadData = function uploadData(lc, params) {
    return TableLogic.uploadData(lc, params);
};
TableAction.prototype.getData = function getData(lc, params) {
    return TableLogic.getData(lc, params);
};

exports.TableAction = new TableAction();
