class Player {
    constructor() {
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

    playSound(note, duration=0.4){
        if(note == "Rest") {
            return;
        }
        this.synth.triggerAttackRelease(note,0.4);
    }


}