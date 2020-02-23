class Painter {
    constructor(ctx, colors, rule, config) {
        this._ctx = ctx;
        this._colors = colors;
        this._config = config;
        this._rule = rule;
    }
    //return the smallest multiple of n which is greater or equal to x
    _getPos(x, n) {
        let times = Math.ceil(x / n),
            ret = (times - 1) * n;
        return ret >= x ? ret : ret + n;//for robustness, avoid the floating point error
    }
    _getCellColor(col, row) {
        return this._colors.getNoteColor(this._rule.getNote(col, row), this._config.activeCol == col);
    }
    drawBackground() {
        this._ctx.beginPath();
        this._ctx.rect(0, 0, this._config.visibleW, this._config.visibleH);
        this._ctx.stroke();
        this._ctx.fillStyle = this._colors.bg;
        this._ctx.fill();
    }
    drawLines() {
        this._ctx.strokeStyle = this._colors.line;
        this._ctx.linewidth = this._config.lineW;
        //draw horizontal line
        for (let y = this._getPos(this._config.offsetY, this._config.cellH) - this._config.offsetY; y <= this._config.visibleH; y += this._config.cellH) {
            this._ctx.moveTo(0, y);
            this._ctx.lineTo(this._config.visibleW, y);
        }
        //draw vertical line
        for (let x = this._getPos(this._config.offsetX, this._config.cellW) - this._config.offsetX; x <= this._config.visibleW; x += this._config.cellW) {
            this._ctx.moveTo(x, 0);
            this._ctx.lineTo(x, this._config.visibleH);
        }
        this._ctx.stroke();
    }
    drawCell(col, row) {
        let x = Math.ceil(col * this._config.cellW - this._config.offsetX + this._config.lineW),
            y = Math.ceil(row * this._config.cellH - this._config.offsetY + this._config.lineW),
            width = Math.floor(this._config.cellW - 2 * this._config.lineW),
            height = Math.floor(this._config.cellH - 2 * this._config.lineW);
        this._ctx.fillStyle = this._getCellColor(col, row);
        this._ctx.fillRect(x, y, width, height);
    }
    drawColCells(col) {
        for (let row = Math.floor(this._config.offsetY / this._config.cellH), m = Math.floor((this._config.offsetY + this._config.visibleH) / this._config.cellH); row <= m && row < this._config.rows; ++row) {
            this.drawCell(col, row);
        }
    }
    drawAllCells() {
        for (let col = Math.floor(this._config.offsetX / this._config.cellW), n = Math.floor((this._config.offsetX + this._config.visibleW) / this._config.cellW); col <= n && col < this._config.cols; ++col) {
            this.drawColCells(col);
        }
    }
    redraw() {
        this.drawBackground();
        this.drawLines();
        this.drawAllCells();
    }
}

export { Painter };