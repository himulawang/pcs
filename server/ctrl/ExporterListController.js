exports.ExporterListController = {
    Retrieve: function Retrieve(connection, api, params) {
        var data = {
            exporterList: dataPool.get('exporterList', 0).toAbbArray(),
        };
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
