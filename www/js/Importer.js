var Importer = function() {};

Importer.prototype.importFileRequest = function importFileRequest(tableName) {
    var fileList = $('#inputDataFile')[0].files;
    if (fileList.length === 0) {
        throw new Exception(50102);
    }

    var reader = new FileReader();

    var self = this;
    reader.onload = function(e) {
        var data = self.parseFile(this.result);
        self.uploadData(tableName, data);
    };
    reader.readAsText(fileList[0]);
};
Importer.prototype.importFilesRequest = function importFilesRequest() {
    var fileList = $('#inputDataFiles')[0].files;
    if (fileList.length === 0) {
        throw new Exception(50102);
    }

    var lc = new LogicController();
    for (var i = 0; i < fileList.length; ++i) {
        lc.add({
            fn: this.loadFileData,
            imports: { file: fileList[0] },
            exports: { data: 'data' + i },
        });
        var dataName = '_data' + i;
        var imports = {};
        imports['tableName'] = Util.getFileBasename(fileList[i].name);
        imports[dataName] = null;
        lc.add({
            fn: this.importFile,
            imports: imports,
            exports: {},
        });
    }
    lc.cb(function(){});
    lc.next();
};
Importer.prototype.loadFileData = function loadFileData(file) {
    /*
     * @importer File           file
     * @exporter Object         data
     * */
    var self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = importer.parseFile(this.result);
        self.set('data', data);
        self.next();
    };
    reader.readAsText(file);
};
Importer.prototype.importFile = function importFile(tableName, data) {
    /*
     * @importer String         tableName
     * @exporter void
     * */
    var self = this;
    $.post('./uploadData', { req: 'uploadData', tableName: tableName, data: data }, function(json) {
        var obj = Util.parse(json);
        self.next();
    });
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
