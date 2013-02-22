exports.ColumnController = {
    Create: function Create(connection, api, params) {
        var listId = params.listId;
        var columnList = dataPool.get('columnList', listId);
        var pk = dataPool.get('column', 'PK').incr();

        var column = new I.Models.Column();
        column.setPK(pk);
        column.allowEmpty = 1;
        column.name = 'toChange';
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
        if (dataList === undefined) return;

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
            /*
            var array = preData.toAdd();
            array.push('');
            var newData = new ModelClass(array);
            */
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
        var columnList = dataPool.get('columnList', params.listId);
        columnList.delSync(params.id);

        var data = {
            listId: params.listId,
            id: params.id,
        };
        connectionPool.broadcast(api, data);
    },
};
