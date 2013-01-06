exports.NetController = {
    GetOnlineUserCount: function GetOnlineUserCount(connection, api, params) {
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.single(connection, api, PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
