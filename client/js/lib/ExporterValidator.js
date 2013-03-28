var ExporterValidator = function ExporterValidator() {
    this.existColumns = {};
    this.defines = {};
    this.results = {};
    this.exporter = null;
    this.rootTableDetail = null;
    this.links = {};

    this.tableList = null;
};

ExporterValidator.prototype.validate = function validate() {
    var exporterId = $('#ExporterDefine')[0].dataset.id;
    try {
        this.preview(exporterId);
    } catch (e) {
        return this.error(e.msg);
    }
    this.success();
};

ExporterValidator.prototype.error = function error(msg) {
    $('#ExporterDefine-Status').removeClass('alert-success').addClass('alert-error').text(msg);
};
ExporterValidator.prototype.success = function success() {
    $('#ExporterDefine-Status').removeClass('alert-error').addClass('alert-success').text('Passed!');
};

ExporterValidator.prototype.preview = function preview(exporterId) {
    this.tableList = dataPool.get('tableList', 0);
    this.exporter = dataPool.get('exporterList', 0).get(exporterId);
    this.rootTableDetail = JSON.parse(this.exporter.rootTableDetail);
    // check root table selected
    if (this.exporter.rootTableId == 0) throw new ExporterException('Root table not selected.');

    // init defines
    this.createDefines();

    this.expandAll(this.results, this.existColumns, this.defines);
    console.log(this);
};

ExporterValidator.prototype.expandAll = function expandAll(results, existColumns, defines, escapeExpandColumn) {
    // root table
    if (I.Util.getLength(this.results) === 0) {
        // creat existColumns
        var rootTable = this.tableList.get(this.exporter.rootTableId);

        // check pk
        if (this.rootTableDetail.pk === null) throw new ExporterException('Root table has not pk.');

        // fake data for root table
        this.rootTableDetail.bind = { fromBlockId: 'root' };
        var newColumns = this.createExistColumns(existColumns, rootTable, this.rootTableDetail, 1);
        this.mergeColumns(existColumns, newColumns);

        // import root table data
        var rootPKName = 'c' + this.rootTableDetail.pk;
        var dataList = dataPool.get('dataList', this.exporter.rootTableId);
        for (var i in dataList.list) {
            var data = dataList.get(i);
            var pk = data[rootPKName];
            results[pk] = {};
            for (var name in this.existColumns) {
                var existColumn = this.existColumns[name];
                results[pk][name] = data[existColumn.columnCName];
            }
        }
    }

    // same level
    for (var blockId in defines) {
        var define = defines[blockId];
        this.expandSameLevel(results, existColumns, define, escapeExpandColumn);
    }

    // next level
    for (var blockId in defines) {
        var define = defines[blockId];
        this.expandNextLevel(results, existColumns, define);
    }

};

ExporterValidator.prototype.expandSameLevel = function expandSameLevel(results, existColumns, define, escapeExpandColumn) {
    for (var resultName in existColumns) {
        var existColumn = existColumns[resultName];
        if (!(
            existColumn.level == define.toLevel &&
            define.fromLevel == define.toLevel &&
            existColumn.blockId == define.toBlockId &&
            existColumn.columnId == define.toColumnId
        )) continue;

        if (!escapeExpandColumn) {
            var newColumns = this.createExistColumns(existColumns, this.tableList.get(define.fromTableId), this.links[define.fromBlockId], define.fromLevel);
            this.mergeColumns(existColumns, newColumns);
        }
        this.expandSameLevelData(results, existColumns, existColumn, define);
    }
};
ExporterValidator.prototype.expandNextLevel = function expandNextLevel(results, existColumns, define) {
    for (var resultName in existColumns) {
        var existColumn = existColumns[resultName];
        if (!(
            define.fromLevel - existColumn.level === 1 &&
            define.fromLevel - define.toLevel === 1 &&
            existColumn.blockId == define.toBlockId &&
            existColumn.columnId == define.toColumnId
        )) continue;

        // expand column
        var blockName = define.fromBlockRename || define.fromTableName;
        var nextLevelExistColumns = {};
        nextLevelExistColumns[blockName] = {};
        var newColumns = this.createExistColumns(nextLevelExistColumns, this.tableList.get(define.fromTableId), this.links[define.fromBlockId], define.fromLevel);
        existColumns[blockName] = newColumns;
        this.expandNextLevelData(results, existColumn, define, newColumns);
    }
};
ExporterValidator.prototype.expandSameLevelData = function expandSameLevelData(results, existColumns, existColumn, define) {
    var fromDataList = dataPool.get('dataList', define.fromTableId);
    for (var pk in results) {
        var value = results[pk][define.toColumnResultName];
        var row = this.findRowByColumn(fromDataList, value, define.fromColumnCName);

        for (var resultName in define.fromColumns) {
            var fromColumn = define.fromColumns[resultName];
            if (row === null) {
                results[pk][resultName] = null;
            } else {
                results[pk][resultName] = row[fromColumn.cname];
            }
        }
    }
};
ExporterValidator.prototype.findRowByColumn = function findRowByColumn(dataList, value, findCName) {
    // only find one first value
    for (var i in dataList.list) {
        var data = dataList.get(i);
        if ((data[findCName] + '') === (value + '')) return data;
    }
    return null;
};

