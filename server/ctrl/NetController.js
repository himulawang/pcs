exports.NetController = {
    GetOnlineUserCount: function GetOnlineUserCount(connection, api, params) {
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.broadcast(api, data);
    },
    Init: function Init(connection, api, params) {
        var tableList = dataPool.get('tableList', 0);
        var columnLists = {};
        var dataLists = {};
        tableList.getKeys().forEach(function(n) {
            columnLists[n] = dataPool.get('columnList', n).toAbbArray();
            dataLists[n] = dataPool.get('dataList', n).toAbbArray();
        });

        var data = {
            tableList: tableList.toAbbArray(),
            columnLists: columnLists,
            dataLists: dataLists,
        };
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
