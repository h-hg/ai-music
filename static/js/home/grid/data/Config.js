//class Config store the data shared by components associate with grid, such as Colors, Controller and Painter.
class Config {
    constructor() {
        this._cols = 16; //number of column
        this._rows = 14; //number of row
        this._lineW = 1; //line width, it is also the cell padding
        this._cellW = null; //cell width
        this._cellH = null; //cell height
        this._offsetX = 0; //the offset of grid(canvas) on the x axis
        this._offsetY = 0; //the offset of grid(canvas) on the y axis
        this._visibleW = null; //visible width, it is equal to the actual width of grid(canvas)
        this._visibleH = null; //visible height, it is equal to the actual height of grid(canvas)
        this._activeCol = -1; //active column, it stands for the column which is playing, -1 means none
        this._scrollW = null; //scroll width, it is virtual width of grid(canvas)
        this._scrollH = null; //scroll height, it is virtual height of grid(canvas)
        this._coln = 16; //The number of column presented on the grid(canvas)
        this._rown = 14; //The number of row presented on the grid(canvas)
    }
    get rows() {
        return this._rows;
    }
    set rows(val) {
        this._rows = val;
    }
    get cols() {
        return this._cols;
    }
    set cols(val) {
        this._cols = val;
    }
    get cellPadding() {
        return this._lineW;
    }
    get lineW() {
        return this._lineW;
    }
    get cellW() {
        return this._cellW;
    }
    set cellW(val) {
        this._cellW = val;
    }
    get cellH() {
        return this._cellH;
    }
    set cellH(val) {
        this._cellH = val;
    }
    get offsetX() {
        return this._offsetX;
    }
    set offsetX(val) {
        this._offsetX = val;
    }
    get offsetY() {
        return this._offsetY;
    }
    set offsetY(val) {
        this._offsetY = val;
    }
    get visibleW() {
        return this._visibleW;
    }
    set visibleW(val) {
        this._visibleW = val;
    }
    get visibleH() {
        return this._visibleH;
    }
    set visibleH(val) {
        this._visibleH = val;
    }
    get activeCol() {
        return this._activeCol;
    }
    set activeCol(val) {
        this._activeCol = val;
    }
    get scrollH() {
        return this._scrollH;
    }
    set scrollH(val) {
        this._scrollH = val;
    }
    get scrollW() {
        return this._scrollW;
    }
    set scrollW(val) {
        this._scrollW = val;
    }
    get coln() {
        return this._coln;
    }
    set coln(val) {
        this._coln = val;
    }
    get rown() {
        return this._rown;
    }
    set rown(val) {
        this._rown = val;
    }
}

export { Config };