ExporterValidator.prototype.expandNextLevelData = function expandNextLevelData(results, existColumn, define, existColumns) {
    var fromDataList = dataPool.get('dataList', define.fromTableId);
    var pkName = define.fromBlockRename || define.fromTableName;
    var line = 1;
    for (var pk in results) {
        var value = results[pk][define.toColumnResultName];
        var rows = this.findRowsByColumn(fromDataList, value, define.fromColumnCName);

        var newRows = {};
        for (var i in rows) {
            var row = rows[i];
            var newRow = {};
            for (var resultName in define.fromColumns) {
                var fromColumn = define.fromColumns[resultName];
                newRow[resultName] = row[fromColumn.cname];
            }
            newRows[row[define.fromPKCName]] = newRow;
        }

        results[pk][pkName] = newRows;
        if (line === 1) {
            this.expandAll(newRows, existColumns, this.defines);
        } else {
            this.expandAll(newRows, existColumns, this.defines, true);
        }
        ++line;
    }
};
ExporterValidator.prototype.findRowsByColumn = function findRowsByColumn(dataList, value, findCName) {
    // find all
    var rows = [];
    for (var i in dataList.list) {
        var data = dataList.get(i);
        if ((data[findCName] + '') === (value + '')) rows.push(data);
    }
    return rows;
};

