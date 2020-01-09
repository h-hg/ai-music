class Grid{
    //canvas is canvas element
    constructor(canvas, cols=16, rows=14) {
        this._canvas = canvas;
        this._viewWidth = this._canvas.clientWidth;
        this._viewHeight = this._canvas.clientHeight;
        this._canvas.setAttribute("height", this._viewHeight);
        this._canvas.setAttribute("width", this._viewWidth);
        
        this._offsetX = 0;
        this._offsetY = 0;
        
        //variable for playing  
        this._waitTime = 1000;
        this._lineWidth = 1;

        //variable for color
        this._ctx = this._canvas.getContext("2d");
        this.constColor = {
            BACKGROUND:"white",
            LINE:"rgb(196, 233, 251)"
        };
        
        this.player = new Player();

        this.reset(cols, rows);
        this.addListener();
    }
    //这个函数是为了自动适应例如canvas长度、宽度等数据变化时调用的，
    reset(cols, rows=14) {
        this._cellHeight = this._viewHeight / 14;/*后面在改*/
        this._cellWidth =  this._viewWidth / 16;/*后面在改*/
        this._contentWidth = this._cellWidth * cols;
        this._contentHeight = this._cellHeight * rows;
        this._cellsMgr = new CellsMgr(cols, rows);
        this.redraw();
    }
    adaptSize() {
        this._viewWidth = this._canvas.clientWidth;
        this._viewHeight = this._canvas.clientHeight;
        this._canvas.setAttribute("height", this._viewHeight);
        this._canvas.setAttribute("width", this._viewWidth);

        let offsetRatioX = this._offsetX / this._contentWidth,/*第一次时候，这个为undefine*/
            offsetRatioY = this._offsetY / this._contentHeight;/*第一次时候，这个为undefine*/
        
        this._cellHeight = this._viewHeight / 14;/*后面在改*/
        this._cellWidth =  this._viewWidth / 16;/*后面在改*/
        
        this._contentWidth = this._cellWidth * this._cellsMgr.cols;
        this._contentHeight = this._cellHeight * this._cellsMgr.rows;

        this._offsetX = this._offsetX == 0 ? 0 : this._contentWidth * offsetRatioX;/*判断是否为零，是为了构造函数中this._contentWidth没有定义*/
        this._offsetY = this._offsetY == 0 ? 0 : this._contentHeight * offsetRatioY;
    
        this.redraw();
    }
    //******************setter and getter*************************
    get contentWidth() {
        return this._contentWidth;
    }
    get contentHeight() {
        return this._contentHeight;
    }
    set waitTime(value) {
        this._waitTime = value;
    }
    get waitTime() {
        return this._waitTime;
    }
/*     get data() {
        return this._cellsMgr.data;
    }
    set data(val) {
        this._cellsMgr.data = val;
        this.setGridOffsetX(0);
    } */
    
    getNoteSequence() {
        return this._cellsMgr.getNoteSequence();
    }
    setNoteSequence(noteSequence) {
        this._cellsMgr.setNoteSequence(noteSequence);
        this.setGridOffsetX(0);
    }
    isPlaying() {
        return this._cellsMgr.curCol != -1;
    }
    //return the smallest multiple of n which is greater or equal to x
    getPos(x, n) {
        let times = Math.ceil(x / n),
            ret = (times-1) * n;
        return ret >= x ? ret : ret+n;//这一步是为了考虑浮点误差（暂时的假设），例子好像是x/n刚好整除，当时得出来的数略大于真实的x/n，导致ceil错误 
    }

    drawBackground() {
        this._ctx.beginPath();
        this._ctx.rect(0, 0, this._viewWidth, this._viewHeight);
        this._ctx.stroke();
        this._ctx.fillStyle = this.constColor.BACKGROUND;
        this._ctx.fill();
    }
    drawLines(){
        this._ctx.strokeStyle = this.constColor.LINE;
        this._ctx.linewidth = this._lineWidth;
        //draw horizontal line
        for(let y = this.getPos(this._offsetY, this._cellHeight) - this._offsetY; y <= this._viewHeight; y += this._cellHeight) {
            //console.log("y: " + y);
            this._ctx.moveTo(0, y);
            this._ctx.lineTo(this._viewWidth, y);
        }
        //draw vertical line
        for(let x = this.getPos(this._offsetX, this._cellWidth) - this._offsetX; x <= this._viewWidth; x += this._cellWidth) {
            //console.log("x: " + x);
            this._ctx.moveTo(x, 0);
            this._ctx.lineTo(x, this._viewHeight);
        }
        this._ctx.stroke();
    }
    drawCell(col, row) {
        let x = Math.ceil(col * this._cellWidth - this._offsetX + this._lineWidth),
            y = Math.ceil(row * this._cellHeight - this._offsetY + + this._lineWidth),
            width = Math.floor(this._cellWidth - 2*this._lineWidth),
            height = Math.floor(this._cellHeight - 2*this._lineWidth);
        this._ctx.fillStyle = this._cellsMgr.getColor(col, row);
        this._ctx.fillRect(x, y, width, height);
    }
    drawAllCells() {
        this.drawBackground();
        this.drawLines();
        for(let col = Math.floor(this._offsetX / this._cellWidth), n = Math.floor((this._offsetX + this._viewWidth) / this._cellWidth); col <= n && col < this._cellsMgr.cols; ++col) {
            this.drawColCells(col);
        }
    }
    drawColCells(col) {
        for(let row = Math.floor(this._offsetY / this._cellHeight), m = Math.floor((this._offsetY + this._viewHeight)/this._cellHeight); row <= m && row < this._cellsMgr.rows; ++row) {
            this.drawCell(col,row);
        }
    }
    redraw() {
        this.drawBackground();
        this.drawLines();
        this.drawAllCells();
    }
    playHelper(col) {
        if(this.isPlaying() == false)//判断是否要终止播放
            return;
        //this._cellsMgr.curCol = col;
        let nextCol = this._cellsMgr.nextCol(col),
            prevCol = this._cellsMgr.prevCol(col);
        //console.log(this.waitTime);
        setTimeout(this.playHelper.bind(this, nextCol), this.waitTime);
        //api 
        //let playedCellRow = this._cellsMgr.getClickedRow(this._cellsMgr.curCol);
        //let state = this._cellsMgr.getState(col, playedCellRow);
        //move the grid
        if(this._contentWidth > this._viewWidth) {
            let c1 = (this._cellsMgr.curCol * this._cellWidth) >= (this._offsetX + this._offsetX + this._viewWidth) / 2,//判断当前列是否在canvas中间及其后面
                c2 = this._offsetX + this._viewWidth < this.contentWidth;//判断当前slider是否还可以向后移动
            if(c1 && c2) {
                let ratio = ( this._offsetX + this._cellWidth ) / this._contentWidth;
                //让滚动条前进
                this.dispatchOffsetXChangeEvent(ratio);
                //让网格前进
                this.setGridOffsetX(ratio);
            }
        }
        console.log("curCol " + this._cellsMgr.curCol + " col " + col + " cols " + this._cellsMgr.cols);
        if(this._cellsMgr.curCol ==  this._cellsMgr.cols - 1) {
            console.log("yes");
            this.setGridOffsetX(0);
            this.dispatchOffsetXChangeEvent(0);
        }
        this._cellsMgr.curCol = col;
        //play sound
        //this.player.playSound(playedCellRow,state);
        this.player.playSound(this._cellsMgr.getNote(col));
        //减少使用this.redraw()提升速度
        this.drawColCells(prevCol);
        this.drawColCells(col);
    }
    dispatchPlayEvent() {
        let event = new Event("play");
        document.dispatchEvent(event);//其中 grid 是canvas 的id，可能需要改动
    }
    dispatchStopEvent() {
        let event = new Event("stop");
        document.dispatchEvent(event);//其中 grid 是canvas 的id，可能需要改动
    }
    dispatchOffsetXChangeEvent(ratio) {
        let event = new CustomEvent("gridOffsetXChange", { "detail":{"ratio": ratio} });
        //console.log(this.posChangeEventName + " " + ratio)
        document.dispatchEvent(event);//其中 grid 是canvas 的id，可能需要改动
    }
    play() {
        if(this.isPlaying())
            return;
        this.dispatchPlayEvent();
        this.setGridOffsetX(0);
        this.dispatchOffsetXChangeEvent(0);
        this._cellsMgr.curCol = 0;
        this.playHelper(0);
    }
    stop() {
        this.dispatchStopEvent();
        this._cellsMgr.curCol = -1;
        this.redraw();
    }

    setGridOffsetX(ratio) {
        this._offsetX = ratio * this.contentWidth;
        this.redraw();
    }
    setGridOffsetY(ratio) {
        this._offsetY = ratio * this.contentHeight;
        this.redraw();
    }

    clickHandler(e) {
        let col = Math.floor((this._offsetX + e.offsetX) / this._cellWidth ),
            row = Math.floor((this._offsetY + e.offsetY) / this._cellHeight);
        //console.log(col + ", " + row);
        if(e.which == 1) /*mouse left*/{
            //获取当前被点击列之前被点击的行号
            let lastRow = this._cellsMgr.getClickedRow(col);
            //console.log("lastRow: " + lastRow);
            this._cellsMgr.addClick(col, row);
            this.drawCell(col, row);
            //判断是否要重新绘制之前的行号
            if(lastRow != -1 && lastRow != row) {
                this.drawCell(col, lastRow);
            }
        }
    }
    addListener() {
        this._canvas.addEventListener("click", this.clickHandler.bind(this), false);
    }
}