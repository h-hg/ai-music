class ScrollBar {
    constructor(slider, trackLength, ratio, kwargs) {
        this.slider = slider;
        this.lengthName = kwargs.lengthName;
        this.sliderPosName = kwargs.sliderPosName;
        this.eventPos = kwargs.eventPos;
        this.posChangeEventName = kwargs.posChangeEventName;

        this.sliderPos = 0;//引入这个是为了避免设置css后，从css读取造成精度误差
        this.slider.style.position = "absolute";
        //this.slider.style[this.sliderPosName] = 0;
        this.slider.style[this.sliderPosName] = this.sliderPos;

        this.reset(ratio,trackLength);

        this.mousedownHandler = function(e) {
            console.log("e");
            console.log(e);
            let initPos = this.getSliderPos(),
                firstPos = e[this.eventPos];//鼠标按下时的坐标
            document.onmousemove = function(ev) {
                //console.log("ev");
                //console.log(ev);
                let delta = ev[this.eventPos] - firstPos;//应该是鼠标按着拖动，一旦有鼠标变化，便产生事件获得得到的坐标
                this.sliderPos = initPos + delta;
                //console.log("delta: " + delta + " sliderPos: " + sliderPos);
                if(this.sliderPos < 0) {
                    this.sliderPos = 0;
                } else if(this.sliderPos > this.trackLength - this.sliderLength) {
                    this.sliderPos = this.trackLength - this.sliderLength;
                    //console.log("trackLength " + this.trackLength + " sliderLength " + this.sliderLength + " sliderPos " + this.sliderPos);
                }
                //console.log("sliderPos: " + sliderPos);
                let ratio = this.sliderPos / this.trackLength;
                this.setSliderPos(ratio);
                this.dispatchPosChangeEvent(ratio);
            }.bind(this);
            document.onmouseup = function(ev) {
                document.onmousemove = null;
            }
        }.bind(this);

        this.enableMove();
        console.log("slider-h");
        console.log(this);
    }

    //用trackLength改变的时候，自适应
    adaptSize(trackLength) {
        let posRatio = this.getSliderPos() / this.trackLength;
        //console.log("pos: " + this.getSliderPos() + " PosRatio: " + posRatio + " old_trackL: " + this.trackLength + " new_trackL " + trackLength);
        this.trackLength = trackLength;
        this.sliderLength = this.ratio * this.trackLength;
        this.slider.style[this.lengthName] = this.sliderLength + "px";
        this.setSliderPos(posRatio);
    }

    //用于scrollHeight（或者说visableLength/ Height改变的时候）改变
    reset(ratio, trackLength=this.trackLength) {
        this.ratio = ratio;
        this.trackLength = trackLength;
        this.adaptSize(trackLength);  
    }

    setSliderPos(ratio) {
        this.sliderPos = ratio * this.trackLength;
        this.slider.style[this.sliderPosName] = this.sliderPos + "px";
    }
    getSliderPos() {
        return this.sliderPos;
        //return parseInt(this.slider.style[this.sliderPosName]);
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
    constructor(slider, trackLength, visableLength, scrollLenght, posChangeEventName) {
        super(slider, trackLength, visableLength / scrollLenght,
              {"posChangeEventName": posChangeEventName, "lengthName": "width", "sliderPosName": "left", "eventPos":"clientX"}
        );
    }
}

class ScrollBarV extends ScrollBar {
    constructor(slider, trackLength, visabelLength, scrollLength, posChangeEventName) {
        super(slider, trackLength, visabelLength / scrollLength,
              {"posChangeEventName": posChangeEventName, "lengthName": "height", "sliderPosName": "top", "eventPos":"clientY"}
        );
    }
}