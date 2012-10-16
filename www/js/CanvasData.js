var CanvasData = function CanvasData() {
    this.data = {};
};

CanvasData.prototype.add = function add(graphTableId, fromPos, toPos, type) {
    this.data[graphTableId] = {
        from: fromPos,
        to: toPos,
        type: type,
    };
};

CanvasData.prototype.del = function del(graphTableId) {
    delete this.data[graphTableId];
};
