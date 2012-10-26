var LogicLib = {
    'getTable': function getTable(tableId) {
        this.set('tableName', 'test');
        console.log('getTable', 'tableId', tableId);
        this.next();
    },
    'verifyTable': function verifyTable() {
        this.set('verifyResult', true);
        console.log('verifyTable');
        this.next();
    },
    'output': function output(outputName) {
        console.log('output', outputName);
        this.next();
    },
};

var Runner = function() {
    this._pipe = [];        // function queue
    this._imports = [];
    this._exports = [];     // for function export data rename
    this._data = {};        // save export data
    this._now = 0;          // which function is running
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
};
Runner.prototype.next = function next() {
    var funcName = this._pipe[this._now];
    if (!funcName) { // last function
        console.log('final');
        return;
    }

    ++this._now;
    // insert middle params
    var imports = this._imports[this._now];
    var exportsName;
    var args = [];
    for (var argName in imports) {
        if (argName[0] === '_') {
            argName = argName.slice(1);
            exportsName = this._exports[this._now - 1][argName];

            console.log(exportsName, this.get(exportsName));
            args.push(this.get(exportsName));
        } else {
            args.push(imports[argName]);
        }
    console.log(args);
    }
    this[funcName].apply(this, args);
};
Runner.prototype.set = function set(name, val) {
    var exports = this._exports[this._now];
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
    exports: { tableName: 'tableName' },
});
runner.add({
    fn: LogicLib.verifyTable,
    imports: { _tableName: null },
    exports: { verifyResult: 'verifyResult1' },
});

runner.next();
