var DataPool = function DataPool() {
    this.pool = {};
};

DataPool.prototype.set = function set(name, index, model) {
    this.pool[name + '-' + index] = model;
};

DataPool.prototype.get = function get(name, index) {
    return this.pool[name + '-' + index];
};

/*
DataPool.prototype.setPK = function setPK(name, value) {
    this.pool[I.Const.GLOBAL_KEY_PREFIX + name] = value === null ? 0 : value;
};

DataPool.prototype.getPK = function getPK(name) {
    return this.pool[I.Const.GLOBAL_KEY_PREFIX + name];
};

DataPool.prototype.incr = function incr(name) {
    return ++this.pool[I.Const.GLOBAL_KEY_PREFIX + name];
};
*/
