import { UI } from "./UI"

window.env = {
    hasTouch: 'ontouchstart' in document.documentElement === true
};

let noteSeq = ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3', 'A#4', 'G#4', 'F#4'];
let ui = new UI(noteSeq);

window.onresize = function (ev) {
    ui.resize();
};
ui.resize();