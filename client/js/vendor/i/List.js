var List = function() {};

List.prototype.init = function init(listPK, list)  {
    if (listPK === undefined) throw new Exception(10118);
    this.pk = listPK;
    this.reset(list);
};

List.prototype.reset = function reset(list) {
    this.list = list || {};

    this.toAddList = [];
    this.toDelList = [];
    this.toUpdateList = [];
};

List.prototype.add = function add(child) {
    this.toAddList.push(child);
};

// input can be index or object
List.prototype.del = function del(input) {
    var index = Util.isUInt(input) ? input : input.getPK();
    var child = this.get(index);
    this.toDelList.push(child);
};

List.prototype.update = function update(child) {
    var index = child.getPK();
    // verify child exists
    this.get(index);

    this.toUpdateList.push(child);
};


List.prototype.get = function get(pk) {
    var child = this.list[pk];
    if (!child) return null;

    return child;
};

List.prototype.insert = function insert(child) {
    this.list[child.getPK()] = child;
};

List.prototype.remove = function remove(index) {
    delete this.list[index];
};

List.prototype.getKeys = function getKeys() {
    var keys = [];
    for (var i in this.list) {
        keys.push(i);
    }
    return keys;
};

List.prototype.getPK = function getPK() { return this.pk; };

List.prototype.toClient = function toClient() {
    var toClient = {};
    for (var i in this.list) {
        toClient[i] = this.list[i].toClient();
    }
    return toClient;
};

List.prototype.getList = function getList() {
    return this.list;
};

List.prototype.last = function last() {
    return Util.last(this.list);
};

List.prototype.fromServer = function fromServer(dataList) {
    var child;
    for (var i in dataList) {
        child = new this.childObject();
        child.fromServer(dataList[i]);
        this.insert(child);
    }
};
