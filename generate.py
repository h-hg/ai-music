import magenta.music as mm
import magenta
# Import dependencies.
from magenta.models.melody_rnn import melody_rnn_sequence_generator
from magenta.models.shared import sequence_generator_bundle
from magenta.music.protobuf import generator_pb2
from magenta.music.protobuf import music_pb2

import os
import time
import tempfile
import pretty_midi

# Initialize the model.
BUNDLE_NAME = 'attention_rnn'
bundle = sequence_generator_bundle.read_bundle_file(
    os.path.abspath(BUNDLE_NAME+'.mag'))
generator_map = melody_rnn_sequence_generator.get_generator_map()
melody_rnn = generator_map['attention_rnn'](checkpoint=None, bundle=bundle)
melody_rnn.initialize()

bar_length = 4
note_table = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
              'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'Rest']
total_time = 0.5 * 8 * bar_length
velocity = 80


def _list2Pitch(note_list):
    # convert note name to midi pitch
    pitch_list = []
    for i in note_list:
        pitch = 0
        if i == 'Rest':
            pitch_list.append(-1)
        else:
            pitch = note_table.index(i) + 48
            pitch_list.append(pitch)
    return pitch_list

# test
# print(_list2Pitch(note_table))


def _pitchList2NoteSequence(pitch_list):
    # convert list to note sequence
    # input: list note = [60,61]
    # output: NoteSequence
    start = 0.0
    duration = 0.5
    ns = music_pb2.NoteSequence()
    for i in pitch_list:
        if i == -1:
            start += duration
        else:
            ns.notes.add(pitch=i, start_time=start,
                         end_time=start+duration, velocity=velocity)
            # print(f"start {start}")
            start += duration
    ns.total_time = start
    ns.tempos.add(qpm=60)
    return ns

# test
# notes = ['Rest','C3', 'C#3', 'Rest', 'F#3','Rest']
# song = _pitchList2NoteSequence(_list2Pitch(notes))
# mm.sequence_proto_to_midi_file(song,'output.mid')


def generate_melody(input_list):
    # the NoteSequence
    input_ns = _pitchList2NoteSequence(_list2Pitch(input_list))
    # the higher the temperature the more random the sequence.
    temperature = 1.0
    # the end time of input
    last_end_time = (max(n.end_time for n in input_ns.notes)
                     if input_ns.notes else 0)
    # length of generated piece
    total_seconds = total_time - last_end_time

    # options
    generator_options = generator_pb2.GeneratorOptions()
    generator_options.args['temperature'].float_value = temperature
    generator_section = generator_options.generate_sections.add(start_time=last_end_time + 0.5,
                                                                end_time=total_seconds)

    gen_sequence = melody_rnn.generate(input_ns, generator_options)

    output = tempfile.NamedTemporaryFile()
    mm.sequence_proto_to_midi_file(gen_sequence, output.name)
    output.seek(0)
    return output


# test
# notes = ['C3', 'D3', 'E3', 'C3', 'C3', 'D3', 'E3', 'C3']
# generate_melody(notes)
