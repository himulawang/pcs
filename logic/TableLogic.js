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

    /*
    // verify table not exists
    syn.add(function() {
        tableList.get(1);
    });
    */

    syn.on('final', function() {
        cb(tableList.toClient());
        throw new I.Exception(10001);
    });
};

exports.TableLogic = new TableLogic();
