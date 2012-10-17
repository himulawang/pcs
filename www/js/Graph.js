var Graph = function Graph() {
    this.reset();
};

Graph.prototype.reset = function reset() {
    this.tab = 'client';
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

Graph.prototype.switchTab = function switchTab(tab) {
    this.tab = tab;
};

Graph.prototype.addNewTable = function addNewTable(level, tableId) {
    var graphTableId = this.makeGraphTableId();
    // add graphTableIds & graphStructure & columnDetail
    this[this.tab].graphTableIds[graphTableId] = tableId;
    this[this.tab].graphStructure[level].push(graphTableId);
    this[this.tab].columnDetail[graphTableId] = this.getInitColumnDetailData();
    return graphTableId;
};

Graph.prototype.selectColumn = function selectColumn(graphTableId, columnId) {
    this[this.tab].columnDetail[graphTableId].selected[columnId] = true;
};

Graph.prototype.cancelColumn = function cancelColumn(graphTableId, columnId) {
    delete this[this.tab].columnDetail[graphTableId].selected[columnId];
}

Graph.prototype.linkFlatColumn = function linkFlatColumn(fromGraphTableId, fromColumnId, toGraphTableId, toColumnId) {
    this[this.tab].columnDetail[fromGraphTableId].flat.fromGraphTableId = fromGraphTableId;
    this[this.tab].columnDetail[fromGraphTableId].flat.fromColumnId = fromColumnId;
    this[this.tab].columnDetail[fromGraphTableId].flat.toGraphTableId = toGraphTableId;
    this[this.tab].columnDetail[fromGraphTableId].flat.toColumnId = toColumnId;
};

Graph.prototype.linkLevelColumn = function linkLevelColumn(fromGraphTableId, fromColumnId, toGraphTableId, toColumnId) {
    this[this.tab].columnDetail[fromGraphTableId].level.fromGraphTableId = fromGraphTableId;
    this[this.tab].columnDetail[fromGraphTableId].level.fromColumnId = fromColumnId;
    this[this.tab].columnDetail[fromGraphTableId].level.toGraphTableId = toGraphTableId;
    this[this.tab].columnDetail[fromGraphTableId].level.toColumnId = toColumnId;
};

Graph.prototype.makeGraphTableId = function makeGraphTableId() {
    var index = Util.lastIndex(this[this.tab].graphTableIds);
    if (index === false) return 1;
    return parseInt(index) + 1;
};

Graph.prototype.tableOnSameLevel = function tableOnSameLevel(fromGraphTableId, toGraphTableId) {
    var fromLevel = 0, toLevel = 0;
    for (var level in this[this.tab].graphStructure) {
        if (this[this.tab].graphStructure[level].indexOf(parseInt(fromGraphTableId)) != -1) {
            fromLevel = level;
        }
        if (this[this.tab].graphStructure[level].indexOf(parseInt(toGraphTableId)) != -1) {
            toLevel = level;
        }
        if (fromLevel != 0 && toLevel != 0) return fromLevel === toLevel;
    }
    throw new Exception(50201);
};

Graph.prototype.getColor = function getColor() {
    return this[this.tab].availableColor.shift();
};

Graph.prototype.delLink = function delLink(fromGraphTableId) {
    this[this.tab].columnDetail[fromGraphTableId].level.fromGraphTableId = null;
    this[this.tab].columnDetail[fromGraphTableId].level.fromColumnId = null;
    this[this.tab].columnDetail[fromGraphTableId].level.toGraphTableId = null;
    this[this.tab].columnDetail[fromGraphTableId].level.toColumnId = null;
};
