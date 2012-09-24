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

exports.TableAction = new TableAction();
