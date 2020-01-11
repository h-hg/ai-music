class Colors {
    constructor(){
        this._note2color = {
            "B4": "rgb(227, 48, 89)", 
            "A4": "rgb(247, 148, 61)", "A#4": "blue",
            "G4": "rgb(237, 217, 41)", "G#4": "blue",
            "F4": "rgb(149, 198, 49)", "F#4": "blue",
            "E4": "rgb(17, 130, 109)", 
            "D4": "rgb(91, 55, 204)",  "D#4": "blue",
            "C4": "rgb(234, 87, 178)", "C#4": "blue",
            "B3": "rgb(227, 48, 89)",  
            "A3": "rgb(247, 148, 61)", "A#3": "blue",
            "G3": "rgb(237, 217, 41)", "G#3": "blue",
            "F3": "rgb(149, 198, 49)", "F#3": "blue",
            "E3": "rgb(17, 130, 109)", 
            "D3": "rgb(91, 55, 204)",  "D#3": "blue",
            "C3": "rgb(234, 87, 178)", "C#3": "blue",
            "Rest": "white",
        };
        this._activeNote2Color = {
            "B4": "rgb(248, 202, 212)",
            "A4": "rgb(252, 214, 181)", "A#4": "black",
            "G4": "rgb(248, 240, 173)", "G#4": "black",
            "F4": "rgb(215, 233, 176)", "F#4": "black",
            "E4": "rgb(164, 207, 199)", 
            "D4": "rgb(192, 179, 236)", "D#4": "black",
            "C4": "rgb(247, 191, 226)", "C#4": "black",
            "B3": "rgb(248, 202, 212)",
            "A3": "rgb(252, 214, 181)", "A#3": "black",
            "G3": "rgb(248, 240, 173)", "G#3": "black",
            "F3": "rgb(215, 233, 176)", "F#3": "black",
            "E3": "rgb(164, 207, 199)", 
            "D3": "rgb(192, 179, 236)", "D#3": "black",
            "C3": "rgb(247, 191, 226)", "C#3": "black",
            "Rest": "rgb(228, 239, 245)",
        };
        this._colorTable = {
            "bg": "white",
            "line":"rgb(196, 233, 251)"
        };
    }
    getNoteColor(note, isActive) {
        return isActive ? this._activeNote2Color[note] : this._note2color[note];
    }
    //return the color of background
    get bg(){
        return this._colorTable.bg;
    }
    //return the color of line
    get line() {
        return this._colorTable.line;
    }
}