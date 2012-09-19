var TableLogic = function TableLogic() {};

TableLogic.prototype.createTable = function createTable(syn, params, cb) {
    // retrieve tableList
    var tableList;
    syn.add(function() {
        TableListModel.retrieve(1, function(data) {
            tableList = data;
            syn.emit('one');
        });
    });

    syn.on('final', function() {
        throw new I.Exception(10001);
        cb(tableList.toClient());
    });
};

exports.TableLogic = new TableLogic();
