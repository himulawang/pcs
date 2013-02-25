!function () {
    var DataPool = function DataPool() {
        this.pool = {};
    };

    DataPool.prototype.makeKey = function makeKey(name, index) {
        return name + '-' + index;
    };

    DataPool.prototype.set = function set(name, index, model) {
        this.pool[this.makeKey(name, index)] = model;
    };

    DataPool.prototype.get = function get(name, index) {
        return this.pool[this.makeKey(name, index)];
    };

    DataPool.prototype.unset = function unset(name, index) {
        delete this.pool[this.makeKey(name, index)];
    };

    I.Util.require('DataPool', '', DataPool);
}();
