exports.ColumnController = {
    Create: function Create(connection, api, params) {
        var listId = params.listId;
        var columnList = dataPool.get('columnList', listId);
        var pk = dataPool.get('column', 'PK').incr();

        var column = new I.Models.Column();
        column.setPK(pk);
        column.allowEmpty = 1;
        column.name = 'DefaultColumn';
        column.type = 'string';
        column.markAddSync();
        columnList.addSync(column);

        var data = {
            id: pk,
            listId: listId,
            column: column.toAbbArray(),
        };
        connectionPool.broadcast(api, data);

        // if tableData exists change it
        var dataList = dataPool.get('dataList', listId);
        if (dataList === undefined) {
            // make altered class
            var orm = I.Lib.DynamicMaker.makeOrm(listId);
            I.Lib.DynamicMaker.makeModelClass(orm);
            return;
        }

        // sync to redis
        var StoreClass = dataList.getStore();
        StoreClass.sync(dataList);

        // make altered class
        var orm = I.Lib.DynamicMaker.makeOrm(listId);
        I.Lib.DynamicMaker.makeModelClass(orm);

        // add column
        var ModelClass = dataList.getChildModel();
        for (var i in dataList.list) {
            var preData = dataList.get(i);
            var newData = preData.clone();
            var array = preData.toAdd();
            array.push('.');
            var newData = new ModelClass(array);
            newData['c' + pk] = '';
            dataList.updateSync(newData);
        }
        StoreClass.sync(dataList);

        // boardcast
        var output = {
            id: listId,
            dataList: dataList.toAbbArray(),
        };
        connectionPool.broadcast('C0501', output);
    },
    Update: function Update(connection, api, params) {
        var columnList = dataPool.get('columnList', params.listId);
        var column = columnList.get(params.id);
        column.fromAbbArray(params.column); 
        columnList.updateSync(column);

        var data = {
            listId: params.listId,
            id: column.id,
            column: column.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Remove: function Remove(connection, api, params) {
        var listId = params.listId;
        var id = params.id;

        var columnList = dataPool.get('columnList', listId);
        columnList.delSync(params.id);

        // delete export define column
        var exporterList = dataPool.get('exporterList', 0);

        var exporterDiffList = {};
        for (var exporterId in exporterList.list) {
            var exporter = exporterList.get(exporterId);
            I.Ctrl.ExporterController.removeExporterColumn(id, exporter);
            exporterList.updateSync(exporter);

            exporterDiffList[exporterId] = exporter.toAbbDiff();
        }

        var data = {
            listId: listId,
            id: params.id,
            exporterList: exporterDiffList,
        };
        connectionPool.broadcast(api, data);

        // if tableData exists change it
        var dataList = dataPool.get('dataList', listId);
        if (dataList === undefined) {
            // make altered class
            var orm = I.Lib.DynamicMaker.makeOrm(listId);
            I.Lib.DynamicMaker.makeModelClass(orm);
            return;
        }

        // delete all data
        var rawData = dataList.toAbbArray();

        // drop redis data
        dataList.dropSync();
        var StoreClass = dataList.getStore();
        StoreClass.sync(dataList);

        // make altered class
        var orm = I.Lib.DynamicMaker.makeOrm(listId);
        I.Lib.DynamicMaker.makeModelClass(orm);

        // new data to list
        var ModelClass = dataList.getChildModel();
        for (var i in rawData) {
            delete rawData[i]['c' + id];
            var newData = new ModelClass();
            newData.fromAbbArray(rawData[i]);
            dataList.addSync(newData);
        }

        // boardcast
        var output = {
            id: listId,
            dataList: dataList.toAbbArray(),
        };
        connectionPool.broadcast('C0501', output);
    },
};
