var DynamicMaker = function() {
    this.changed = {};
};

DynamicMaker.prototype.getPKClass = function getPKClass(id) {
    return I.Models['Data' + id + 'PK'];
};

DynamicMaker.prototype.getModelClass = function getModelClass(id) {
    return I.Models['Data' + id];
};

DynamicMaker.prototype.getListClass = function getListClass(id) {
    return I.Models['Data' + id + 'List'];
};

DynamicMaker.prototype.getPKStoreClass = function getPKStoreClass(id) {
    return I.Models['Data' + id + 'PKStore'];
};

DynamicMaker.prototype.getModelStoreClass = function getModelStoreClass(id) {
    return I.Models['Data' + id + 'Store'];
};

DynamicMaker.prototype.getListStoreClass = function getListStoreClass(id) {
    return I.Models['Data' + id + 'ListStore'];
};

DynamicMaker.prototype.refresh = function refresh() {
    for (var id in this.changed) {
        if (this.changed[id]) this.make(id);
    }
};

DynamicMaker.prototype.make = function make(id) {
    var orm = this.makeOrm(id);
    this.makePKClass(orm);
    this.makeModelClass(orm);
    this.makeListClass(orm);

    this.makePKStoreClass(orm);
    this.makeModelStoreClass(orm);
    this.makeListStoreClass(orm);

    this.changed[id] = false;
};

DynamicMaker.prototype.makeOrm = function makeOrm(id) {
    var columnList = dataPool.get('columnList', id);
    var columns = ['c0'];
    columnList.getKeys().forEach(function(n, i) {
        columns.push('c' + n);
    });
    var orm = {
        name: 'Data' + id,
        abb: 'd' + id + '-',
        column: columns,
        toAddFilter: [],
        toUpdateFilter: [0],
        toAbbFilter: [],
        toArrayFilter: [],
        pk: 'c0',
        pkAutoIncrement: true,
        list: 'Data' + id + 'List',
        getColumnIndex: function(id) {
            return this.column.indexOf('c' + id);
        },
    };
    return orm;
};

DynamicMaker.prototype.makePKClass = function makePKClass(orm) {
    var content = '';
    content += "this.className = '" + orm.name + "PK';\n";
    content += "this.getStore = function getStore() { return I.Models." + orm.name + "PKStore; };\n";
    content += "this.init.call(this, pk);";

    var Class = new Function('pk', content);

    Class.prototype = new I.Models.PK();
    Class.prototype.constructor = Class;

    I.Models[orm.name + 'PK'] = Class;
};

DynamicMaker.prototype.makeModelClass = function makeModelClass(orm) {
    var abbs = this.makeAbbs(orm.column, []);

    // class create
    var content = '';
    content += "this.className = '" + orm.name + "';\n";
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.getStore = function getStore() { return I.Models." + orm.name + "Store; };\n";

    // column
    var columns = [];
    var abbMap = '';
    var fullMap = '';
    orm.column.forEach(function(n, i) {
        columns[i] = {
            i: i,
            full: n,
            abb: abbs[n],
            toAdd: orm.toAddFilter.indexOf(i) !== -1,
            toUpdate: orm.toUpdateFilter.indexOf(i) !== -1,
            toAbb: orm.toAbbFilter.indexOf(i) !== -1,
            toArray: orm.toArrayFilter.indexOf(i) !== -1,
        };
        abbMap += abbs[n] + ": this.column[" + i + "],\n";
        fullMap += n + ": this.column[" + i + "],\n";
    });
    content += "this.column = " + JSON.stringify(columns) + ";\n";
    content += "this.abbMap = {\n";
    content += abbMap;
    content += "};\n";
    content += "this.fullMap = {\n";
    content += fullMap;
    content += "};\n";
    content += "this.init.call(this, args);";

    var Class = new Function('args', content);

    // extends
    Class.prototype = new I.Models.Model();
    Class.prototype.constructor = Class;

    // getter & setter
    orm.column.forEach(function(v, i) {
        Object.defineProperty(
            Class.prototype,
            v,
            {
                get: function() { return this.args[i]; },
                set: function(v) { 
                    if (this.args[i] === v) return;
                    this.args[i] = v;
                    this.updateList[i] = 1;
                },
            }
        );
    });

    I.Models[orm.name] = Class;
};

