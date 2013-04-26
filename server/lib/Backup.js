var Backup = function Backup(path, backupInterval) {
    this.lastBackupTime = 0;
    this.path = path;
    this.backupInterval = backupInterval || 86400;
};

Backup.prototype.backup = function backup() {
    var nowStamp = I.Util.getTimestamp();
    if (nowStamp - this.lastBackupTime < this.backupInterval) return;

    var data = I.Ctrl.BackupController.GetBackupData();
    var fs = require('fs');
    var datetime = I.Util.getTime();
    var filepath = this.path + '/' + datetime + '.pcs';
    fs.writeFile(filepath, JSON.stringify(data), function() {
        console.log('*Backup* Done', filepath);
    });
    this.lastBackupTime = nowStamp;
};

exports.Backup = Backup;
