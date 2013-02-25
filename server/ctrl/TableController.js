exports.TableController = {
    Create: function Create(connection, api, params) {
        // table
        var table = new I.Models.Table();
        var pk = dataPool.get('table', 'PK').incr();

        table.setPK(pk);
        table.markAddSync();
        dataPool.get('tableList', 0).addSync(table);

        // columnList
        var columnList = new I.Models.ColumnList(pk);
        dataPool.set('columnList', pk, columnList);

        var data = {
            table: table.toAbbArray(),
            columnList: columnList.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Update: function Update(connection, api, params) {
        var tableList = dataPool.get('tableList', 0)
        var table = tableList.get(params.id);
        table.fromAbbArray(params.table);

        tableList.updateSync(table);

        var data = {
            id: table.id,
            table: table.toAbbDiff(),
        };
        connectionPool.broadcast(api, data);
    },
    Remove: function Remove(connection, api, params) {
        var id = params.id;
        // table
        var tableList = dataPool.get('tableList', 0);
        tableList.delSync(id);

        // columnList
        var columnList = dataPool.get('columnList', id);
        dataPool.del('columnList', id);

        // dataList
        var dataList = dataPool.get('dataList', id);
        if (dataList) {
            dataPool.del('dataList', id);
        }

        var data = {
            id: id,
        };
        connectionPool.broadcast(api, data);
    },
};
