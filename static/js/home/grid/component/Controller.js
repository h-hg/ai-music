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
        this._initListener();
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
        //const screen_xs_max = 576, screen_sm_min = 576,
        //      screen_sm_max = 768, screen_md_min = 768,
        //      screen_md_max = 992, screen_lg_min = 992,
        //      screen_lg_max = 1200, screen_xl_min = 1200;
        if (this._config.visibleW < 1000) {
            this._config.coln = Math.min(Math.floor(this._config.visibleW / 50), this._config.cols);
        } else {
            this._config.coln = Math.min(Math.floor(this._config.visibleW / 80), this._config.cols);
        }
        if (this._config.visibleH < 500) {
            this._config.rown = Math.min(Math.floor(this._config.visibleH / 25), 14);
        } else {
            this._config.rown = Math.min(Math.floor(this._config.visibleH / 40), 14);
        }
        //console.log(this._config.coln + " " + this._config.rown);


        this._config.cellH = this._config.visibleH / this._config.rown;
        this._config.cellW = this._config.visibleW / this._config.coln;

        //We try to keep the ratio of offset the same
        let offsetRatioX = (this._config.offsetX / this._config.scrollW) || 0,//when this._config.offsetX or this._config.scrollW is null(uninitialization), offsetRatioX is 0.
            offsetRatioY = (this._config.offsetY / this._config.scrollH) || 0;

        this._config.scrollW = this._config.cellW * this._config.cols;
        this._config.scrollH = this._config.cellH * this._config.rows;

        this._config.offsetX = Math.min(this._config.scrollW * offsetRatioX, this._config.scrollW - this._config.visibleW);
        this._config.offsetY = Math.min(this._config.scrollH * offsetRatioY, this._config.scrollH - this._config.visibleH);

        this._emitScrollHChEvent();
        this._emitScrollWChEvent();

        this._painter.redraw();
    }

    //This function is used when scrollL is changed, in other word, the grid is setted to the new note sequence.
    reset() {
        this._config.offsetX = 0;
        this._config.offsetY = 0;
        this.resize();
        //this._emitScrollWChEvent();
        //this._emitScrollHChEvent();
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
    _emitOffsetXRatioChEvent() {
        let event = new CustomEvent("gridOffsetXRatioCh", { "detail": { "ratio": this._config.offsetX / this._config.scrollW } });
        document.dispatchEvent(event);
    }
    _emitOffsetYRatioChEvent() {
        let event = new CustomEvent("gridOffsetYRatioCh", { "detail": { "ratio": this._config.offsetY / this._config.scrollH } });
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
        this._emitOffsetXRatioChEvent();
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
                //make the sliderBarV move forward(right)
                this._emitOffsetXRatioChEvent();

            }
        }

        if (this._config.activeCol == this._config.cols - 1) {
            //move to column 0
            this.setOffsetX(0);
            this._emitOffsetXRatioChEvent();
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
    click(col, row) {
        //Get the row number that was clicked before the current click
        let lastRow = this._rule.getClickedRow(col);
        this._rule.click(col, row);
        this._painter.drawCell(col, row);
        //judge whether draw previously clicked cell
        if (lastRow != -1 && lastRow != row) {
            this._painter.drawCell(col, lastRow);
        }
        this._player.playSound(this._rule.getColNote(col));//play sound
    }

    _initListener() {
        this._getClickedPos = function (ev) {
            console.log(ev.type);
            let x, y;
            if (ev.type === 'touchstart' || ev.type === 'touchmove') {
                //there is no offsetX or offsetY in touche
                //    https://stackoverflow.com/questions/11287877/how-can-i-get-e-offsetx-on-mobile-ipad
                let r = this._canvas.getBoundingClientRect();
                x = ev.touches[0].pageX - r.left;
                y = ev.touches[0].pageY - r.top;
                //console.log("mobile");
            } else {
                x = ev.offsetX;
                y = ev.offsetY;
                //console.log("pc");
            }
            return {
                //有一个小bug，就是刚好点击到canvas边框（下和右边框，概率极小），就会使得数组越界，这个在hover的时候比较荣耀触发，click不容易，因为没人会专门去点击边框
                col: Math.floor((this._config.offsetX + x) / this._config.cellW),
                row: Math.floor((this._config.offsetY + y) / this._config.cellH)
            };
        }

        //lastMoveCol, lastMoveRow: avoid flashing when moving
        this.lastMoveCol = null;
        this.lastMoveRow = null;

        this._move = function (ev) {
            //ev.preventDefault();
            let pos = this._getClickedPos(ev);
            if (pos.col == this.lastMoveCol && pos.row == this.lastMoveRow) {
                return;
            }
            this.click(pos.col, pos.row);
            this.lastMoveCol = pos.col;
            this.lastMoveRow = pos.row;
        }.bind(this);

        this._leave = function (ev) {
            this.lastMoveCol = null;
            this.lastMoveRow = null;
            this._canvas.removeEventListener(window.env.hasTouch ? "touchmove" : "mousemove", this._move, false);
        }.bind(this);

        this._click = function (ev) {
            //disable emiting mouse events when touching
            //    https://developer.mozilla.org/zh-CN/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
            //ev.preventDefault();
            let pos = this._getClickedPos(ev);
            this.click(pos.col, pos.row);
            this._canvas.addEventListener(window.env.hasTouch ? "touchmove" : "mousemove", this._move, false);
        }.bind(this);

    }
    enable() {
        this._canvas.addEventListener(window.env.hasTouch ? "touchstart" : "mousedown", this._click, false);
        this._canvas.addEventListener(window.env.hasTouch ? "touchend" : "mouseup", this._leave, false);
    }
    disable() {
        this._canvas.removeEventListener(window.env.hasTouch ? "touchstart" : "mousedown", this._click, false);
        this._canvas.removeEventListener(window.env.hasTouch ? "touchend" : "mouseup", this._leave, false);
    }
}

export { Controller };