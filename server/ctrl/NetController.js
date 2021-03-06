exports.NetController = {
    GetOnlineUserCount: function GetOnlineUserCount(connection, api, params) {
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.broadcast(api, data);
    },
    Init: function Init(connection, api, params) {
        var tableList = dataPool.get('tableList', 0);
        var exporterList = dataPool.get('exporterList', 0);
        var columnLists = {};
        var dataLists = {};
        tableList.getKeys().forEach(function(n) {
            columnLists[n] = dataPool.get('columnList', n).toAbbArray();
            var dataList = dataPool.get('dataList', n);
            if (dataList) {
                dataLists[n] = dataList.toAbbArray();
            }
        });

        var data = {
            tableList: tableList.toAbbArray(),
            columnLists: columnLists,
            dataLists: dataLists,
            exporterList: exporterList.toAbbArray(),
        };
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
