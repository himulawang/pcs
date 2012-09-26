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
            if (list[i].name.toLowerCase() == params.tableName.toLowerCase()) {
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
        if (!params.delOptions) return syn.emit('next');
        var id;
        for (var i in params.delOptions) {
            id = params.delOptions[i];
            structure = structureList.get(id);
            if (structure === null) continue;

            structureList.del(id);
        }
        syn.emit('next');
    });

    // add structure
    syn.add(function() {
        if (!params.addOptions) return syn.emit('next');
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
        syn.emit('next');
    });

    // upadte structure
    syn.add(function() {
        if (!params.updateOptions) return syn.emit('next');
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
        syn.emit('next');
    });

    // update tableName and description
    syn.add(function() {
        // verify table not exists
        var list = tableList.getList();
        for (var i in list) {
            if (list[i].name.toLowerCase() == params.tableName.toLowerCase()) {
                if (i == params.id) continue;
                return cb(new I.Exception(20002));
            }
        }

        if (params.tableName != table.name) table.name = params.tableName;
        if (params.description != table.description) table.description = params.description;

        tableList.update(table);
        TableListModel.update(tableList, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            syn.emit('next');
        });
    });

    // update structureList
    syn.add(function() {
        StructureListModel.update(structureList, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });
    
    syn.on('final', function() {
        cb(null, {});
    });
};
TableLogic.prototype.deleteTable = function deleteTable(syn, params, cb) {
    // retrieve tableList
    var id = params.id;
    var tableList, table;
    syn.add(function() {
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            table = tableList.get(id);
            if (table === null) return cb(new I.Exception(50010));
            syn.emit('next');
        });
    });

    // del table
    syn.add(function() {
        tableList.del(table);
        TableListModel.update(tableList, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            syn.emit('next');
        });
    });

    // get structureList
    var structureList;
    syn.add(function() {
        StructureListModel.retrieve(id, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });

    // del structureList
    syn.add(function() {
        StructureListModel.del(structureList, function(err, data) {
            if (err) return cb(err);
            syn.emit('next');
        });
    });

    // return
    syn.on('final', function() {
        cb(null, {});
    });
};
TableLogic.prototype.uploadData = function uploadData(syn, params, cb) {
    // retrieve tableList
    var name = params.tableName;
    var tableList, table;
    syn.add(function() {
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return cb(err);
            tableList = data;
            table = tableList.getTableByTableName(name);
            if (table === null) return cb(new I.Exception(50104));
            syn.emit('next');
        });
    });

    // retrieve structureList
    var structureList;
    syn.add(function() {
        StructureListModel.retrieve(table.id, function(err, data) {
            if (err) return cb(err);
            structureList = data;
            syn.emit('next');
        });
    });

    // validate data
    var inputData;
    syn.add(function() {
        inputData = params.data;
        // TODO PK / TYPE / ALLOW EMPTY
        syn.emit('next');
    });

    // make dynamic class
    var dynamicMaker = new DynamicMaker();
    var dataTableName = dynamicMaker.makeDataTableName(params.tableName);
    syn.add(function() {
        dynamicMaker.make(table, structureList);
        syn.emit('next');
    });

    // retrieve data list
    var DataListModel;
    var dataList;
    syn.add(function() {
        DataListModel = global[dataTableName + 'ListModel'];
        DataListModel.retrieve(0, function(err, data) {
            if (err) return cb(err);
            dataList = data;
            syn.emit('next');
        });
    });

    // clear data list
    syn.add(function() {
        DataListModel.del(dataList, function(err, data) {
            if (err) return cb(err);
            dataList = data;
            syn.emit('next');
        });
    });

    // insert data
    syn.add(function() {
        inputData.forEach(function(n, i) {
            // skip title
            if (i === 0) return;
            var initData = [null];
            for (var i in n) {
                initData.push(n[i]);
            }
            var data = new global[dataTableName](initData);
            dataList.add(data);
        });
        DataListModel.update(dataList, function(err, data) {
            if (err) return cb(err);
            dataList = data;
            syn.emit('next');
        });
    });

    // return
    syn.on('final', function() {
        cb(null, { dl: dataList.toClient() });
        dynamicMaker.clear();
    });
};

exports.TableLogic = new TableLogic();
