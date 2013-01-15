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
        columnList.markAddSync();
        dataPool.set('columnList', pk, columnList);

        var data = {
            table: table.toAbbArray(),
            columnList: columnList.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Update: function Update(connection, api, params) {
        var table = dataPool.get('tableList', 0).get(params.id);
        table.fromAbbArray(params.table);

        var data = {
            id: table.id,
            table: table.toAbbDiff(),
        };
        connectionPool.broadcast(api, data);
    },
};
