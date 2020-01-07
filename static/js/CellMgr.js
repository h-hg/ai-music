//cell color mangement
class CellsMgr {
    constructor(cols, rows) {
        this.initTable();
        this.initColors();
        this.reset(cols, rows);
    }
    initTable() {
        this.index2note = [
            ['Rest', 'B4'],
            ['Rest', 'A4', 'A#4'],
            ['Rest', 'G4', 'G#4'],
            ['Rest', 'F4', 'F#4'],
            ['Rest', 'E4'],
            ['Rest', 'D4', 'D#4'],
            ['Rest', 'C4', 'C#4'],
            ['Rest', 'B3'],
            ['Rest', 'A3', 'A#3'],
            ['Rest', 'G3', 'G#3'],
            ['Rest', 'F3', 'F#3'],
            ['Rest', 'E3'],
            ['Rest', 'D3', 'D#3'],
            ['Rest', 'C3', 'C#3']
        ];
        this.note2index = {
            "Rest": -1,
            'B4':0,
            'A4':1, 'A#4':1,
            'G4':2, 'G#4':2,
            'F4':3, 'F#4':3,
            'E4':4,
            'D4':5, 'D#4':5,
            'C4':6, 'C#4':6,
            'B3':7,
            'A3':8, 'A#3':8,
            'G3':9, 'G#3':9,
            'F3':10, 'F#3':10,
            'E3':11,
            'D3':12, 'D#3':12,
            'C3':13, 'C#3':13
        };
    }
    initColors() {
        this.colors = {
            ZERO: "white",
            ZERO_CUR: "rgb(228, 239, 245)",
            ONE: [
                "rgb(227, 48, 89)",
                "rgb(247, 148, 61)",
                "rgb(237, 217, 41)",
                "rgb(149, 198, 49)",
                "rgb(17, 130, 109)",
                "rgb(91, 55, 204)",
                "rgb(234, 87, 178)"
            ],
            ONE_CUR: [
                "rgb(248, 202, 212)",
                "rgb(252, 214, 181)",
                "rgb(248, 240, 173)",
                "rgb(215, 233, 176)",
                "rgb(164, 207, 199)",
                "rgb(192, 179, 236)",
                "rgb(247, 191, 226)"
            ],
            TWO: [
                "blue",
                "blue",
                "blue",
                "blue",
                "blue",
                "blue",
                "blue"
            ],
            TWO_CUR: [
                "black",
                "black",
                "black",
                "black",
                "black",
                "black",
                "black"
            ]
        };
    }
    reset(cols, rows = 14) {
        this._cols = cols;
        this._rows = rows;
        this._curCol = -1;
        /*出发点：网格中每一列中最多只有一行可以被选中*/
        //_rowClicked[i] 表示 第i列第_rowClicked[i]行 被选中，-1 表示没有列被选中
        this._rowClicked = [];
        //_colStates[i] 表示 第i列第_colStates[i]行 选中的状态，状态值只有三种情况，分别如下，0 - unclicked, 1 - once clicked, 2 - double clicked
        this._colStates = [];

        for (let i = 0; i < this._cols; ++i) {
            this._rowClicked[i] = -1;
            this._colStates[i] = 0;
        }
    }
    get rows() {
        return this._rows;
    }
    get cols() {
        return this._cols;
    }
    nextCol(col) {
        return (col + 1 + this._cols) % this._cols;
    }
    prevCol(col) {
        return (col - 1 + this._cols) % this._cols;
    }
/*     get data() {
        return {
            "cols": this._cols,
            "rows": this._rows,
            "rowClicked": this._rowClicked,
            "colStates": this._colStates
        };
    }
    set data(val) {
        this._cols = val.cols;
        this._rows = val.rows;
        this._rowClicked = val.rowClicked;
        this._colStates = val.colStates;
    } */
    get curCol() {
        return this._curCol;
    }
    set curCol(value) {
        this._curCol = value;
    }
    //return the state of cell, state value is 0 - unclicked, 1 - once clicked, 2 - double clicked
    getState(col, row) {
        return this._rowClicked[col] == row ? this._colStates[col] : 0;
    }
    //返回第col被点击的行，也就是状态值非零，不存在则返回-1
    getClickedRow(col) {
        return this._rowClicked[col];
    }
    getColor(col, row) {
        switch (this.getState(col, row)) {
            case 0:
                return this.colors["ZERO" + (col == this.curCol ? "_CUR" : "")];
            case 1:
                return this.colors["ONE" + (col == this.curCol ? "_CUR" : "")][row % 7];
            case 2:
                return this.colors["TWO" + (col == this.curCol ? "_CUR" : "")][row % 7];
        }
    }
    addClick(col, row) {
        //0:1,  1:2,  2:2, 3:2,  4:1,  5:2,  6:2
        //7;1,  8:2,  9:2, 10:2, 11:1, 12:2  13:2
        if (this._rowClicked[col] == row) {
            this._colStates[col] = (this._colStates[col] + 1) % (([0, 4, 7, 11].indexOf(row) == -1) ? 3 : 2);
            if (this._colStates[col] == 0) {
                this._rowClicked[col] = -1;
            }
        } else {
            this._rowClicked[col] = row;
            this._colStates[col] = 1;
        }
    }
    getNote(col) {
        let clickedRow = this._rowClicked[col]; //指定列被选择的列
        return clickedRow == -1 ? "Rest" : this.index2note[clickedRow][this._colStates[col]];
    }
    getNoteSequence() {
        let ret = new Array(this.cols);
        for (let i = 0; i < ret.length; ++i) {
            ret[i] = this.getNote(i);
        }
        return ret;
    }

    setNoteSequence(noteSequence) {
        this.reset(noteSequence.length);
        for (let i = 0; i < noteSequence.length; ++i) {
            if(noteSequence[i] == "Rest") {
                continue;
            }
            this._rowClicked[i] = note2index[noteSequence[i]];
            this._colStates[i] = noteSequence[i].length == 2 ? 1 : 2;
        }
    }
}