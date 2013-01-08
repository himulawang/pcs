exports.TableController = {
    Create: function Create(connection, api, params) {
        var table = new Table();
        var pk = dataPool.incr(TableModel.abb);

        table.setPK(pk);
        dataPool.get('tableList', 0).insert(table);

        var data = {
            table: table.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Update: function Update(connection, api, params) {
        var table = dataPool.get('tableList', 0).get(params.id);
        table.fromAbbArray(params.table);

        var data = {
            id: table.id,
            table: table.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
};
