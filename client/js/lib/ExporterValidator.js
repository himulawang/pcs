var ExporterValidator = function ExporterValidator() {
    this.struct = {};
    this.data = {};
    this.exporter = null;
    this.rootTableDetail = null;
    this.levels = null;
};

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
            pk: columnId == self.detail.pk,
            level: 1,
            fromTableId: null,
            fromColumnId: null,
            toTableId: self.exporter.rootTableId,
            toColumnId: columnId,
            blockId: 'root',
            linked: false, // tag this column has linked
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
            this.data[pk][name] = data['c' + struct.columnId];
        }
    }

    // search connected link
    for (var name in this.struct) {
        var struct = this.struct[name];
        if (struct.linked) continue;
        for (var blockId in this.links) {
            var link = this.links[blockId];
            var bind = link.bind;
            if (struct.blockId == bind.toBlockId && struct.columnId == bind.toColumnId) {
                // link on the same level
                if (bind.fromLevel == bind.toLevel) {
                    // struct
                    var newStructs = this.addLinkToSameLevel(this.struct, link);
                    for (var tmpName in newStructs) {
                        this.struct[tmpName] = newStructs[tmpName];
                    }
                    // data
                } else if (bind.fromLevel > bind.toLevel) {
                    //var nextStructs = this.addLinkToNextLevel(this)
                }
            }
        }
        this.struct[name].linked = true;
    }

    console.log(this);
    return this.struct;
};
ExporterValidator.prototype.addLinkToSameLevel = function addLinkToSameLevel(struct, link) {
    var self = this;
    var level = link.bind.toLevel;
    var fromTableId = this.tables[link.bind.fromBlockId];
    var table = dataPool.get('tableList', 0).get(fromTableId);
    var columnList = dataPool.get('columnList', fromTableId);
    var newStructs = {};

    // check root table pk has chosen
    if (!I.Util.valueExist(link.pk, link.choose)) throw new ExporterException('Level ' + level + ' table ' + table.name + ' pk not be chosen.');

    link.choose.forEach(function(columnId) {
        // get name from
        var column = columnList.get(columnId);
        var name = link.rename[columnId];
        if (name === undefined) {
            name = column.name;
        }

        // check name conflict
        if (struct[name] || newStructs[name]) throw new ExporterException('Level ' + level + ' column name conflict ' + name);
        newStructs[name] = {
            name: name,
            originalName: column.name,
            pk: columnId == link.pk,
            level: level,
            fromTableId: fromTableId,
            fromColumnId: link.bind.fromColumnId,
            toTableId: self.tables[link.toBlockId],
            toColumnId: link.bind.toColumnId,
            blockId: link.bind.toBlockId,
            columnId: columnId,
            linked: false,
        };
    });

    return newStructs;
};
ExporterValidator.prototype.addDataToSameLevel = function addDataToSameLevel(data, link, struct) {
    var tableId = struct.fromTableId;
    var dataList = dataPool.get('dataList', tableId);
    for (var pk in data) {
        //data[pk][name] = this.findValueByColumn(dataList, data[pk]['c' + struct.toColumnId], struct.fromColumnId, );
    }
};
ExporterValidator.prototype.findValueByColumn = function findValueByColumn(dataList, value, findColumnId, needColumnId) {
    var findColumnName = 'c' + findColumnId;
    var needColumnName = 'c' + needColumnId;

    // only find one first value
    for (var i in dataList.list) {
        var data = dataList.get(i);
        if (data[findColumName] === value) return data[needColumnName];
        return null;
    }
};

var ExporterException = function ExporterException(msg) {
    console.log(msg);
    //this.msg = msg;
};
