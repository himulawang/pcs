exports.TableController = {
    Create: function Create(connection, api, params) {
        // table
        var table = new I.Models.Table();
        var pk = dataPool.get('table', 'PK').incr();

        table.setPK(pk);
        table.name = 'DefaultTable';
        table.markAddSync();
        dataPool.get('tableList', 0).addSync(table);

        // columnList
        var columnList = new I.Models.ColumnList(pk);
        dataPool.set('columnList', pk, columnList);

        // dynamicClass
        I.Lib.DynamicMaker.make(pk);

        // dataList
        var DataPKClass = I.Lib.DynamicMaker.getPKClass(pk);
        var DataListClass = I.Lib.DynamicMaker.getListClass(pk);
        var dataList = new DataListClass(pk);
        var dataPK = new DataPKClass();
        dataPool.set('dataList', pk, dataList);
        dataPool.set('dataPK', pk, dataPK);

        var data = {
            table: table.toAbbArray(),
            columnList: columnList.toAbbArray(),
            dataList: dataList.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Update: function Update(connection, api, params) {
        var tableList = dataPool.get('tableList', 0)
        var table = tableList.get(params.id);
        table.fromAbbArray(params.table);

        tableList.updateSync(table);

        var data = {
            id: table.id,
            table: table.toAbbDiff(),
        };
        connectionPool.broadcast(api, data);
    },
    Remove: function Remove(connection, api, params) {
        var id = params.id;
        // table
        var tableList = dataPool.get('tableList', 0);
        tableList.delSync(id);

        // columnList
        var columnList = dataPool.get('columnList', id);
        dataPool.del('columnList', id);

        // dataList
        var dataList = dataPool.get('dataList', id);
        if (dataList) {
            dataPool.del('dataList', id);
        }

        // dataPK
        var dataPK = dataPool.get('dataPK', id);
        if (dataPK) {
            dataPool.del('dataPK', id);
        }

        // exporter define
        var exporterList = dataPool.get('exporterList', 0);
        var exporterDiffList = {};
        for (var exporterId in exporterList.list) {
            var exporter = exporterList.get(exporterId);
            I.Ctrl.ExporterController.removeExporterBlock(id, exporter);
            exporterList.updateSync(exporter);
            exporterDiffList[exporterId] = exporter.toAbbDiff();
        }

        var data = {
            id: id,
            exporterList: exporterDiffList,
        };
        connectionPool.broadcast(api, data);
    },
};
