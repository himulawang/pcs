var ExporterValidator = function ExporterValidator() {
    this.existColumns = {};
    this.defines = {};
    this.results = {};
    this.exporter = null;
    this.rootTableDetail = null;

    this.tableList = null;
};

ExporterValidator.prototype.preview = function preview(exporterId) {
    var self = this;
    this.exporter = dataPool.get('exporterList', 0).get(exporterId);
    // check root table selected
    if (this.exporter.rootTableId == 0) throw new ExporterException('Root table not selected.');

    // creat existColumns
    this.tableList = dataPool.get('tableList', 0);
    var rootTable = this.tableList.get(this.exporter.rootTableId);
    this.rootTableDetail = JSON.parse(this.exporter.rootTableDetail);
    this.createExistColumns(this.existColumns, rootTable, this.rootTableDetail, 1 /* level */);

    // create defines
    this.createDefines();
    console.log(this);
};

ExporterValidator.prototype.createExistColumns = function createExistColumns(existColumns, table, detail, level) {
    var columnList = dataPool.get('columnList', table.id);
    detail.choose.forEach(function(columnId) {
        var column = columnList.get(columnId);
        var name = detail.rename[columnId];
        if (name === undefined) name = column.name;

        // check name conflict
        if (existColumns[name]) throw new ExporterException('Table ' + table.name + ' column ' + name + ' conflict');

        existColumns[name] = {
            name: name,
            level: level,
            tableId: table.id,
            tableName: table.name,
            columnId: columnId,
            columnName: column.name,
            columnRename: detail.rename[columnId],
        };
    });
};

ExporterValidator.prototype.createDefines = function createDefines() {
    var levels = JSON.parse(this.exporter.levels);
    var tables = JSON.parse(this.exporter.tables);
    var links = JSON.parse(this.exporter.links);

    for (var blockId in links) {
        var link = links[blockId];
        var bind = link.bind;
        if (bind.fromLevel === null) continue;
        this.defines[blockId] = {};

        // from
        if (link.pk === null) {
            throw new ExporterException('BlockId ' + blockId + ' has no pk.');
        }
        var columnList = dataPool.get('columnList', tables[bind.fromBlockId]);
        this.defines[blockId].fromPKId = link.pk;
        this.defines[blockId].fromPKName = columnList.get(link.pk).name;
        this.defines[blockId].fromPKRename = link.rename[link.pk];
        this.defines[blockId].fromLevel = bind.fromLevel;
        this.defines[blockId].fromTableId = tables[bind.fromBlockId];
        this.defines[blockId].fromTableName = this.tableList.get(tables[bind.fromBlockId]).name;
        this.defines[blockId].fromBlockId = bind.fromBlockId;
        this.defines[blockId].fromBlockRename = link.preLevelName,
        this.defines[blockId].fromColumnId = bind.fromColumnId;
        this.defines[blockId].fromColumnName = columnList.get(bind.fromColumnId).name;
        this.defines[blockId].fromColumnRename = link.rename[bind.fromColumnId];

        // to
        if (bind.toBlockId === 'root') {
            var toTableId = this.exporter.rootTableId;
            var toBlockLink = this.rootTableDetail;
        } else {
            var toTableId = bind.toBlockId;
            var toBlockLink = links[bind.toBlockId];
        }
        if (toBlockLink.pk === null) {
            throw new ExporterException('BlockId ' + toBlockId + ' has no pk.');
        }
        columnList = dataPool.get('columnList', toTableId);
        this.defines[blockId].toPKId = toBlockLink.pk;
        this.defines[blockId].toPKName = columnList.get(toBlockLink.pk).name;
        this.defines[blockId].toPKRename = toBlockLink.rename[toBlockLink.pk];
        this.defines[blockId].toLevel = bind.toLevel;
        this.defines[blockId].toTableId = toTableId;
        this.defines[blockId].toTableName = this.tableList.get(toTableId).name;
        this.defines[blockId].toBlockId = bind.toBlockId;
        this.defines[blockId].toBlockRename = toBlockLink.preLevelName,
        this.defines[blockId].toColumnId = bind.toColumnId;
        this.defines[blockId].toColumnName = columnList.get(bind.toColumnId).name;
        this.defines[blockId].toColumnRename = toBlockLink.rename[bind.toColumnId];
    }
};

