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

CanvasData.prototype.set = function set(data) {
    this.data = data;
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

CanvasData.prototype.toUpload = function toUpload() {
    return JSON.stringify(this.data);
};
