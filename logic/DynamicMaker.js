/* This Class can dynamicly create data tableBo / List / Model / ModelList
 * if tableName = user, class name will be:
 * DUser
 * DUserList
 * DUserModel
 * DUserListModel
 * */
var DynamicMaker = function DynamicMaker() {};

DynamicMaker.prototype.make = function make(table, structureList) {
    this.clear();
    var orm = this.makeOrm(table, structureList);
    this.makeObjectClass(orm);
    this.makeObjectModelClass(orm);
    this.makeListClass(orm);
    this.makeListModelClass(orm);
    this.makeClassGlobal();
};
DynamicMaker.prototype.clear = function clear() {
    for (var i in this.classes) {
        delete global[i];
    }
    this.classes = [];
};
DynamicMaker.prototype.makeOrm = function makeOrm(table, structureList) {
    var dataTableName = this.makeDataTableName(table.name);
    var abb = this.makeAbb(dataTableName);
    var column = structureList.getColumnArray(['_I']);
    
    return {
        name: dataTableName,
        abb: abb,
        column: column,
        updateFilter: [0],
        clientFilter: [],
        pk: '_I',
        pkAutoIncrement: true,
        list: dataTableName + 'List',
    };
};
DynamicMaker.prototype.makeObjectClass = function makeObjectClass(orm) {
    var abbs = this.makeAbbs(orm.column, orm.clientFilter);

    // class create
    var content = '';
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.column = " + JSON.stringify(orm.column) + ";\n";
    content += "this.abb = " + JSON.stringify(abbs) + ";\n";
    content += "this.init.call(this, args);";

    var Class = new Function('args', content);

    // extends
    Class.prototype = new I.Object();
    Class.prototype.constructor = Class;

    // getter & setter
    orm.column.forEach(function(v, i) {
        Object.defineProperty(
            Class.prototype,
            v,
            {
                get: function() { return this.args[i]; },
                set: function(v) { this.args[i] = v; this.updateList[i] = 1; }
            }
        );
    });

    this.classes[orm.name] = Class;
};
DynamicMaker.prototype.makeObjectModelClass = function makeObjectModelClass(orm) {
    // class create
    var content = '';
    content += "this.type = " + I.Const.OBJECT_TYPE_HASH + ";\n";
    content += "this.objectName = '" + orm.name + "';\n";
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.abb = '" + orm.abb + "';\n";
    content += "this.pkAutoIncrement = " + orm.pkAutoIncrement.toString() + ";\n";
    content += "this.updateFilter = " + JSON.stringify(orm.updateFilter) + ";\n";

    var Class = new Function(content);

    // extends
    Class.prototype = new I.Model();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'Model'] = new Class();
};
DynamicMaker.prototype.makeListClass = function makeListClass(orm) {
    // class create
    var content = '';
    content += "this.init.call(this, pk, list);";

    var Class = new Function('pk', 'list', content);

    // extends
    Class.prototype = new I.List();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'List'] = Class;
};
DynamicMaker.prototype.makeListModelClass = function makeListModelClass(orm) {
    // class create
    var content = '';
    content += "this.type = " + I.Const.OBJECT_TYPE_LIST + ";\n";
    content += "this.objectName = '" + orm.list + "';\n";
    content += "this.abb = '" + orm.abb + "l';\n";
    content += "this.child = '" + orm.name + "';\n";
    content += "this.childModel = '" + orm.name + "Model';\n";

    var Class = new Function(content);

    // extends
    Class.prototype = new I.Model();
    Class.prototype.constructor = Class;

    this.classes[orm.list + 'Model'] = new Class();
};
DynamicMaker.prototype.makeDataTableName = function makeDataTableName(tableName) {
    return 'D' + I.Util.upperCaseFirst(tableName);
};
DynamicMaker.prototype.makeClassGlobal = function makeClassGlobal() {
    for (var i in this.classes) {
        global[i] = this.classes[i];
    }
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

exports.DynamicMaker = DynamicMaker;
