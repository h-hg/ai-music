class ScrollBar {
    constructor(slider, trackL, sliderRatio, posChEventName) {
        this._slider = slider;
        this._trackL = trackL;
        this._sliderRatio = sliderRatio;
        this._posChEventName = posChEventName;
    }
    setSliderPos(posRatio) {
        this._sliderPos = posRatio * this._trackL;
    }
    setSliderL(sliderL) {
        this._sliderL = sliderL;
    }
    getEventPos(ev) { }
    initListener() {
        this.click = function (ev) {
            this.posBeforeMove = this._sliderPos;
            this.firstPos = this.getEventPos(ev);
            this._slider.addEventListener(window.env.hasTouch ? "touchmove" : "mousemove", this.hover, false);
        }.bind(this);

        this.hover = function (ev) {
            let delta = this.getEventPos(ev) - this.firstPos;//ev[this._eventPos] is the position of mouse when it is moving
            this._sliderPos = this.posBeforeMove + delta;

            if (this._sliderPos < 0) {
                this._sliderPos = 0;
            } else if (this._sliderPos > this._trackL - this._sliderL) {
                this._sliderPos = this._trackL - this._sliderL;
            }

            let ratio = this._sliderPos / this._trackL;
            this.setSliderPos(ratio);
            this.emitPosChEvent(ratio);
        }.bind(this);

        this.leave = function (ev) {
            this._slider.removeEventListener(window.env.hasTouch ? "touchmove" : "mousemove", this.hover, false);
        }.bind(this);
    }

    enable() {
        this._slider.addEventListener(window.env.hasTouch ? "touchstart" : "mousedown", this.click, false);
        this._slider.addEventListener(window.env.hasTouch ? "touchend" : "mouseup", this.leave, false);
    }
    disable() {
        this._slider.removeEventListener(window.env.hasTouch ? "touchstart" : "mousedown", this.click, false);
        this._slider.removeEventListener(window.env.hasTouch ? "touchend" : "mouseup", this.leave, false);
    }
    emitPosChEvent(posRatio) {
        let event = new CustomEvent(this._posChEventName, { "detail": { "ratio": posRatio } });
        document.dispatchEvent(event);
    }
    getCurTrackL() { }
    resize() {
        let posRatio = this._sliderPos / this._trackL;//We try to keep the the ratio of slider postion the same
        this._trackL = this.getCurTrackL();
        this.setSliderL(this._sliderRatio * this._trackL);
        this.setSliderPos(posRatio);
    }

    //This function is used when ( visibleL / scrollL ) is changed, in other word, the length of slider has to be changed
    reset(posRatio, sliderRatio) {
        this._sliderRatio = sliderRatio;
        this._sliderPos = this._trackL * posRatio;
        this.resize();
    }
}

class ScrollBarH extends ScrollBar {
    constructor(slider, track, visableL, scrollL, posChEventName) {
        super(slider, track.offsetWidth, visableL / scrollL, posChEventName);
        this._track = track;
        this.setSliderPos(0);
        this.setSliderL(track.offsetWidth * visableL / scrollL);
        this.initListener();
    }
    setSliderPos(posRatio) {
        super.setSliderPos(posRatio);
        this._slider.style.left = this._sliderPos + "px";
    }
    setSliderL(sliderL) {
        super.setSliderL(sliderL);
        this._slider.style.width = this._sliderL + "px";
    }
    getEventPos(ev) {
        return (ev.type === 'touchstart' || ev.type === 'touchmove') ? ev.touches[0].clientX : ev.clientX;
    }
    getCurTrackL() {
        return this._track.offsetWidth;
    }
}


class ScrollBarV extends ScrollBar {
    constructor(slider, track, visableL, scrollL, posChEventName) {
        super(slider, track.offsetWidth, visableL / scrollL, posChEventName);
        this._track = track;
        this.setSliderPos(0);
        this.setSliderL(track.offsetWidth * visableL / scrollL);
        this.initListener();
    }
    setSliderPos(posRatio) {
        super.setSliderPos(posRatio);
        this._slider.style.top = this._sliderPos + "px";
    }
    setSliderL(sliderL) {
        super.setSliderL(sliderL);
        this._slider.style.height = this._sliderL + "px";
    }
    getEventPos(ev) {
        return (ev.type === 'touchstart' || ev.type === 'touchmove') ? ev.touches[0].clientY : ev.clientY;
    }
    getCurTrackL() {
        return this._track.offsetHeight;
    }
}

export { ScrollBarH, ScrollBarV };