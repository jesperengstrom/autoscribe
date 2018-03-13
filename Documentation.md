# Autoscribe help

## Requirements

Chrome browser v.25 or newer

## Setup

Activate sound card's Stereo Mix, or similar internal audio stream, as recording device. Choose this device as microphone in the adress bar when Autoscribe is open and microphone access has been allowed.

## Keyboard shortcuts

* `CTRL-Backspace` - When cursor is at the begining of a transcribed 'chunk'; Merges current chunk with the previous.

* `CTRL-Enter` - When cursor is at the begining of a word; splits the current chunks into two at that word. If the word is a green (timestamped) keyword, the new two chunks get more precise, individual start & end times. Otherwise the new chunk will have no unique timestamp = insertion of timestamp here is not possible.