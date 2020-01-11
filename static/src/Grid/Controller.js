class Controller {
    constructor(canvas, player, painter, rule, config) {
        this._canvas = canvas;
        this._player = player;
        this._painter = painter;
        this._rule = rule;
        this._config = config;
        this._waitTime = 500;//interval time of two adjacent notes when playing
        this._isPlaying = false;

        this.resize();
        this._addListener();
    }
    set waitTime(val) {
        this._waitTime = val;
    }
    get waitTime() {
        return this._waitTime;
    }
    isPlaying() {
        //return this._config.activeCol != -1;
        return this._isPlaying;
    }
    //This function is used when size of grid(canvas) is changed
    resize() {
        this._config.visibleW = this._canvas.clientWidth;
        this._config.visibleH = this._canvas.clientHeight;
        this._canvas.setAttribute("height", this._config.visibleH);
        this._canvas.setAttribute("width", this._config.visibleW);

        //Missing code: Adjust this._config.rown and this._config.coln according to _config.visibleW and _config.visibleH
        //XXXXX
        this._config.cellH = this._config.visibleH / this._config.rown;
        this._config.cellW = this._config.visibleW / this._config.coln;

        //We try to keep the ratio of offset the same
        let offsetRatioX = (this._config.offsetX / this._config.scrollW) || 0,//when this._config.offsetX or this._config.scrollW is undefined, offsetRatioX is 0.
            offsetRatioY = (this._config.offsetY / this._config.scrollH) || 0;

        this._config.scrollW = this._config.cellW * this._config.cols;
        this._config.scrollH = this._config.cellH * this._config.rows;

        this._config.offsetX = this._config.scrollW * offsetRatioX;
        this._config.offsetY = this._config.scrollH * offsetRatioY;

        this._painter.redraw();
    }

    //This function is used when scrollL is changed, in other word, the grid is setted to the new note sequence.
    reset() {
        this._config.offsetX = 0;
        this._config.offsetY = 0;
        this.resize();
        this._emitScrollWChEvent();
        this._emitScrollHChEvent();
    }
    setOffsetX(ratio) {
        this._config.offsetX = ratio * this._config.scrollW;
        this._painter.redraw();
    }
    setOffsetY(ratio) {
        this._config.offsetY = ratio * this._config.scrollH;
        this._painter.redraw();
    }
    _emitPlayEvent() {
        let event = new Event("play");
        document.dispatchEvent(event);
    }
    _emitStopEvent() {
        let event = new Event("stop");
        document.dispatchEvent(event);
    }
    _emitOffsetXChEvent() {
        let event = new CustomEvent("gridOffsetXCh", { "detail": { "ratio": this._config.offsetX / this._config.scrollW } });
        document.dispatchEvent(event);
    }
    _emitScrollWChEvent() {
        let event = new CustomEvent("gridScrollWCh", {
            "detail": {
                "posRatio": this._config.offsetX / this._config.visibleW,
                "sliderRatio": this._config.visibleW / this._config.scrollW
            }
        });
        document.dispatchEvent(event);
    }
    _emitScrollHChEvent() {
        let event = new CustomEvent("gridScrollHCh", {
            "detail": {
                "posRatio": this._config.offsetY / this._config.visibleH,
                "sliderRatio": this._config.visibleH / this._config.scrollH
            }
        });
        document.dispatchEvent(event);
    }
    play() {
        if (this.isPlaying()) {
            return;
        }
        this._isPlaying = true;
        this._config.activeCol = -1;//for robustness
        this._emitPlayEvent();
        this.setOffsetX(0);
        this._emitOffsetXChEvent();
        this._playHelper(0);
    }
    _playHelper(col) {
        if (this.isPlaying() == false || (this._config.activeCol + 1) % this._config.cols != col)
            return;
        let nextCol = (col + 1) % this._config.cols,
            prevCol = (col + this._config.cols - 1) % this._config.cols;
        //play the next column
        setTimeout(this._playHelper.bind(this, nextCol), this.waitTime);

        //move the grid
        if (this._config.scrollW > this._config.visibleW) {
            if (
                ((col * this._config.cellW) >= (this._config.offsetX + this._config.offsetX + this._config.visibleW) / 2)//judge whether the column col is behind the middle of the grid(canvas)
                &&
                (this._config.offsetX + this._config.visibleW < this._config.scrollW)//judge whether the column col can move forward(right)
            ) {
                let ratio = (this._config.offsetX + this._config.cellW) / this._config.scrollW;
                //make the grid(canvas) move forward(right)
                this.setOffsetX(ratio);
                //make the sliderBar move forward(right)
                this._emitOffsetXChEvent();

            }
        }

        if (this._config.activeCol == this._config.cols - 1) {
            //move to column 0
            this.setOffsetX(0);
            this._emitOffsetXChEvent();
        }
        this._config.activeCol = col;//update

        this._player.playSound(this._rule.getColNote(col));//play sound

        this._painter.drawColCells(prevCol);
        this._painter.drawColCells(col);
    }
    stop() {
        this._isPlaying = false;
        this._config.activeCol = -1;
        this._emitStopEvent();
        this._painter.redraw();
    }
    _click(e) {
        let col = Math.floor((this._config.offsetX + e.offsetX) / this._config.cellW),
            row = Math.floor((this._config.offsetY + e.offsetY) / this._config.cellH);
        if (e.which == 1) /*left mouse is clicked*/ {
            //Get the row number that was clicked before the current click
            let lastRow = this._rule.getClickedRow(col);
            this._rule.click(col, row);
            this._painter.drawCell(col, row);
            //judge whether draw previously clicked cell
            if (lastRow != -1 && lastRow != row) {
                this._painter.drawCell(col, lastRow);
            }
        }
    }
    _move(e) {

    }
    _addListener() {
        this._canvas.addEventListener("click", this._click.bind(this), false);
        this._canvas.addEventListener("move", this._move.bind(this), false);
    }
}

export { Controller };