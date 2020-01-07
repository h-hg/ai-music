class ScrollBar {
    constructor(slider, trackLength, viewLength, contentLength, posChangeEventName, lengthName, sliderPosName, eventPos) {
        this.slider = slider;

        this.lengthName = lengthName;
        this.sliderPosName = sliderPosName;
        this.eventPos = eventPos;
        this.posChangeEventName = posChangeEventName;

        this.reset(trackLength, viewLength, contentLength);

        this.mousedownHandler = function(e) {
            let initPos = parseInt(this.slider.style[this.sliderPosName]),
                firstPos = e[this.eventPos];//鼠标按下时的坐标
            document.onmousemove = function(ev) {
                let delta = ev[this.eventPos] - firstPos,//应该是鼠标按着拖动，一旦有鼠标变化，便产生事件获得得到的坐标
                    sliderPos = initPos + delta;
                if(sliderPos < 0) {
                    sliderPos = 0;
                } else if(sliderPos >= this.viewLength - this.sliderLength) {
                    sliderPos = this.viewLength - this.sliderLength;
                }
                this.setSliderPos(sliderPos / this.trackLength);
                this.dispatchPosChangeEvent(sliderPos / this.trackLength);
            }.bind(this);
            document.onmouseup = function(ev) {
                document.onmousemove = null;
            }
        }.bind(this);

        this.enableMove();
    }

    //应该还有一个重置contentLength
    reset(viewLength, trackLength, contentLength) {
        this.trackLength = trackLength;
        this.viewLength = viewLength;
        this.contentLength = contentLength;
        this.sliderLength = this.viewLength / this.contentLength * this.trackLength;
        //位置要不要重置？
        this.slider.style[this.lengthName] = this.sliderLength + "px";
        this.slider.style.position = "absolute";
        this.slider.style[this.sliderPosName] = 0;
        //this.dispatchPosChangeEvent(0);
    }

    setSliderPos(ratio) {
        this.slider.style[this.sliderPosName] = (ratio*this.trackLength) + "px";
    }

    dispatchPosChangeEvent(ratio) {
        let event = new CustomEvent(this.posChangeEventName, { "detail":{"ratio": ratio} });
        //console.log(this.posChangeEventName + " " + ratio)
        document.dispatchEvent(event);//其中 grid 是canvas 的id，可能需要改动
    }
    enableMove() {
        this.slider.addEventListener("mousedown", this.mousedownHandler, false);
    }
    disableMove() {
        this.slider.removeEventListener("mousedown", this.mousedownHandler, false);
        console.log("remove");
    }
}

class ScrollBarH extends ScrollBar {
    constructor(slider, trackLength, viewLength, contentWidth, posChangeEventName) {
        super(slider, trackLength, viewLength, contentWidth, posChangeEventName, "width", "left", "clientX");
    }
}

class ScrollBarV extends ScrollBar {
    constructor(slider, trackLength, viewLength, contentWidth, posChangeEventName) {
        super(slider, trackLength, viewLength, contentWidth, posChangeEventName, "height", "top", "clientY");
    }
}