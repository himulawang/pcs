exports.ColumnController = {
    Create: function Create(connection, api, params) {
        var columnList = dataPool.get('columnList', params.listId);
        var pk = dataPool.incr(ColumnModel.abb);

        var column = new Column();
        column.setPK(pk);
        columnList.insert(column);

        var data = {
            id: pk,
            listId: params.listId,
            column: column.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Update: function Update(connection, api, params) {
        var columnList = dataPool.get('columnList', params.listId);
        var column = columnList.get(params.id);
        column.fromAbbArray(params.column); 

        var data = {
            listId: params.listId,
            id: column.id,
            column: column.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
};
