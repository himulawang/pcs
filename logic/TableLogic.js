var TableLogic = function TableLogic() {};

TableLogic.prototype.createTable = function createTable(syn, params, cb) {
    // retrieve tableList
    var tableList;
    syn.add(function() {
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            syn.emit('next');
        });
    });

    syn.add(function() {
        // verify table not exists
        var list = tableList.getList();
        for (var i in list) {
            if (list[i].name == params.tableName) {
                return cb(new I.Exception(20001));
            }
        }
        
        // add table
        var table = new Table();
        table.name = params.tableName;
        table.sort = 1;
        table.description = params.description;

        tableList.add(table);
        TableListModel.update(tableList, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            syn.emit('next');
        });
    });

    // add structure
    var structureList;
    syn.add(function() {
        var table = tableList.last();
        var id = table.getPK();

        structureList = new StructureList(id);
        var structure, option;
        for (var i in params.options) {
            option = params.options[i];
            structure = new Structure([
                null,
                i,
                option.isPK,
                option.allowEmpty,
                option.type,
                option.client,
                option.server,
                option.description,
            ]);
            structureList.add(structure);
        }
        StructureListModel.update(structureList, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });

    syn.on('final', function() {
        cb(null, {
            tl: tableList.toClient(),
            sl: structureList.toClient(),
        });
    });
};
TableLogic.prototype.getTableList = function getTableList(syn, params, cb) {
    // retrieve tableList
    var tableList;
    syn.add(function() {
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            syn.emit('next');
        });
    });

    syn.on('final', function() {
        cb(null, {
            tl: tableList.toClient(),
        });
    });
};
TableLogic.prototype.getStructure = function getStructure(syn, params, cb) {
    // retrieve tableList
    var id = params.id;
    var tableList, table;
    syn.add(function() {
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            table = tableList.get(id);
            if (table === null) return cb(new I.Exception(50004));
            syn.emit('next');
        });
    });

    // retrieve structureList
    var structureList;
    syn.add(function() {
        StructureListModel.retrieve(params.id, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });

    syn.on('final', function() {
        cb(null, {
            sl: structureList.toClient(),
            t: table.toClient(),
        });
    });
};
TableLogic.prototype.modifyStructure = function modifyStructure(syn, params, cb) {
    // retrieve tableList
    var id = params.id;
    var tableList, table;
    syn.add(function() {
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            table = tableList.get(id);
            if (table === null) return cb(new I.Exception(50007));
            syn.emit('next');
        });
    });

    // get structureList
    var structureList;
    syn.add(function() {
        StructureListModel.retrieve(table.id, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });

    // del structure
    var structure;
    syn.add(function() {
        if (!params.delOptions) syn.emit('next');
        var id;
        for (var i in params.delOptions) {
            delStructureId = params.delOptions[i];
            structure = structureList.get(id);
            if (structure === null) continue;

            structureList.del(id);
        }
    });

    // add structure
    syn.add(function() {
        if (!params.addOptions) syn.emit('next');
        var option;
        for (var i in params.addOptions) {
            option = params.addOptions[i];
            structure = new Structure([
                null,
                i,
                option.isPK,
                option.allowEmpty,
                option.type,
                option.client,
                option.server,
                option.description,
            ]);
            structureList.add(structure);
        };
    });

    // upadte structure
    syn.add(function() {
        if (!params.updateOptions) syn.emit('next');
        var option, id;
        for (var updateIndex in params.updateOptions) {
            option = params.updateOptions[updateIndex];
            id = updateIndex.substr(1);
            structure = structureList.get(id);

            if (structure === null) continue;

            if (option.name != structure.name) structure.name = option.name;
            if (option.isPK != structure.isPK) structure.isPK = option.isPK;
            if (option.allowEmpty != structure.allowEmpty) structure.allowEmpty = option.allowEmpty;
            if (option.type != structure.type) structure.type = option.type;
            if (option.client != structure.client) structure.client = option.client;
            if (option.server != structure.server) structure.server = option.server;
            if (option.description != structure.description) structure.description = option.description;
            structureList.update(structure);
        };
        StructureListModel.update(structure, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });

    // update tableList
    syn.add(function() {
        // verify table not exists
        var list = tableList.getList();
        for (var i in list) {
            if (list[i].name == params.tableName) {
                return cb(new I.Exception(20002));
            }
        }
        syn.emit('next');
    });
    

    syn.on('final', function() {
        cb(null, params);
    });
};

exports.TableLogic = new TableLogic();
