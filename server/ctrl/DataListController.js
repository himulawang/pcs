exports.DataListController = {
    Import: function Import(connection, api, params) {
        var id = params.id;
        var importDataList = params.dataList;
        var preDataList = dataPool.get('DataList', id);
        if (preDataList) {
            preDataList.dropSync();
            var dataList = preDataList;
            var dataPK = dataPool.get('DataPK', id);
        } else {
            var DataPKClass = I.Lib.DynamicMaker.getPKClass(id);
            var DataListClass = I.Lib.DynamicMaker.getListClass(id);
            var DataModelClass = I.Lib.DynamicMaker.getModelClass(id);
            var dataList = new DataListClass(0);
            var dataPK = new DataPKClass();
        }

        // list
        var data, args;
        importDataList.forEach(function(n, i) {
            args = [i + 1];
            n.forEach(function(m) {
                args.push(m);
            });
            data = new DataModelClass(args);
            dataList.addSync(data);
        });

        dataPool.set('DataList', id, dataList);

        // pk
        dataPK.set(importDataList.length);
        dataPool.set('DataPK', id, dataPK);

        /*
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.broadcast(api, data);
        */
    },
};

