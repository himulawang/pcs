exports.DataListController = {
    Import: function Import(connection, api, params) {
        var id = params.id;
        var importDataList = params.dataList;
        var preDataList = dataPool.get('dataList', id);
        var DataPKClass = I.Lib.DynamicMaker.getPKClass(id);
        var DataListClass = I.Lib.DynamicMaker.getListClass(id);
        var DataModelClass = I.Lib.DynamicMaker.getModelClass(id);

        if (preDataList) {
            preDataList.dropSync();
            var dataList = preDataList;
            var dataPK = dataPool.get('dataPK', id);
        } else {
            var dataList = new DataListClass(id);
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

        dataPool.set('dataList', id, dataList);

        // pk
        dataPK.set(importDataList.length);
        dataPool.set('dataPK', id, dataPK);

        var output = {
            id: id,
            dataList: dataList.toAbbArray(),
        };
        connectionPool.broadcast(api, output);
    },
};
