import { Grid } from './grid/Grid';
import { ScrollBarH, ScrollBarV } from './ScrollBar';
import { Gen } from './Gen';

class UI {
    constructor(noteSeq) {
        this.initElem(noteSeq);
        this.initListener();
        this.enableGridContainer();
    }
    initElem(noteSeq) {
        this.gridContainer = document.getElementById("grid-container");
        this.navBar = document.getElementById("nav-bar");
        this.controlBar = document.getElementById("control-bar");

        //elem in grid-container
        this.grid = new Grid(document.getElementById("grid"), noteSeq);
        this.gridScrollBarH = new ScrollBarH(
            document.getElementById("slider-h"),
            document.getElementById("track-h"),
            this.grid.visibleW,
            this.grid.scrollW,
            "scrollBarHCh"
        );
        this.gridScrollBarV = new ScrollBarV(
            document.getElementById("slider-v"),
            document.getElementById("track-v"),
            this.grid.visibleH,
            this.grid.scrollH,
            "scrollBarVCh"
        );
        //control-bar
        this.playBtn = document.getElementById("play-btn");

        this.tempoBtn = document.getElementById("tempo-btn");

        this.tempoRange = document.getElementById("tempo-range1");
        this.tempoVal = document.getElementById("tempo-val1");

        this.predictBtn = document.getElementById("predict-btn");
        this.instrumentBtn = document.getElementById("instrument-btn");
        this.saveBtn = document.getElementById("save-btn");
        this.shareBtn = document.getElementById("share-btn");
        this.settingBtn = document.getElementById("setting-btn");

        //other
        this.melodyGen = new Gen();

    }
    initListener() {
        //grid-container

        //control-bar
        this.playBtn.addEventListener("click", function (ev) {
            if (this.grid.isPlaying()) {
                this.grid.stop();
                this.playBtn.innerHTML = "<i class=\"fa fa-play\"></i>";
            } else {
                this.grid.play();
                this.playBtn.innerHTML = "<i class=\"fa fa-stop\"></i>";
            }
        }.bind(this), false);

        this.tempoBtn.addEventListener("click", function (ev) {
            console.log("sdf");
            $("#tempo-bar").modal();
            //$("#setting-bar").modal();
        }.bind(this), false);

        this.tempoRange.addEventListener("change", function (ev) {
            //miss code
            let val = ev.target.value;
            this.tempoVal.innerHTML = val;
        }.bind(this), false);

        this.predictBtn.addEventListener("click", function (ev) {
            this.disableGridContainer();
            let notes = this.grid.getNoteSeq();
            //console.log("getNoteSeq");
            //console.log(notes);
            let generatedMelody = this.melodyGen.genMelody(notes);
            setTimeout(function () {
                //console.log("After gen:");
                //console.log(generatedMelody);
                //console.log("gen length: " + generatedMelody.length);
                this.grid.setNoteSeq(generatedMelody);
            }.bind(this), 1000);
            this.enableGridContainer();
        }.bind(this), false);

        this.instrumentBtn.addEventListener("click", function (ev) {
            //miss code: change the instrument
        }.bind(this), false);

        this.saveBtn.addEventListener("click", function (ev) {
            //miss the code

        }.bind(this), false);

        this.shareBtn.addEventListener("click", function (ev) {
            //missing code: judge whether the user has logged in
            $("#share-bar").modal();
        }.bind(this), false);

        this.settingBtn.addEventListener("click", function (ev) {
            $("#setting-bar").modal();
        }.bind(this), false);

        //interact
        document.addEventListener("scrollBarHCh", function (e) {
            if (this.grid.isPlaying() == false)
                this.grid.setOffsetX(e.detail.ratio);
        }.bind(this), false);

        document.addEventListener("scrollBarVCh", function (e) {
            if (this.grid.isPlaying() == false)
                this.grid.setOffsetY(e.detail.ratio);
        }.bind(this), false);

        document.addEventListener("play", function (e) {
            this.disableGridContainer();
            //predictBtn.removeEventListener("click", predict, false);/*播放的时候禁止预测，可能需要给那个*/
        }.bind(this), false);

        document.addEventListener("stop", function (e) {
            this.enableGridContainer();
            //predictBtn.addEventListener("click", predict, false);
        }.bind(this), false);

        document.addEventListener("gridOffsetXRatioCh", function (e) {
            this.gridScrollBarH.setSliderPos(e.detail.ratio);
        }.bind(this), false);

        document.addEventListener("gridOffsetYRatioCh", function (e) {
            this.gridScrollBarV.setSliderPos(e.detail.ratio);
        }.bind(this), false);

        document.addEventListener("gridScrollWCh", function (e) {
            this.gridScrollBarH.reset(e.detail.posRatio, e.detail.sliderRatio);
        }.bind(this), false);

        document.addEventListener("gridScrollHCh", function (e) {
            this.gridScrollBarV.reset(e.detail.posRatio, e.detail.sliderRatio);
        }.bind(this), false);
    }
    enableGridContainer() {
        this.grid.enable();
        this.gridScrollBarH.enable();
        this.gridScrollBarV.enable();
    }
    disableGridContainer() {
        this.grid.disable();
        this.gridScrollBarH.disable();
        this.gridScrollBarV.disable();
    }
    resize() {
        this.gridContainer.style.height = (window.innerHeight - this.navBar.clientHeight - this.controlBar.clientHeight) + "px";
        //this.gridScrollBarH.resize();
        //this.gridScrollBarV.resize();
        this.grid.resize();
    }
}
export { UI };