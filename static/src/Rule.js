class Rule {
    constructor(noteSeq, config) {
        this._config = config;
        this._initTable();
        this.setNoteSeq(noteSeq);
    }
    _initTable() {
        this._idx2note = [
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
        this._note2idx = {
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
            'C3':13, 'C#3':13,
            "Rest": -1
        };
    }
    _reset(cols, rows = 14) {
        //update
        this._config.cols = cols;
        this._config.rows = rows;
        //rule: Only one row in each column of the grid can be selected
        //The value of _rowClicked[i] represent that row _rowClicked[i] in column i is selected, -1 means unselected.
        this._rowClicked = new Array(cols).fill(-1);
        //The value of _colStates[i] represent the state of column i row _colStates[i]. There are only three cases of status values, 0 - unclicked, 1 - once clicked, 2 - double clicked
        this._colStates = new Array(cols).fill(0);
    }
    getClickedRow(col) {
        return this._rowClicked[col];
    }
    getColNote(col) {
        let clickedRow = this._rowClicked[col];
        return clickedRow == -1 ? "Rest" : this._idx2note[clickedRow][this._colStates[col]];
    }
    getNote(col, row) {
        let clickedRow = this._rowClicked[col];
        return clickedRow != row ? "Rest" : this._idx2note[clickedRow][this._colStates[col]];
    }
    getNoteSeq() {
        let ret = new Array(this.cols);
        for (let i = 0; i < ret.length; ++i) {
            ret[i] = this.getColNote(i);
        }
        return ret;
    }

    setNoteSeq(noteSeq) {
        for(let i = noteSeq.length; i < this._config.coln; ++i) {
            noteSeq.push("Rest");
        }
        this._reset(noteSeq.length);
        for (let i = 0; i < noteSeq.length; ++i) {
            if(noteSeq[i] == "Rest") {
                continue;
            }
            this._rowClicked[i] = this._note2idx[noteSeq[i]];
            this._colStates[i] = noteSeq[i].length == 2 ? 1 : 2;
        }
    }
    click(col, row) {
        //The number of states of cell is as follows
        //row: number of states
        //0:2,  1:3,  2:3, 3:3,  4:2,  5:3,  6:3
        //7;2,  8:3,  9:3, 10:3, 11:2, 12:3  13:3
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

}