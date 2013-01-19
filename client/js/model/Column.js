/* This file is generated by IFramework - Maker.js for user to rewrite Model file */
!function () {
    var Column = function Column(args) {
        this.init.call(this, args);
    };

    Column.prototype = new I.Models.ColumnBase();
    Column.prototype.constructor = Column;

    Column.prototype.create = function create(listId) {
        iWebSocket.send('C0401', { listId: listId });
    };

    Column.prototype.update = function update(listId, column) {
        iWebSocket.send('C0402', { listId: listId, id: column.id, column: column.toAbbDiff() });
    };

    Column.prototype.remove = function remove(listId, id) {
        iWebSocket.send('C0403', { listId: listId, id: id });
    };

    I.Util.require('Column', 'Models', Column);
}();
