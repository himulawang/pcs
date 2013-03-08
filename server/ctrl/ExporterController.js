exports.ExporterController = {
    Create: function Create(connection, api, params) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporterPK = dataPool.get('exporter', 'PK');
        var id = exporterPK.incr();

        var exporter = new I.Models.Exporter();
        exporter.setPK(id);
        exporter.name = 'toChanged';

        exporterList.addSync(exporter);

        var data = {
            id: id,
            exporter: exporter.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    Update: function Update(connection, api, params) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(params.id);
        exporter.fromAbbArray(params.exporter);

        exporterList.updateSync(exporter);

        var data = {
            id: params.id,
            exporter: params.exporter,
        };
        connectionPool.broadcast(api, data);
    },
    Remove: function Remove(connection, api, params) {
        var id = params.id;
        var exporterList = dataPool.get('exporterList', 0);
        exporterList.delSync(id);

        connectionPool.broadcast(api, params);
    },
};
