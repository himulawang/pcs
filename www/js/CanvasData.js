var CanvasData = function CanvasData() {
    this.data = {};
};

CanvasData.prototype.add = function add(graphTableId, fromPos, toPos, type) {
    this.data[graphTableId] = {
        from: fromPos,
        to: toPos,
        type: type,
        selected: false,
    };
};

CanvasData.prototype.del = function del(graphTableId) {
    delete this.data[graphTableId];
};

CanvasData.prototype.getSelected = function getSelected() {
    var selected = null;
    for (var i in this.data) {
        if (this.data[i].selected) {
            selected = i;
            break;
        }
    }
    return selected;
};
