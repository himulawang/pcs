/* This file is generated by IFramework - Maker.js for user to rewrite ListStore file */
!function () {
    var ColumnListStore = function ColumnListStore(db) {
    this.db = db;
    };

    ColumnListStore.prototype = new I.Models.ColumnListStoreBase();
    ColumnListStore.prototype.constructor = ColumnListStore;

    I.Util.require('ColumnListStore', 'Models', new ColumnListStore(db));
}();