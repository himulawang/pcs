/* This file is generated by IFramework - Maker.js for user to rewrite PKStore file */
!function () {
    var TablePKStore = function TablePKStore(db) {
        this.db = db;
    };

    TablePKStore.prototype = new I.Models.TablePKStoreBase();
    TablePKStore.prototype.constructor = TablePKStore;

    I.Util.require('TablePKStore', 'Models', new TablePKStore(db));
}();