DynamicMaker.prototype.makeListClass = function makeListClass(orm) {
    // class create
    var content = '';
    content += "this.className = '" + orm.list + "';\n";
    content += "this.getStore = function getStore() { return I.Models." + orm.list + "Store; };\n";
    content += "this.getChildModel = function getChildModel() { return I.Models." + orm.name + "; };\n";
    content += "this.init.call(this, pk, list);\n";

    var Class = new Function('pk', 'list', content);

    // extends
    Class.prototype = new I.Models.List();
    Class.prototype.constructor = Class;

    I.Models[orm.name + 'List'] = Class;
};

DynamicMaker.prototype.makePKStoreClass = function makePKStoreClass(orm) {
    var content = '';
    content += "this.className = '" + orm.name + "PKStore';\n";
    content += "this.key = '" + I.Const.Frame.GLOBAL_KEY_PREFIX + orm.abb + "';\n";
    content += "this.getModel = function getModel() { return I.Models." + orm.name + "PK; };\n";
    content += "this.modelName = '" + orm.name + "';\n";
    content += "this.db = db;";

    var Class = new Function('db', content);

    Class.prototype = new I.Models.PKStore();
    Class.prototype.constructor = Class;

    I.Models[orm.name + 'PKStore'] = new Class(db);
};

DynamicMaker.prototype.makeModelStoreClass = function makeModelStoreClass(orm) {
    // class create
    var content = '';
    content += "this.className = '" + orm.name + "Store';\n";
    content += "this.getModel = function getModel() { return I.Models." + orm.name + "; };\n";
    content += "this.modelName = '" + orm.name + "';\n";
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.abb = '" + orm.abb + "';\n";
    content += "this.pkAutoIncrement = " + orm.pkAutoIncrement.toString() + ";\n";
    content += "this.db = db;";

    var Class = new Function('db', content);

    // extends
    Class.prototype = new I.Models.ModelStore();
    Class.prototype.constructor = Class;

    I.Models[orm.name + 'Store'] = new Class(db);
};

DynamicMaker.prototype.makeListStoreClass = function makeListStoreClass(orm) {
    // class create
    var content = '';
    content += "this.className = '" + orm.list + "Store';\n";
    content += "this.abb = '" + orm.abb + "l';\n";

    content += "this.getListModel = function getListModel() { return I.Models." + orm.list + "; };\n";
    content += "this.listModelName = '" + orm.list + "';\n";

    content += "this.getChildModel = function getChildModel() { return I.Models." + orm.name + "; };\n";
    content += "this.childModelName = '" + orm.name + "';\n";

    content += "this.getChildStore = function getChildStore() { return I.Models." + orm.name + "Store; };\n";
    content += "this.childStoreName = '" + orm.name + "Store';\n";

    content += "this.db = db;";

    var Class = new Function('db', content);

    // extends
    Class.prototype = new I.Models.ListStore();
    Class.prototype.constructor = Class;

    I.Models[orm.list + 'Store'] = new Class(db);
};

/* Abb */
DynamicMaker.prototype.makeAbbs = function makeAbbs(columns, filter) {
    var self = this;
    var abbs = {};
    var i = 0;
    columns.forEach(function(column) {
        // filter
        if (filter.indexOf(i) !== -1) {
            ++i;
            return;
        }

        var candidateAbb = self.makeAbb(column);
        while (self.abbExist(candidateAbb, abbs)) {
            candidateAbb = self.renameAbb(candidateAbb);
        }
        abbs[column] = candidateAbb;
        ++i;
    });

    return abbs;
};

DynamicMaker.prototype.makeAbb = function makeAbb(full) {
    return (full[0] + full.replace(/[a-z]/g, '')).toLowerCase();
};

DynamicMaker.prototype.abbExist = function abbExist(abb, abbs) {
    return I.Util.valueExist(abb, abbs);
};

DynamicMaker.prototype.renameAbb = function renameAbb(abb) {
    return /^([a-zA-Z0-9]+?)(\d+)$/.test(abb) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) : abb + 1;
};

exports.DynamicMaker = new DynamicMaker();
