import { Grid } from './Grid/Grid';
import { ScrollBarH, ScrollBarV } from './ScrollBar/ScrollBar';
import { Gen } from './Melody/Gen';

let grid = new Grid(document.getElementById("grid"), ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3', 'A#4', 'G#4', 'F#4']);


let playBtn = document.getElementById("play-btn");
let play = function () {
    if (grid.isPlaying()) {
        grid.stop();
        playBtn.innerHTML = "<i class=\"fa fa-play\"></i>";
    } else {
        grid.play();
        playBtn.innerHTML = "<i class=\"fa fa-stop\"></i>";
    }
};
playBtn.addEventListener("click", play, false);

let gridScrollBarH = new ScrollBarH(
    document.getElementById("slider-h"),
    document.getElementById("track-h"),
    grid.visibleW,
    grid.scrollW,
    "scrollBarHCh"
);
let gridScrollBarV = new ScrollBarV(
    document.getElementById("slider-v"),
    document.getElementById("track-v"),
    grid.visibleH,
    grid.scrollH,
    "scrollBarVCh"
);

let melodyGenerator = new Gen();
let predictBtn = document.getElementById("predict-btn");
function predict() {
    let notes = grid.getNoteSeq();
    console.log("getNoteSeq");
    console.log(notes);
    let generatedMelody = melodyGenerator.genMelody(notes);
    setTimeout(function () {
        console.log("After gen:");
        console.log(generatedMelody);
        console.log("gen length: " + generatedMelody.length);
        grid.setNoteSeq(generatedMelody);
    }, 1000);
}
predictBtn.addEventListener("click", predict, false);


document.addEventListener("scrollBarHCh", function (e) {
    if (grid.isPlaying() == false)
        grid.setOffsetX(e.detail.ratio);
}, false);
document.addEventListener("scrollBarVCh", function (e) {
    if (grid.isPlaying() == false)
        grid.setOffsetY(e.detail.ratio);
}, false);
document.addEventListener("play", function (e) {
    gridScrollBarH.disableMove();
    gridScrollBarV.disableMove();/*播放的时候禁止预测*/
    predictBtn.removeEventListener("click", predict, false);/*播放的时候禁止预测，可能需要给那个*/
}, false);
document.addEventListener("stop", function (e) {
    gridScrollBarH.enableMove();
    gridScrollBarV.enableMove();
    predictBtn.addEventListener("click", predict, false);
}, false);
document.addEventListener("gridOffsetXCh", function (e) {
    gridScrollBarH.setSliderPos(e.detail.ratio);
}, false);

window.onresize = function () {
    console.log("onsize " + gridScrollBarH._track.offsetWidth);
    gridScrollBarH.resize();
    gridScrollBarV.resize();
    grid.resize();
};
document.addEventListener("gridScrollWCh", function (e) {
    gridScrollBarH.reset(e.detail.posRatio, e.detail.sliderRatio);
}, false);
document.addEventListener("gridScrollHCh", function (e) {
    gridScrollBarV.reset(e.detail.posRatio, e.detail.sliderRatio);
}, false);
//test

