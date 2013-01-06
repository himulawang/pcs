exports.TableListController = {
    Retrieve: function Retrieve(connection, api, params) {
        var data = {
            tableList: dataPool.tableList.toClient(),
        };
        connectionPool.single(connection, api, PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