ExporterValidator.prototype.mergeColumns = function mergeColumns(existColumns, newColumns) {
    for (var name in newColumns) {
        existColumns[name] = newColumns[name];
    }
};
ExporterValidator.prototype.createExistColumns = function createExistColumns(existColumns, table, detail, level) {
    var newColumns = {};
    var columnList = dataPool.get('columnList', table.id);
    detail.choose.forEach(function(columnId) {
        var column = columnList.get(columnId);
        var name = detail.rename[columnId];
        if (name === undefined) name = column.name;

        // check name conflict
        if (existColumns[name] || newColumns[name]) throw new ExporterException('Table ' + table.name + ' column ' + name + ' conflict');

        var exporterExistColumn = new I.Models.ExporterExistColumn();
        exporterExistColumn.name = name;
        exporterExistColumn.level = level;
        exporterExistColumn.tableId = table.id;
        exporterExistColumn.tableName = table.name;
        exporterExistColumn.columnId = columnId;
        exporterExistColumn.columnName = column.name;
        exporterExistColumn.columnRename = detail.rename[columnId];
        exporterExistColumn.columnCName = 'c' + columnId;
        exporterExistColumn.blockId = detail.bind.fromBlockId;
        newColumns[name] = exporterExistColumn;
    });
    return newColumns;
};
ExporterValidator.prototype.createDefines = function createDefines() {
    var levels = JSON.parse(this.exporter.levels);
    var tables = JSON.parse(this.exporter.tables);
    var links = JSON.parse(this.exporter.links);
    this.links = links;

    for (var blockId in links) {
        var link = links[blockId];
        var bind = link.bind;
        if (bind.fromLevel === null) continue;
        this.defines[blockId] = {};

        // from
        if (link.pk === null) {
            throw new ExporterException('BlockId ' + blockId + ' has no pk.');
        }
        var fromColumnList = dataPool.get('columnList', tables[bind.fromBlockId]);
        this.defines[blockId].fromPKId = link.pk;
        this.defines[blockId].fromPKName = fromColumnList.get(link.pk).name;
        this.defines[blockId].fromPKRename = link.rename[link.pk];
        this.defines[blockId].fromPKCName = 'c' + link.pk;
        this.defines[blockId].fromLevel = bind.fromLevel;
        this.defines[blockId].fromTableId = tables[bind.fromBlockId];
        this.defines[blockId].fromTableName = this.tableList.get(tables[bind.fromBlockId]).name;
        this.defines[blockId].fromBlockId = bind.fromBlockId;
        this.defines[blockId].fromBlockRename = link.preLevelName,
        this.defines[blockId].fromColumnId = bind.fromColumnId;
        this.defines[blockId].fromColumnName = fromColumnList.get(bind.fromColumnId).name;
        this.defines[blockId].fromColumnRename = link.rename[bind.fromColumnId];
        this.defines[blockId].fromColumnCName = 'c' + bind.fromColumnId;
        if (this.defines[blockId].fromColumnRename === undefined) {
            this.defines[blockId].fromColumnResultName = this.defines[blockId].fromColumnName;
        } else {
            this.defines[blockId].fromColumnResultName = this.defines[blockId].fromColumnRename;
        }

        // to
        if (bind.toBlockId === 'root') {
            var toTableId = this.exporter.rootTableId;
            var toBlockLink = this.rootTableDetail;
        } else {
            var toTableId = tables[bind.toBlockId];
            var toBlockLink = links[bind.toBlockId];
        }
        if (toBlockLink.pk === null) {
            throw new ExporterException('BlockId ' + bind.toBlockId + ' has no pk.');
        }
        var toColumnList = dataPool.get('columnList', toTableId);
        this.defines[blockId].toPKId = toBlockLink.pk;
        this.defines[blockId].toPKName = toColumnList.get(toBlockLink.pk).name;
        this.defines[blockId].toPKRename = toBlockLink.rename[toBlockLink.pk];
        this.defines[blockId].toPKCName = 'c' + toBlockLink.pk;
        this.defines[blockId].toLevel = bind.toLevel;
        this.defines[blockId].toTableId = toTableId;
        this.defines[blockId].toTableName = this.tableList.get(toTableId).name;
        this.defines[blockId].toBlockId = bind.toBlockId;
        this.defines[blockId].toBlockRename = toBlockLink.preLevelName,
        this.defines[blockId].toColumnId = bind.toColumnId;
        this.defines[blockId].toColumnName = toColumnList.get(bind.toColumnId).name;
        this.defines[blockId].toColumnRename = toBlockLink.rename[bind.toColumnId];
        this.defines[blockId].toColumnCName = 'c' + bind.fromColumnId;
        if (this.defines[blockId].toColumnRename === undefined) {
            this.defines[blockId].toColumnResultName = toColumnList.get(bind.toColumnId).name;
        } else {
            this.defines[blockId].toColumnResultName = toBlockLink.rename[bind.toColumnId];
        }

        // from columns
        this.defines[blockId].fromColumns = {};
        var self = this;
        this.links[bind.fromBlockId].choose.forEach(function(fromColumnId) {
            var fromColumn = fromColumnList.get(fromColumnId);
            var fromColumnName = link.rename[fromColumnId];
            if (fromColumnName  === undefined) fromColumnName = fromColumn.name;
            self.defines[blockId].fromColumns[fromColumnName] = {
                name: fromColumn.name,
                rename: link.rename[fromColumnId],
                cname: 'c' + fromColumnId,
            };
        });
    }
};
var ExporterException = function ExporterException(msg) {
    this.msg = msg;
};
