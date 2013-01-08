var IObject = function IObject() {};

IObject.prototype.init = function init(args) {
    var self = this;
    this.args = [];

    this.resetUpdateList();
    if (Array.isArray(args)) {
        args.forEach(function(val, index) {
            self.args[index] = val;
        });
    } else {
        for (var i = 0; i < this.column.length; ++i) {
            this.args[i] = '';
        }
    }
};

IObject.prototype.setPK = function setPK(val) { this[this.pk] = val; };
IObject.prototype.getPK = function getPK() { return this[this.pk]; }

IObject.prototype.clone = function clone() { return new this.constructor(this.args); }; 
IObject.prototype.resetUpdateList = function resetUpdateList() { this.updateList = new Array(this.column.length); };

IObject.prototype.toAdd = function toAdd() { 
    var toAdd = [];
    this.args.forEach(function(v, i) {
        toAdd[i] = v.toString();
    });
    return toAdd; 
};
IObject.prototype.toUpdate = function toUpdate() {
    var self = this;
    var toDB = {};
    this.updateList.forEach(function(v, i) {
        if (v === 1) toDB[i] = self.args[i].toString();
    });
    return toDB;
};
IObject.prototype.toAbbArray = function toAbbArray() {
    var toArray = {};
    for (var column in this.abb) {
        toArray[this.abb[column]] = this[column];
    }
    return toArray;
};
IObject.prototype.fromAbbArray = function fromAbbArray(data, resetUpdateList) {
    if (resetUpdateList === undefined) {
        resetUpdateList = true;
    }
    var full;
    for (var abb in data) {
        full = this.invertAbb[abb];
        this[full] = data[abb];
    }
    if (resetUpdateList) {
        this.resetUpdateList();
    }
};
