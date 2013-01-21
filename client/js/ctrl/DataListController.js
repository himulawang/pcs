var DataListController = {
    Import: function Import(id) {
        iWebSocket.send('C0501', { id: id, dataList: Importer.data });
        /*
        // clear pre
        var preDataList = dataPool.get('DataList', id);
        if (preDataList) {
            // drop data to server
            //preDataList.dropSync();
        }

        // new dataList
        var DataListClass = dynamicMaker.getList(id);
        var DataModelClass = dynamicMaker.getModel(id);
        var dataList = new DataListClass(0);

        var data, args;
        datas.forEach(function(n, i) {
            args = [i];
            n.forEach(function(m, j) {
                args.push(m);
            });
            data = new DataModelClass(args);
            dataList.set(data);
        });

        dataPool.set('DataList', id, dataList);
        */
    },
};

