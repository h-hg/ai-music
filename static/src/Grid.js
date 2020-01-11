class Grid {
    constructor(canvas, noteSeq) {
        this._config = new Config();
        this._colors = new Colors();
        this._rule = new Rule(noteSeq, this._config);
        this._player = new Player();
        this._painter = new Painter(canvas.getContext("2d"), this._colors, this._rule, this._config);
        this._controller = new Controller(canvas, this._player, this._painter, this._rule, this._config);

        this._painter.redraw();
    }
    isPlaying() {
        return this._controller.isPlaying();
    }
    setOffsetX(ratio) {
        this._controller.setOffsetX(ratio);
    }
    setOffsetY(ratio) {
        this._controller.setOffsetY(ratio);
    }
    play() {
        this._controller.play();
    }
    stop() {
        this._controller.stop();
    }
    setNoteSeq(noteSeq) {
        this._rule.setNoteSeq(noteSeq);
        this._controller.reset();
    }
    getNoteSeq() {
        return this._rule.getNoteSeq();
    }
    get waitTime() {
    	return this._controller.waitTime;
    }
    set waitTime(val) {
    	this._controller.waitTime = val;
    }
    get scrollW() {
        return this._config.scrollW;
    }
    get scrollH() {
        return this._config.scrollH;
    }
    get visibleW() {
        return this._config.visibleW;
    }
    get visibleH() {
        return this._config.visibleH;
    }
    resize() {
        this._controller.resize();
    }
}