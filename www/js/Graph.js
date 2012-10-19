var Graph = function Graph() {
    this.reset();
};

Graph.prototype.reset = function reset() {
    this.client = this.getInitData();
    this.server = this.getInitData();
};

Graph.prototype.getInitData = function getInitData() {
    return {
        filename: '',
        path: '',
        graphTableIds: {},
        graphStructure: {},
        columnDetail: {},
    };
};

Graph.prototype.getInitColumnDetailData = function getInitColumnDetailData() {
    return {
        pk: 0,
        selected: {},
        flat: {
            fromGraphTableId: null,
            fromColumnId: null,
            toGraphTableId: null,
            toColumnId: null,
        },
        level: {
            fromGraphTableId: null,
            fromColumnId: null,
            toGraphTableId: null,
            toColumnId: null,
        },
        columnRename: {},
    };
};

Graph.prototype.addNewTable = function addNewTable(tab, level, tableId) {
    var graphTableId = this.makeGraphTableId(tab);
    // add graphTableIds & graphStructure & columnDetail
    this[tab].graphTableIds[graphTableId] = tableId;
    this[tab].graphStructure[level].push(graphTableId);
    this[tab].columnDetail[graphTableId] = this.getInitColumnDetailData();
    return graphTableId;
};

Graph.prototype.selectColumn = function selectColumn(graphTableId, columnId) {
    this[exporter.tab].columnDetail[graphTableId].selected[columnId] = true;
};

Graph.prototype.cancelColumn = function cancelColumn(graphTableId, columnId) {
    delete this[exporter.tab].columnDetail[graphTableId].selected[columnId];
}

Graph.prototype.linkFlatColumn = function linkFlatColumn(fromGraphTableId, fromColumnId, toGraphTableId, toColumnId) {
    this[exporter.tab].columnDetail[fromGraphTableId].flat.fromGraphTableId = fromGraphTableId;
    this[exporter.tab].columnDetail[fromGraphTableId].flat.fromColumnId = fromColumnId;
    this[exporter.tab].columnDetail[fromGraphTableId].flat.toGraphTableId = toGraphTableId;
    this[exporter.tab].columnDetail[fromGraphTableId].flat.toColumnId = toColumnId;
};

Graph.prototype.linkLevelColumn = function linkLevelColumn(fromGraphTableId, fromColumnId, toGraphTableId, toColumnId) {
    this[exporter.tab].columnDetail[fromGraphTableId].level.fromGraphTableId = fromGraphTableId;
    this[exporter.tab].columnDetail[fromGraphTableId].level.fromColumnId = fromColumnId;
    this[exporter.tab].columnDetail[fromGraphTableId].level.toGraphTableId = toGraphTableId;
    this[exporter.tab].columnDetail[fromGraphTableId].level.toColumnId = toColumnId;
};

Graph.prototype.makeGraphTableId = function makeGraphTableId(tab) {
    var index = Util.lastIndex(this[tab].graphTableIds);
    if (index === false) return 1;
    return parseInt(index) + 1;
};

Graph.prototype.tableOnSameLevel = function tableOnSameLevel(fromGraphTableId, toGraphTableId) {
    var fromLevel = 0, toLevel = 0;
    for (var level in this[exporter.tab].graphStructure) {
        if (this[exporter.tab].graphStructure[level].indexOf(parseInt(fromGraphTableId)) != -1) {
            fromLevel = level;
        }
        if (this[exporter.tab].graphStructure[level].indexOf(parseInt(toGraphTableId)) != -1) {
            toLevel = level;
        }
        if (fromLevel != 0 && toLevel != 0) return fromLevel === toLevel;
    }
    throw new Exception(50201);
};

Graph.prototype.getColor = function getColor() {
    return this[exporter.tab].availableColor.shift();
};

Graph.prototype.delLink = function delLink(fromGraphTableId) {
    this[exporter.tab].columnDetail[fromGraphTableId].level.fromGraphTableId = null;
    this[exporter.tab].columnDetail[fromGraphTableId].level.fromColumnId = null;
    this[exporter.tab].columnDetail[fromGraphTableId].level.toGraphTableId = null;
    this[exporter.tab].columnDetail[fromGraphTableId].level.toColumnId = null;
};

Graph.prototype.toUpload = function toUpload(tab) {
    var data = this[tab];
    return {
        filename: data.filename,
        path: data.path,
        columnDetail: JSON.stringify(data.columnDetail),
        graphStructure: JSON.stringify(data.graphStructure),
        graphTableIds: JSON.stringify(data.graphTableIds),
    };
};

Graph.prototype.convertNetData = function convertNetData(data) {
    return {
        filename: data.fn,
        path: data.p,
        columnDetail: JSON.parse(data.cd),
        graphStructure: JSON.parse(data.gs),
        graphTableIds: JSON.parse(data.gti),
    };
};

Graph.prototype.addLevel = function addLevel(tab) {
    var level = Util.getLength(this[tab].graphStructure) + 1;
    this[tab].graphStructure[level] = [];
    return level;
};

