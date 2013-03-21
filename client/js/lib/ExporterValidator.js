var ExporterValidator = {
    check: function check(exporterId) {
        var exporter = dataPool.get('exporterList', 0).get(exporterId);
        // check root table selected
        if (exporter.rootTableId == 0) return 'Root table not selected.';

        // check root table pk
        var detail = JSON.parse(exporter.rootTableDetail);
        if (detail.pk === null) return 'Root table has no pk.';

        // check level column name conflict
        var levels = JSON.parse(exporter.levels);
        var tables = JSON.parse(exporter.tables);
        var links = JSON.parse(exporter.links);

        var tableList = dataPool.get('tableList', 0);
        for (var level in levels) {
            var levelArray = levels[level];
            var namePool = [];
            // if root table
            if (level == 1) {
                var rootColumnList = dataPool.get('columnList', exporter.rootTableId);
                for (var columnId in rootColumnList.list) {
                    var rootColumn = rootColumnList.get(columnId);
                    // is renamed
                    var name;
                    if (detail.rename[columnId] === undefined) {
                        name = rootColumn.name;
                    } else {
                        name = detail.rename[columnId];
                    }
                    if (I.Util.valueExist(name, namePool)) return 'Level' + level + ' has conflict columnName ' + name;
                    namePool.push(name);
                }
            }

            for (var blockIdIndex in levelArray) {
                var blockId = levelArray[blockIdIndex];
                var tableId = tables[blockId];

                var columnList = dataPool.get('columnList', tableId);
                for (var columnId in columnList.list) {
                    var column = columnList.get(columnId);
                    // is renamed
                    var name;
                    if (links[blockId].rename[columnId] === undefined) {
                        name = column.name;
                    } else {
                        name = links[blockId].rename[columnId];
                    }
                    if (I.Util.valueExist(name, namePool)) return 'Level' + level + ' has conflict columnName ' + name;
                    namePool.push(name);
                }
            }
        }

        return true;
    },
};
