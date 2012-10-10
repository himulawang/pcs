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
        flat: {},
        level: {},
        columnRename: {},
    };
};

Graph.prototype.switchTab = function switchTab(tab) {
    this.tab = tab;
};

Graph.prototype.addNewTable = function addNewTable(level, tableId) {
    var graphTableId = this.makeGraphTableId();
    console.log(level, graphTableId);
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

};

Graph.prototype.makeGraphTableId = function makeGraphTableId() {
    var index = Util.lastIndex(this[this.tab].graphTableIds);
    if (index === false) return 1;
    return parseInt(index) + 1;
};
