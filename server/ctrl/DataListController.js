exports.DataListController = {
    Import: function Import(connection, api, params) {
        var id = params.id;
        var importDataList = params.dataList;
        var preDataList = dataPool.get('DataList', id);
        if (preDataList) {
            preDataList.dropSync();
            var dataList = preDataList;
        } else {
            var DataListClass = I.Models.DynamicMaker.getList(id);
            var DataModelClass = I.Models.DynamicMaker.getModel(id);
            var dataList = new DataListClass(0);
        }

        var data, args;
        importDataList.forEach(function(n, i) {
            args = [i];
            n.forEach(function(m) {
                args.push(m);
            });
            data = new DataModelClass(args);
            dataList.addSync(data);
        });

        dataPool.set('DataList', id);
        /*
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.broadcast(api, data);
        */
    },
};

