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

Graph.prototype.switchTab = function switchTab(tab) {
    this.tab = tab;
};

Graph.prototype.addNewTable = function addNewTable(level, tableId) {
    var graphTableId = this.makeGraphTableId();
    console.log(level, graphTableId);
    // add graphTableIds & graphStructure
    this[this.tab].graphTableIds[graphTableId] = tableId;
    this[this.tab].graphStructure[level].push(graphTableId);
};

Graph.prototype.makeGraphTableId = function makeGraphTableId() {
    var index = Util.lastIndex(this[this.tab].graphTableIds);
    if (index === false) return 1;
    return parseInt(index) + 1;
};
