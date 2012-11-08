var FileSystem = function FileSystem() {};

FileSystem.prototype.downloadFile = function downloadFile() {
    var fileName = 'a.json';
    var b = new Blob(['1111'], { type: 'application/octet-stream' });
    var url = webkitURL.createObjectURL(b);
    var link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    link.href = url;
    link.download = fileName;
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    var onSuccess = function(fs) {
        fs.root.getFile(fileName, { create: true }, function(file) {
            file.createWriter(function(writer) {
                writer.onwriteend = function() {
                    link.dispatchEvent(e);
                    webkitURL.revokeObjectURL(url);
                };
                writer.write(b);
            })
        });
    };
    webkitRequestFileSystem(window.TEMPORARY, b.size, onSuccess);
};
