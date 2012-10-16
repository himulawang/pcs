var Canvas = function Canvas() {
    this.client = new CanvasData();
    this.server = new CanvasData();
    this.canvas = $('#canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    this.columnOffset = 8;
    this.arrowLength = 17;
    this.leftOffset = 383;
    this.defaultLineColor = '#DF1B26';
    this.selectedLineColor = '#FFFFFF';
    this.arrowWidth = 4;

    this.ctx.strokeStyle = this.defaultLineColor;
    this.ctx.fillStyle = this.defaultLineColor;
    this.ctx.globalAlpha = .7;
    this.ctx.lineWidth = 1;
};

/* Draw */
Canvas.prototype.render = function render(except) {
    // draw line
    this.ctx.fillStyle = this.defaultLineColor;
    for (var i in this[graph.tab].data) {
        if (i === except) continue;
        var line = this[graph.tab].data[i];
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
    if (fromPos.y > toPos.y) {
        var tmpPos = toPos;
        toPos = fromPos;
        fromPos = tmpPos;
    }
    // out rect
    this.ctx.lineTo(fromPos.x, fromPos.y + this.columnOffset);
    this.ctx.lineTo(fromPos.x - this.arrowLength, fromPos.y + this.columnOffset);
    this.ctx.lineTo(toPos.x - this.arrowLength, toPos.y + this.columnOffset);
    this.ctx.lineTo(toPos.x, toPos.y + this.columnOffset);
    // inside rect
    this.ctx.lineTo(toPos.x, toPos.y + this.columnOffset - this.arrowWidth);
    this.ctx.lineTo(toPos.x - this.arrowLength + this.arrowWidth, toPos.y + this.columnOffset - this.arrowWidth);
    this.ctx.lineTo(fromPos.x - this.arrowLength + this.arrowWidth, fromPos.y + this.columnOffset + this.arrowWidth);
    this.ctx.lineTo(fromPos.x, fromPos.y + this.columnOffset + this.arrowWidth);
    this.ctx.lineTo(fromPos.x, fromPos.y + this.columnOffset);
};
Canvas.prototype.collisionLeftArrow = function collisionLeftArrow(fromPos, toPos) {
    this.ctx.beginPath();
    this.draftLeftArrow(fromPos, toPos);
    this.ctx.closePath();
};
Canvas.prototype.drawRightArrow = function drawRightArrow(fromPos, toPos) {
    this.ctx.beginPath();
    this.ctx.lineTo(fromPos.x + this.leftOffset, fromPos.y + this.columnOffset);
    this.ctx.lineTo(fromPos.x + this.leftOffset + this.arrowLength, fromPos.y + this.columnOffset);
    this.ctx.lineTo(toPos.x + this.leftOffset + this.arrowLength, toPos.y + this.columnOffset);
    this.ctx.lineTo(toPos.x + this.leftOffset, toPos.y + this.columnOffset);
    this.ctx.closePath();
    this.ctx.stroke();
};
Canvas.prototype.collision = function collision(e) {
    // collison
    var collision = false;
    var except = null;
    for (i in this[graph.tab].data) {
        var line = this[graph.tab].data[i];
        if (line.type === 'flat') {
            this.collisionLeftArrow(line.from, line.to);
        } else {
            this.collisionRightArrow(line.from, line.to);
        }
        if (this.ctx.isPointInPath(e.offsetX, e.offsetY)) {
            collision = true;
            except = i;
            console.log('collision');
            break;
        }
    }

    this.clear();
    if (collision) {
        this.ctx.fillStyle = this.selectedLineColor;
        this.ctx.strokeStyle = this.selectedLineColor;
        if (line.type === 'flat') {
            this.drawLeftArrow(line.from, line.to);
        } else {
            this.drawRightArrow(line.from, line.to);
        }
    }
    this.ctx.fillStyle = this.defaultLineColor;
    this.ctx.strokeStyle = this.defaultLineColor;
    this.render(except);
};

/* Calculate */
Canvas.prototype.calColumnPositionOnCanvas = function calColumnPositionOnCanvas(rect) {
    var canvasRect = this.canvas.getBoundingClientRect();
    return {
        x: rect.left - canvasRect.left,
        y: rect.top - canvasRect.top,
    };
};

