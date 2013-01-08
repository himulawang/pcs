exports.TableListController = {
    Retrieve: function Retrieve(connection, api, params) {
        var data = {
            tableList: dataPool.get('tableList', 0).toAbbArray(),
        };
        connectionPool.single(connection, api, PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
