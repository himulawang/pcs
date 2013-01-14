exports.ColumnController = {
    Create: function Create(connection, api, params) {
        var columnList = dataPool.get('columnList', params.listId);
        var pk = dataPool.get('column', 'PK').get().incr();

        var column = new I.Models.Column();
        column.setPK(pk);
        columnList.addSync(column);

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
