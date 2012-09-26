var Importer = function() {};

Importer.prototype.importFiles = function importFiles() {
    var fileList = $('#inputDataFiles')[0].files;
    if (fileList.length === 0) {
        throw new Exception(50102);
    }
    var reader = new FileReader();

    var self = this;
    reader.onload = function(e) {
        var data = self.parseFile(this.result);
        var tableName = Util.getFileBasename(fileList[0].name);
        self.uploadData(tableName, data);
    };
    reader.readAsText(fileList[0]);
};
Importer.prototype.parseFile = function parseFile(content) {
    var lines = content.split("\n");
    if (lines.length <= 1) throw new Exception(50101);

    var data = [];
    lines.forEach(function(n, i) {
        data[i] = n.split("\t");
        if (data[0].length !== data[i].length) throw new Exception(50103);
    });
    return data;
};
Importer.prototype.uploadData = function uploadData(tableName, data) {
    $.post('./uploadData', { req: 'uploadData', tableName: tableName, data: data }, function(json) {
        var obj = Util.parse(json);
    });
};
