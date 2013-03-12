exports.ExporterController = {
    Create: function Create(connection, api, params) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporterPK = dataPool.get('exporter', 'PK');
        var id = exporterPK.incr();

        var exporter = new I.Models.Exporter();
        exporter.setPK(id);
        exporter.name = 'toChanged';
        exporter.changed = 0;
        exporter.rootTableId = 0;
        var detail = {
            pk: null,
            choose: [],
            rename: {},
        };
        exporter.rootTableDetail = JSON.stringify(detail);
        exporter.tables = '[]';
        exporter.levels = '{"1":[]}';
        exporter.links = '{}';
        
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
    UpdateRootTable: function UpdateRootTable(connection, api, params) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(params.id);
        var tableId = params.tableId;

        if (exporter.rootTableId == tableId) return;
        exporter.rootTableId = tableId;

        var columnList = dataPool.get('columnList', tableId);
        var detail = JSON.parse(exporter.rootTableDetail);
        // links
        detail.choose = columnList.getKeys();
        exporter.rootTableDetail = JSON.stringify(detail);

        exporterList.updateSync(exporter);

        var data = {
            id: params.id,
            tableId: tableId,
            exporter: exporter.toAbbArray(),
        };
        connectionPool.broadcast(api, data);
    },
    AddBlock: function AddBlock(connection, api, params) {
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(params.id);
        var tableId = params.tableId;

        // blocks
        var blocks = JSON.parse(exporter.tables);
        var blockId = blocks.push(tableId) - 1;
        exporter.tables = JSON.stringify(blocks);

        // levels
        var level = params.level;
        var levels = JSON.parse(exporter.levels);
        if (levels[level] === undefined) levels[level] = [];
        levels[level].push(blockId);
        exporter.levels = JSON.stringify(levels);

        // links
        var columnList = dataPool.get('columnList', tableId);
        var links = JSON.parse(exporter.links);
        links[blockId] = {
            id: blockId,
            pk: null,
            choose: columnList.getKeys(),
            bind: {
                fromBlock: null,
                fromColumn: null,
                toBlock: null,
                toColumn: null,
                color: null,
            },
            rename: {},
        };
        exporter.links = JSON.stringify(links);

        exporterList.updateSync(exporter);

        var data = {
            id: params.id,
            level: level,
            exporter: exporter.toAbbDiff(),
            tableId: params.tableId,
            blockId: blockId,
        };
        connectionPool.broadcast(api, data);
    },
    RemoveBlock: function RemoveBlock(connection, api, params) {
        var id = params.id;
        var level = params.level;
        var blockId = params.blockId;
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(id);

        // tables
        var tables = JSON.parse(exporter.tables);
        tables[blockId] = null;
        exporter.tables = JSON.stringify(tables);

        // levels
        var levels = JSON.parse(exporter.levels);
        var index = levels[level].indexOf(blockId);
        if (index !== -1) levels[level].splice(index, 1);
        exporter.levels = JSON.stringify(levels);

        // links
        var links = JSON.parse(exporter.links);
        delete links[blockId];
        exporter.links = JSON.stringify(links);

        exporterList.updateSync(exporter);

        var data = {
            id: id,
            level: level,
            exporter: exporter.toAbbDiff(),
            blockId: blockId,
        };
        connectionPool.broadcast(api, data);
    },
    RootTableRenameChange: function RootTableRenameChange(connection, api, params) {
        var id = params.id;
        var columnId = params.columnId;
        var rename = params.rename;
        var exporterList = dataPool.get('exporterList', 0);
        var exporter = exporterList.get(id);

        var detail = JSON.parse(exporter.rootTableDetail);
        if (rename === '') {
            delete detail.rename[columnId];
        } else {
            detail.rename[columnId] = rename;
        }
        exporter.detail = JSON.stringify(detail);

        exporterList.updateSync(exporter);

        var data = {
            id: id,
            exporter: exporter.toAbbDiff(),
            columnId: columnId,
        };
        connectionPool.broadcast(api, data);
    },
};
