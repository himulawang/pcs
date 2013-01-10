var Maker = function() {};

/* Loader */
Maker.prototype.loadOrms = function loadOrm(orms) {
    this.checkModelAbbs(orms);

    var self = this;
    this.classes = {};

    orms.forEach(function(orm) {
        self.loadOrm(orm);
    });
};

Maker.prototype.loadOrm = function loadOrm(orm) {
    this.makeObjectClass(orm);
    if (orm.list) {
        this.makeListClass(orm);
    }
};

Maker.prototype.checkModelAbbs = function checkModelAbbs(orms) {
    var repeats = {};
    var list;
    orms.forEach(function(orm) {
        if (repeats[orm.abb]) throw new Exception(10002);
        repeats[orm.abb] = true;

        if (orm.list) {
            list = orm.abb + 'l';
            if (repeats[list]) throw new Exception(10002);
            repeats[list] = true;
        }
    });
};

Maker.prototype.getClasses = function getClasses() {
    return this.classes;
};

/* Maker */
Maker.prototype.makeObjectClass = function makeObjectClass(orm) {
    var abbs = this.makeAbbs(orm.column, orm.clientFilter);

    // class create
    var content = '';
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.column = " + JSON.stringify(orm.column) + ";\n";
    content += "this.abb = " + JSON.stringify(abbs) + ";\n";
    var invertAbb = {};
    for (var full in abbs) {
        invertAbb[abbs[full]] = full;
    }
    content += "this.invertAbb = " + JSON.stringify(invertAbb) + ";\n";

    var Class = new Function('args', content);

    // extends
    Class.prototype = new IObject();
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

    this.classes[orm.name + 'Base'] = Class;
};

Maker.prototype.makeObjectModelClass = function makeObjectModelClass(orm) {
    // class create
    var content = '';
    content += "this.type = " + IConst.OBJECT_TYPE_HASH + ";\n";
    content += "this.objectName = '" + orm.name + "';\n";
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.abb = '" + orm.abb + "';\n";
    content += "this.pkAutoIncrement = " + orm.pkAutoIncrement.toString() + ";\n";
    content += "this.updateFilter = " + JSON.stringify(orm.updateFilter) + ";\n";

    var Class = new Function(content);

    // extends
    Class.prototype = new Model();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'ModelBase'] = Class;
};

Maker.prototype.makeListClass = function makeListClass(orm) {
    // class create
    var content = '';
    content += "this.childModel = " + orm.name + ";";

    var Class = new Function('pk', 'list', content);

    // extends
    Class.prototype = new List();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'ListBase'] = Class;
};

Maker.prototype.makeListModelClass = function makeListModelClass(orm) {
    // class create
    var content = '';
    content += "this.type = " + IConst.OBJECT_TYPE_LIST + ";\n";
    content += "this.objectName = '" + orm.list + "';\n";
    content += "this.abb = '" + orm.abb + "l';\n";
    content += "this.child = '" + orm.name + "';\n";
    content += "this.childModel = '" + orm.name + "Model';\n";

    var Class = new Function(content);

    // extends
    Class.prototype = new Model();
    Class.prototype.constructor = Class;

    this.classes[orm.list + 'ModelBase'] = Class;
};

/* Abb */
Maker.prototype.makeAbbs = function makeAbbs(columns, filter) {
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

Maker.prototype.makeAbb = function makeAbb(full) {
    return (full[0] + full.replace(/[a-z]/g, '')).toLowerCase();
};

Maker.prototype.abbExist = function abbExist(abb, abbs) {
    return Util.valueExist(abb, abbs);
};

Maker.prototype.renameAbb = function renameAbb(abb) {
    return /^([a-zA-Z0-9]+?)(\d+)$/.test(abb) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) : abb + 1;
};

window.maker = new Maker();
maker.loadOrms(orms);
for (var className in maker.classes) {
    window[className] = maker.classes[className];
}
