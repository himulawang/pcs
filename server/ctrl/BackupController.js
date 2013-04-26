exports.BackupController = {
    BackupAll: function BackupAll(connection, api, params) {
        var data = this.GetBackupData();
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
    // private
    GetBackupData: function GetBackupData() {
        var bak = {};
        for (var name in dataPool.pool) {
            var data = dataPool.pool[name];
            bak[name] = data.backup();
            var splitName = name.split('-');
            bak[name].key = splitName[0];
            bak[name].field = splitName[1];
        }
        var data = {
            bak: {
                type: 'pcs bak',
                data: bak,
            },
        };
        return data;
    },
};
