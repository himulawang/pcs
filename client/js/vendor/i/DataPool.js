!function () {
    var DataPool = function DataPool() {
        this.pool = {};
    };

    DataPool.prototype.set = function set(name, index, model) {
        this.pool[name + '-' + index] = model;
    };

    DataPool.prototype.get = function get(name, index) {
        return this.pool[name + '-' + index];
    };

    I.Util.require('DataPool', '', DataPool);
}();
