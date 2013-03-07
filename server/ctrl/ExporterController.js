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
    },
    Remove: function Remove(connection, api, params) {
        var id = params.id;
        var exporterList = dataPool.get('exporterList', 0);
        exporterList.delSync(id);

        connectionPool.broadcast(api, params);
    },
};
