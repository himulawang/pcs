var ExportLogic = function ExportLogic() {};

ExportLogic.prototype.getExportList = function getExportList(syn, params, cb) {
    // retrieve exportList
    var exportList;
    syn.add(function() {
        ExportListModel.retrieve(0, function(err, data) {
            if (err) return cb(err);
            exportList = data;
            syn.emit('next');
        });
    });

    // return
    syn.on('final', function() {
        cb(null, { el: exportList.toClient() });
    });
};

exports.ExportLogic = new ExportLogic();
