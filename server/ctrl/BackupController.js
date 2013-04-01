exports.BackupController = {
    BackupAll: function BackupAll(connection, api, params) {
        var bak = {};
        for (var name in dataPool.pool) {
            var data = dataPool.pool[name];
            bak[name] = data.backup();
        }
        var data = {
            bak: bak,
        };
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
