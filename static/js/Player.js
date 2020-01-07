class Player {
    constructor() {
        this.note_table = [['C3', 'C#3'], ['D3', 'D#3'], ['E3', 'E3'], ['F3', 'F#3'], ['G3', 'G#3'], ['A3', 'A#3'], ['B3', 'B3'],
        ['C4', 'C#4'], ['D4', 'D#4'], ['E4', 'E4'], ['F4', 'F#4'], ['G4', 'G#4'], ['A4', 'A#4'], ['B4', 'B4']];
        this.synth = new Tone.PolySynth(3, Tone.SimpleSynth).set({
            'volume': -4,
            'oscillator': {
                'type': 'triangle17'
            },
            'envelope': {
                'attack': 0.01,
                'decay': 0.1,
                'sustain': 0.2,
                'release': 1.7,
            }
        }).toMaster();
        this.synth.stealVoices = false;
    }

    playSound(row,state){
        if (state != 0) {
            let note = '';
            note = this.note_table[13 - row][state - 1];
            this.synth.triggerAttackRelease(note,0.4);
        }
    }


}