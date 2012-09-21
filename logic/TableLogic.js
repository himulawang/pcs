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
        table.description = '';

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

exports.TableLogic = new TableLogic();
