!function () {
    var PK = function PK() {};

    PK.prototype.init = function init(pk) {
        this.updated = false;
        this.pk = pk || 0;
    };

    PK.prototype.set = function set(pk) {
        this.pk = parseInt(pk);
        this.updated = true;
    };

    PK.prototype.get = function get() {
        return this.pk;
    };

    PK.prototype.incr = function incr(val) {
        val = val || 1;
        var newVal = this.get() + val;
        this.set(newVal);
        return newVal;
    };

    PK.prototype.reset = function reset() {
        this.set(0);
    };

    I.Util.require('PK', 'Models', PK);
}();