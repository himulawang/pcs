var TableAction = function TableAction() {};

TableAction.prototype.createTable = function createTable(syn, params, cb) {
    return TableLogic.createTable(syn, params, cb);
};

exports.TableAction = new TableAction();
