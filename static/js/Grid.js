class Grid{
    //canvas is canvas element
    constructor(canvas, cols=16, rows=14) {
        this.canvas = canvas;
        this.viewWidth = this.canvas.clientWidth;
        this.viewHeight = this.canvas.clientHeight;
        this.canvas.setAttribute("height", this.viewHeight);
        this.canvas.setAttribute("width", this.viewWidth);
        
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        
        //variable for playing  
        this._waitTime = 1000;
        this.lineWidth = 1;

        //variable for color
        this.ctx = this.canvas.getContext("2d");
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
        this.CELL_HEIGHT = this.viewHeight / 14;/*后面在改*/
        this.CELL_WIDTH =  this.viewWidth / 16;/*后面在改*/
        this._contentWidth = this.CELL_WIDTH * cols;
        this._contentHeight = this.CELL_HEIGHT * rows;
        this.cellsMgr = new CellsMgr(cols, rows);
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
        return this.cellsMgr.data;
    }
    set data(val) {
        this.cellsMgr.data = val;
        this.setGridOffsetX(0);
    } */
    
    getNoteSequence() {
        return this.cellsMgr.getNoteSequence();
    }
    setNoteSequence(noteSequence) {
        this.cellsMgr.setNoteSequence(noteSequence);
        this.setGridOffsetX(0);
    }
    isPlaying() {
        return this.cellsMgr.curCol != -1;
    }
    //return the smallest multiple of n which is greater or equal to x
    getPos(x, n) {
        let times = Math.ceil(x / n),
            ret = (times-1) * n;
        return ret >= x ? ret : ret+n;//这一步是为了考虑浮点误差（暂时的假设），例子好像是x/n刚好整除，当时得出来的数略大于真实的x/n，导致ceil错误 
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.viewWidth, this.viewHeight);
        this.ctx.stroke();
        this.ctx.fillStyle = this.constColor.BACKGROUND;
        this.ctx.fill();
    }
    drawLines(){
        this.ctx.strokeStyle = this.constColor.LINE;
        this.ctx.linewidth = this.lineWidth;
        //draw horizontal line
        for(let y = this.getPos(this.gridOffsetY, this.CELL_HEIGHT) - this.gridOffsetY; y <= this.viewHeight; y += this.CELL_HEIGHT) {
            //console.log("y: " + y);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.viewWidth, y);
        }
        //draw vertical line
        for(let x = this.getPos(this.gridOffsetX, this.CELL_WIDTH) - this.gridOffsetX; x <= this.viewWidth; x += this.CELL_WIDTH) {
            //console.log("x: " + x);
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.viewHeight);
        }
        this.ctx.stroke();
    }
    drawCell(col, row) {
        let x = Math.ceil(col * this.CELL_WIDTH - this.gridOffsetX + this.lineWidth),
            y = Math.ceil(row * this.CELL_HEIGHT - this.gridOffsetY + + this.lineWidth),
            width = Math.floor(this.CELL_WIDTH - 2*this.lineWidth),
            height = Math.floor(this.CELL_HEIGHT - 2*this.lineWidth);
        this.ctx.fillStyle = this.cellsMgr.getColor(col, row);
        this.ctx.fillRect(x, y, width, height);
    }
    drawAllCells() {
        this.drawBackground();
        this.drawLines();
        for(let col = Math.floor(this.gridOffsetX / this.CELL_WIDTH), n = Math.floor((this.gridOffsetX + this.viewWidth) / this.CELL_WIDTH); col <= n && col < this.cellsMgr.cols; ++col) {
            this.drawColCells(col);
        }
    }
    drawColCells(col) {
        for(let row = Math.floor(this.gridOffsetY / this.CELL_HEIGHT), m = Math.floor((this.gridOffsetY + this.viewHeight)/this.CELL_HEIGHT); row <= m && row < this.cellsMgr.rows; ++row) {
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
        this.cellsMgr.curCol = col;
        let nextCol = this.cellsMgr.nextCol(col),
            prevCol = this.cellsMgr.prevCol(col);
        //console.log(this.waitTime);
        setTimeout(this.playHelper.bind(this, nextCol), this.waitTime);
        //api 
        //let playedCellRow = this.cellsMgr.getClickedRow(this.cellsMgr.curCol);
        //let state = this.cellsMgr.getState(col, playedCellRow);
        
        //play sound
        //this.player.playSound(playedCellRow,state);
        this.player.playSound(this.cellsMgr.getNote(col));
        let c1 = (this.cellsMgr.curCol * this.CELL_HEIGHT) >= (this.gridOffsetX + this.gridOffsetX + this.viewWidth) / 2,//判断当前列是否在canvas中间及其后面
            c2 = this.gridOffsetX + this.viewWidth < this.contentWidth;//判断当前slider是否还可以向后移动
        if(c1 && c2) {
            //让滚动条前进
            //让网格前进
        }
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
    play() {
        if(this.isPlaying())
            return;
        this.dispatchPlayEvent();
        this.cellsMgr.curCol = 0;
        this.playHelper(0);
    }
    stop() {
        this.dispatchStopEvent();
        this.cellsMgr.curCol = -1;
        this.redraw();
    }

    setGridOffsetX(ratio) {
        this.gridOffsetX = ratio * this.contentWidth;
        this.redraw();
    }
    setGridOffsetY(ratio) {
        this.gridOffsetY = ratio * this.contentHeight;
        this.redraw();
    }

    clickHandler(e) {
        let col = Math.floor((this.gridOffsetX + e.offsetX) / this.CELL_WIDTH ),
            row = Math.floor((this.gridOffsetY + e.offsetY) / this.CELL_HEIGHT);
        //console.log(col + ", " + row);
        if(e.which == 1) /*mouse left*/{
            //获取当前被点击列之前被点击的行号
            let lastRow = this.cellsMgr.getClickedRow(col);
            //console.log("lastRow: " + lastRow);
            this.cellsMgr.addClick(col, row);
            this.drawCell(col, row);
            //判断是否要重新绘制之前的行号
            if(lastRow != -1 && lastRow != row) {
                this.drawCell(col, lastRow);
            }
        }
    }
    addListener() {
        this.canvas.addEventListener("click", this.clickHandler.bind(this), false);
    }
}