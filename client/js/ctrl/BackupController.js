var BackupController = {
    BackupAll: function BackupAll() {
        iWebSocket.send('C1001', {});
    },
    onBackupAll: function onBackupAll(data) {
        var name = 'Backup_' + I.Util.getTime() + '.pcs';
        FileSystem.saveToLocal(name, JSON.stringify(data.bak));
    },
};
