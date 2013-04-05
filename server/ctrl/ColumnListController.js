exports.ColumnListController = {
    Retrieve: function Retrieve(connection, api, params) {
        var data = {
            id: params.id,
            columnList: dataPool.get('columnList', params.id).toAbbArray(),
        };
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
