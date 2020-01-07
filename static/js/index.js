let grid = document.getElementById("grid");
let gridController = new Grid(grid, 28);


let playbutton = document.getElementById("play-button");
playbutton.onclick = function() {
    if(gridController.isPlaying()){
        gridController.stop();
        playbutton.innerHTML = "<i class=\"fa fa-play\"></i>";
    }else {
        gridController.play();
        playbutton.innerHTML = "<i class=\"fa fa-stop\"></i>";
    }
};

let gridScrollBarH = new ScrollBarH(
    document.getElementById("slider-h"),
    document.getElementById("track-h").offsetWidth,
    document.getElementById("grid").width,
    gridController.contentWidth,
    "gridOffsetXChange"
);
let gridScrollBarV = new ScrollBarV(
    document.getElementById("slider-v"),
    document.getElementById("track-v").offsetHeight,
    document.getElementById("grid").height,
    gridController.contentHeight,
    "gridOffsetYChange"
);


document.addEventListener("gridOffsetXChange", function(e) {
    if(gridController.isPlaying() == false)
        gridController.setGridOffsetX(e.detail.ratio);
}, false);


document.addEventListener("gridOffsetYChange", function(e) {
    if(gridController.isPlaying() == false)
        gridController.setGridOffsetY(e.detail.ratio);
}, false);
document.addEventListener("play", function(e) {
    gridScrollBarH.disableMove();
    gridScrollBarV.disableMove();
},false);
document.addEventListener("stop", function(e) {
    gridScrollBarH.enableMove();
    gridScrollBarV.enableMove();
},false);


let melodyGenerator = new Gen();
let predictButton = document.getElementById("predict-button");
function predict() {
    let notes = gridController.getNoteSequence();
    console.log("notes");
    console.log(notes);
    let generatedMelody = melodyGenerator.genMelody(notes);
    setTimeout(function() {
        console.log("gen:");
        console.log(generatedMelody);
        console.log("gen length: " + generatedMelody.length);
        gridController.setNoteSequence(generatedMelody);
    }, 1000);
}

predictButton.addEventListener("click", predict, false);


//test
let setttingButton = document.getElementById("setting-button");
setttingButton.onclick = function() {
    gridScrollBarH.enableMove();
};
