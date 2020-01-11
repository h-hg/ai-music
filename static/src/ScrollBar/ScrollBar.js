class ScrollBar {
    constructor(slider, trackL, sliderRatio, kwargs) {
        this._slider = slider;
        this._lengthName = kwargs.lengthName;
        this._sliderPosName = kwargs.sliderPosName;
        this._eventPos = kwargs.eventPos;
        this._posChEventName = kwargs.posChEventName;

        this._sliderPos = 0;//Why not read from css directly: Avoiding loss of accuracy, for reading from css can only be accurate to 2 decimal places
        this._slider.style.position = "absolute";
        this._slider.style[this._sliderPosName] = this._sliderPos;

        this._trackL = trackL;
        this.reset(0, sliderRatio);

        this.mousedownHandler = function (e) {

            let initPos = this._sliderPos,
                firstPos = e[this._eventPos];//firstPos is the position of mouse when the mouse is clicked
            //console.log("initPos: " + initPos);
            document.onmousemove = function (ev) {

                let delta = ev[this._eventPos] - firstPos;//ev[this._eventPos] is the position of mouse when it is moving
                this._sliderPos = initPos + delta;

                if (this._sliderPos < 0) {
                    this._sliderPos = 0;
                } else if (this._sliderPos > this._trackL - this._sliderL) {
                    this._sliderPos = this._trackL - this._sliderL;
                    //console.log("trackL " + this._trackL + " sliderLength " + this._sliderL + " sliderPos " + this._sliderPos);//testing for bug 2
                }
                let ratio = this._sliderPos / this._trackL;
                this.setSliderPos(ratio);
                this._emitPosChEvent(ratio);
            }.bind(this);
            document.onmouseup = function (ev) {
                document.onmousemove = null;
            }
        }.bind(this);

        this.enableMove();
    }

    resizeHelper(trackL) {
        let posRatio = this._sliderPos / this._trackL;//We try to keep the the ratio of slider postion the same
        this._trackL = trackL;
        this._sliderL = this._sliderRatio * this._trackL;
        this._slider.style[this._lengthName] = this._sliderL + "px";
        this.setSliderPos(posRatio);
    }

    //This function is used when ( visibleL / scrollL ) is changed, in other word, the length of slider has to be changed
    reset(posRatio, sliderRatio) {
        this._sliderRatio = sliderRatio;
        this._sliderPos = this._trackL * posRatio;
        this.resizeHelper(this._trackL);
    }
    setSliderPos(posRatio) {
        this._sliderPos = posRatio * this._trackL;
        this._slider.style[this._sliderPosName] = this._sliderPos + "px";
    }
    _emitPosChEvent(posRatio) {
        let event = new CustomEvent(this._posChEventName, { "detail": { "ratio": posRatio } });
        document.dispatchEvent(event);
    }
    enableMove() {
        this._slider.addEventListener("mousedown", this.mousedownHandler, false);
    }
    disableMove() {
        this._slider.removeEventListener("mousedown", this.mousedownHandler, false);
    }
}

class ScrollBarH extends ScrollBar {
    constructor(slider, track, visableL, scrollL, posChEventName) {
        super(slider, track.offsetWidth, visableL / scrollL,
            { "posChEventName": posChEventName, "lengthName": "width", "sliderPosName": "left", "eventPos": "clientX" }
        );
        this._track = track;
    }
    resize() {
        console.log("scrollbarh resize: " + this._track.offsetWidth);
        super.resizeHelper(this._track.offsetWidth)
    }
}

class ScrollBarV extends ScrollBar {
    constructor(slider, track, visableL, scrollL, posChEventName) {
        super(slider, track.offsetHeight, visableL / scrollL,
            { "posChEventName": posChEventName, "lengthName": "height", "sliderPosName": "top", "eventPos": "clientY" }
        );
        this._track = track;
    }
    resize() {
        super.resizeHelper(this._track.offsetHeight);
    }
}

export { ScrollBarH, ScrollBarV };