/*
ExporterValidator.prototype.preview = function preview(exporterId) {
    var self = this;
    this.exporter = dataPool.get('exporterList', 0).get(exporterId);
    // check root table selected
    if (this.exporter.rootTableId == 0) throw new ExporterException('Root table not selected.');

    // check root table pk
    this.detail = JSON.parse(this.exporter.rootTableDetail);
    if (this.detail.pk === null) throw new ExporterException('Root table has no pk.');

    // check root table pk has chosen
    if (!I.Util.valueExist(this.detail.pk, this.detail.choose)) throw new ExporterException('Root table pk not be chosen.');

    // prepare parameter
    this.levels = JSON.parse(this.exporter.levels);
    this.tables = JSON.parse(this.exporter.tables);
    this.links = JSON.parse(this.exporter.links);
    this.tableList = dataPool.get('tableList', 0);

    // get root table choose column
    var rootColumnList = dataPool.get('columnList', this.exporter.rootTableId);
    var rootPKName = 'c' + this.detail.pk;
    this.detail.choose.forEach(function(columnId) {
        // get name from columnName or rename
        var column = rootColumnList.get(columnId);
        var name = self.detail.rename[columnId];
        if (name === undefined) {
            name = column.name;
        }

        // check name conflict
        if (self.struct[name]) throw new ExporterException('Root table column name conflict ' + name);
        self.struct[name] = {
            name: name,
            originalName: column.name,
            isPK: columnId == self.detail.pk,
            pkColumnId: columnId == self.detail.pk ? columnId : null,
            level: 1,
            columnId: columnId,
            fromTableId: null,
            fromBlockId: null,
            fromColumnId: null,
            toTableId: self.exporter.rootTableId,
            toBlockId: 'root',
            toColumnId: columnId,
            hasSearched: false, // tag this column has be searched
        };
    });

    // root data
    var dataList = dataPool.get('dataList', this.exporter.rootTableId);
    for (var i in dataList.list) {
        var data = dataList.get(i);
        var pk = data[rootPKName];
        this.data[pk] = {};
        for (var name in this.struct) {
            var struct = this.struct[name];
            this.data[pk][name] = data['c' + struct.toColumnId];
        }
    }

    // search connected link
    for (var name in this.struct) {
        var struct = this.struct[name];
        if (struct.hasSearched) continue;
        for (var blockId in this.links) {
            var link = this.links[blockId];
            var bind = link.bind;
            if (struct.toBlockId == bind.toBlockId && struct.toColumnId == bind.toColumnId) {
                // link on the same level
                if (bind.fromLevel == bind.toLevel) {
                    // struct
                    var newStructs = this.addLinkToSameLevel(this.struct, link);
                    for (var tmpName in newStructs) {
                        this.struct[tmpName] = newStructs[tmpName];
                        // data
                        var fromDataList = dataPool.get('dataList', newStructs[tmpName].fromTableId);
                        this.addDataToSameLevel(this.data, fromDataList, newStructs[tmpName], struct);
                    }
                } else if (bind.fromLevel > bind.toLevel) {
                    // check struct name conflict
                    var fromTable = this.tableList.get(struct.fromTableId);
                    var fromTableName = link.preLevelName;
                    if (fromTableName === null) {
                        fromTableName = fromTable.name;
                    }
                    if (I.Util.valueExist(fromTableName, this.struct)) throw new ExporterException('Level' + level + ' table ' + fromTable.name + ' conflict with pre level column name.');
                    //var nextStructs = this.addLinkToNextLevel(struct, link);
                }
            }
        }
        this.struct[name].hasSearched = true;
    }

    console.log(this);
    return this.struct;
};
ExporterValidator.prototype.addLinkToSameLevel = function addLinkToSameLevel(struct, link) {
    var self = this;
    var newStructs = {};

    // check from table pk has chosen
    var fromTableId = this.tables[link.bind.fromBlockId];
    var fromTable = dataPool.get('tableList', 0).get(fromTableId);
    if (link.bind.toBlockId === 'root') {
        var toTableId = this.exporter.rootTableId;
    } else {
        var toTableId = this.tables[link.bind.toBlockId];
    }
    var level = link.bind.toLevel;
    if (!I.Util.valueExist(link.pk, link.choose)) throw new ExporterException('Level ' + level + ' table ' + fromTable.name + ' pk not be chosen.');

    var fromColumnList = dataPool.get('columnList', fromTableId);
    link.choose.forEach(function(columnId) {
        // get name from
        var column = fromColumnList.get(columnId);
        var name = link.rename[columnId];
        if (name === undefined) {
            name = column.name;
        }

        // check name conflict
        if (struct[name] || newStructs[name]) throw new ExporterException('Level ' + level + ' column name conflict ' + name);

        newStructs[name] = {
            name: name,
            originalName: column.name,
            columnId: columnId,
            isPK: columnId == link.pk,
            level: level,
            fromTableId: fromTableId,
            fromBlockId: link.bind.fromBlockId,
            fromColumnId: link.bind.fromColumnId,
            toTableId: toTableId,
            toBlockId: link.bind.toBlockId,
            toColumnId: link.bind.toColumnId,
            hasSearched: false,
        };
    });

    return newStructs;
};
ExporterValidator.prototype.addDataToSameLevel = function addDataToSameLevel(data, fromDataList, struct, preStruct) {
    for (var pk in data) {
        var value = data[pk][preStruct.name];
        var findValue = this.findValueByColumn(fromDataList, value, struct.fromColumnId, struct.columnId);
        data[pk][struct.name] = findValue;
    }
};
ExporterValidator.prototype.addLinkToNextLevel = function addLinkToNextLevel(struct, link) {
    var self = this;
    var newStructs = {};

    // check
};
ExporterValidator.prototype.findValueByColumn = function findValueByColumn(dataList, value, findColumnId, needColumnId) {
    var findColumnName = 'c' + findColumnId;
    var needColumnName = 'c' + needColumnId;

    // only find one first value
    for (var i in dataList.list) {
        var data = dataList.get(i);
        if ((data[findColumnName] + '') === (value + '')) return data[needColumnName];
    }
    return null;
};

*/
var ExporterException = function ExporterException(msg) {
    console.log(msg);
    //this.msg = msg;
};
