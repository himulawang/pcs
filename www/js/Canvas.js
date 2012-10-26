var Canvas = function Canvas() {
    this.client = new CanvasData();
    this.server = new CanvasData();
    this.canvas = $('#canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    this.columnOffset = 21;
    this.arrowLength = 6;
    this.leftOffset = 383;
    this.defaultLineColor = '#DF1B26';
    this.selectedLineColor = '#00FFFF';
    this.hoverLineColor = '#FFFFFF';
    this.arrowWidth = 4;
    this.arrowHeadLength = 7;

    this.ctx.strokeStyle = this.defaultLineColor;
    this.ctx.fillStyle = this.defaultLineColor;
    this.ctx.globalAlpha = .7;
    this.ctx.lineWidth = 2;
};

/* Color */
Canvas.prototype.changeDefaultColor = function changeDefaultColor() {
    this.ctx.fillStyle = this.defaultLineColor;
    this.ctx.strokeStyle = this.defaultLineColor;
};
Canvas.prototype.changeHoverColor = function changeHoverColor() {
    this.ctx.fillStyle = this.hoverLineColor;
    this.ctx.strokeStyle = this.hoverLineColor;
};
Canvas.prototype.changeSelectedColor = function changeSelectedColor() {
    this.ctx.fillStyle = this.selectedLineColor;
    this.ctx.strokeStyle = this.selectedLineColor;
};

/* Draw */
Canvas.prototype.render = function render(except) {
    this.clear();
    // draw collision line
    if (except) {
        this.changeHoverColor();
        var line = this[exporter.tab].data[except];
        if (line.type === 'flat') {
            this.drawLeftArrow(line.from, line.to);
        } else {
            this.drawRightArrow(line.from, line.to);
        }
        this.ctx.fill();
    }

    // draw other line
    for (var i in this[exporter.tab].data) {
        if (i === except) continue;
        var line = this[exporter.tab].data[i];
        line.selected ? this.changeSelectedColor() : this.changeDefaultColor();
        if (line.type === 'flat') {
            this.drawLeftArrow(line.from, line.to);
        } else {
            this.drawRightArrow(line.from, line.to);
        }
    }
};
Canvas.prototype.clear = function clear() {
    var rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
};
Canvas.prototype.drawLeftArrow = function drawLeftArrow(fromPos, toPos) {
    this.ctx.beginPath();
    this.draftLeftArrow(fromPos, toPos);
    this.ctx.closePath();
    this.ctx.stroke();
};
Canvas.prototype.draftLeftArrow = function draftLeftArrow(fromPos, toPos) {
    var from = { x: fromPos.x, y: fromPos.y + this.columnOffset };
    var to = { x: toPos.x, y: toPos.y + this.columnOffset };
    if (from.y > to.y) {
        this.ctx.lineTo(to.x, to.y);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y - this.arrowHeadLength);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength - this.arrowLength - this.arrowWidth, to.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength - this.arrowLength - this.arrowWidth, from.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x, from.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x, from.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x - this.arrowHeadLength - this.arrowLength, from.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x - this.arrowHeadLength - this.arrowLength, to.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x - this.arrowHeadLength, to.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x - this.arrowHeadLength, to.y + this.arrowHeadLength);
        this.ctx.lineTo(to.x, to.y);
    } else {
        this.ctx.lineTo(to.x, to.y);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y - this.arrowHeadLength);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength - this.arrowLength, to.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength - this.arrowLength, from.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x, from.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x, from.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength - this.arrowLength - this.arrowWidth, from.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength - this.arrowLength - this.arrowWidth, to.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y + this.arrowHeadLength);
        this.ctx.lineTo(to.x, to.y);
    }
};
Canvas.prototype.collisionLeftArrow = function collisionLeftArrow(fromPos, toPos) {
    this.ctx.beginPath();
    this.draftLeftArrow(fromPos, toPos);
    this.ctx.closePath();
};
Canvas.prototype.drawRightArrow = function drawRightArrow(fromPos, toPos) {
    this.ctx.beginPath();
    this.draftRightArrow(fromPos, toPos);
    this.ctx.closePath();
    this.ctx.stroke();
};
Canvas.prototype.draftRightArrow = function draftRightArrow(fromPos, toPos) {
    var from = { x: fromPos.x + this.leftOffset, y: fromPos.y + this.columnOffset };
    var to = { x: toPos.x + this.leftOffset, y: toPos.y + this.columnOffset };
    if (from.x > to.x) {
        this.ctx.lineTo(from.x, from.y);
        this.ctx.lineTo(from.x, from.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x + this.arrowHeadLength, to.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x + this.arrowHeadLength, to.y - this.arrowHeadLength);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.lineTo(to.x + this.arrowHeadLength, to.y + this.arrowHeadLength);
        this.ctx.lineTo(to.x + this.arrowHeadLength, to.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x, from.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x, from.y);
    } else {
        this.ctx.lineTo(from.x, from.y);
        this.ctx.lineTo(from.x, from.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y - this.arrowHeadLength / 2);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y - this.arrowHeadLength);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y + this.arrowHeadLength);
        this.ctx.lineTo(to.x - this.arrowHeadLength, to.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x, from.y + this.arrowHeadLength / 2);
        this.ctx.lineTo(from.x, from.y);
    }
};
Canvas.prototype.collisionRightArrow = function collisionRightArrow(fromPos, toPos) {
    this.ctx.beginPath();
    this.draftRightArrow(fromPos, toPos);
    this.ctx.closePath();
};
Canvas.prototype.collision = function collision(e, canvasPos) {
    // collison
    var collision = false;
    var except = null;
    for (i in this[exporter.tab].data) {
        var line = this[exporter.tab].data[i];
        if (line.type === 'flat') {
            this.collisionLeftArrow(line.from, line.to);
        } else {
            this.collisionRightArrow(line.from, line.to);
        }
        if (this.ctx.isPointInPath(canvasPos.x, canvasPos.y)) {
            collision = true;
            except = i;
            break;
        }
    }
    return except;
};
Canvas.prototype.unselectAllLine = function unselectAllLine() {
    for (var i in this[exporter.tab].data) {
        this[exporter.tab].data[i].selected = false;
    }
};
Canvas.prototype.selectLine = function selectLine(selected) {
    this[exporter.tab].data[selected].selected = true;
};

/* Calculate */
Canvas.prototype.calColumnPositionOnCanvas = function calColumnPositionOnCanvas(rect) {
    var canvasRect = this.canvas.getBoundingClientRect();
    return {
        x: rect.left - canvasRect.left,
        y: rect.top - canvasRect.top,
    };
};
Canvas.prototype.calClientPosToCanvas = function calClientPosToCanvas(e) {
    var rect = this.canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
};

Canvas.prototype.set = function (client, server) {
    this.client.set(client.c);
    this.server.set(server.c);
};
