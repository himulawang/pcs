/* This file is generated by IFramework - Maker.js for user to rewrite List file */
!function () {
    var ColumnList = function ColumnList(pk, list) {
        this.init.call(this, pk, list);
    };

    ColumnList.prototype = new I.Models.ColumnListBase();
    ColumnList.prototype.constructor = ColumnList;

    ColumnList.prototype.retrieve = function retrieve(id) {
        iWebSocket.send('C0301', { id: id });
    };

    I.Util.require('ColumnList', 'Models', ColumnList);
}();
