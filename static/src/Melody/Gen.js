import { Midi } from '@tonejs/midi';

class Gen {

    constructor() { }

    async loadFromUrl(url, notes) {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(notes)
        })
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer()
            return new Midi(arrayBuffer)
        } else {
            throw new Error(`could not load ${url}`);
        }
    }

    //return an note array
    genMelody(noteSequence) {
        let midi = this.loadFromUrl('./predict', noteSequence);
        let generatedNotes = [];
        midi.then(function (midi) {
            midi.tracks[0].notes.forEach(note => {
                generatedNotes.push(note.name);
            })
        });
        return generatedNotes;
    }
}

export { Gen };