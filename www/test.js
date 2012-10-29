var LogicLib = {
    'getTable': function getTable(tableId1) {
        console.log('getTable', 'tableId', tableId1);
        this.set('tableName', 'test');
        this.next();
    },
    'verifyTable': function verifyTable(tableName, outputName) {
        this.set('verifyResult', tableName);
        console.log(tableName, outputName);
        this.next();
    },
    'output': function output(outputName) {
        //console.log('output', outputName);
        this.next();
    },
};

var Runner = function() {
    this._pipe = [];        // function queue
    this._imports = [];
    this._exports = [];     // for function export data rename
    this._exported = [];    // check function export all values
    this._data = {};        // save export data
    this._now = -1;         // which function is running
};

Runner.prototype.add = function add(params) {
    fn = params.fn;
    // reg func
    if (this[fn.name]) {
        console.warn(fn.name, 'exists when add function to runner.');
    } else {
        this[fn.name] = fn;
    }
    this._pipe.push(fn.name);

    this._imports.push(params.imports);
    this._exports.push(params.exports);

    var exported = {};
    for (var i in params.exports) {
        exported[i] = 0;
    }
    this._exported.push(exported);
};
Runner.prototype.next = function next() {
    // check previous function export all values
    for (var i in this._exported[this._now]) {
        if (!this._exported[this._now][i]) throw new Error(i + ' not set.');
    }

    ++this._now;
    var funcName = this._pipe[this._now];
    if (!funcName) { // last function
        console.log('final');
        return;
    }

    // insert middle params
    var imports = this._imports[this._now] ? this._imports[this._now] : {};
    var exportsName;
    var args = [];
    for (var argName in imports) {
        if (argName[0] === '_') {
            argName = argName.slice(1);
            args.push(this.get(argName));
        } else {
            args.push(imports[argName]);
        }
    }
    this[funcName].apply(this, args);
};
Runner.prototype.set = function set(name, val) {
    var exports = this._exports[this._now];
    this._exported[this._now][name] = 1;
    if (exports[name]) {
        name = exports[name];
    }

    this._data[name] = val;
};
Runner.prototype.get = function get(name) {
    return this._data[name];
};

var runner = new Runner();

var tableId = 1;
var outputName = 'ila';

runner.add({
    fn: LogicLib.getTable,
    imports: { tableId: tableId },
    exports: { tableName: 'tableName1' },
});
runner.add({
    fn: LogicLib.getTable,
    imports: { tableId: tableId },
    exports: { tableName: 'tableName2' },
});
runner.add({
    fn: LogicLib.verifyTable,
    imports: { '_tableName1': null, outputName: outputName },
    exports: { verifyResult: 'verifyResult1' },
});
runner.add({
    fn: LogicLib.verifyTable,
    imports: { '_tableName2': null, outputName: outputName },
    exports: { verifyResult: 'verifyResult2' },
});

runner.next();
