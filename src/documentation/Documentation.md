# Autoscribe help

## About

Autoscribe is a web app that lets you transcribe recorded audio files to text in the browser using [Javascript Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

In order for it to work properly you need to read the Setup section carefully.

This app was made by Jesper Engström as an educational thesis on the capacities of Javascript speech recognition. Essay can be read [here](./Jesper_Engstrom_Examensarbete.pdf) (in swedish).

## Requirements

Chrome browser v.25 or newer

## Setup

**PC**:

1. Activate sound card's Stereo Mix, or similar internal audio stream, as your computer's recording device (fig. 1).

  ![Activate Stereo mix](./fig1.png "fig. 1")

2. Make sure the site uses the https-protocol (e.g here) or microphone access will be denied.

3. Load an audio file and hit record button. Allow page access to your microphone.

4. Choose Stereo mix (or other device with the internal audio stream) as microphone by clicking the camera icon in the adress bar.

  ![Choose Stereo mix in browser](./fig2.png "fig. 2")

**Mac**: TBA

## Features

* Audio files that are loaded into and "recorded" with the built in player becomes hyperlinked text, that automatically highlights when played and lets you jump to the corresponding place in the audio file.

* Timestamps can be inserted for individual transcribed "chunks".

* Transcriptions are exportable in markdown (.md) format.

* Transcription is stored in browser Local Storage to prevent it from being lost.

## Usage

Coming soon.

### Keyboard shortcuts

* `CTRL-Backspace` - When cursor is at the begining of a transcribed 'chunk'; Merges current chunk with the previous.

* `CTRL-Enter` - When cursor is at the begining of a word; splits the current chunks into two at that word. If the word is a green (timestamped) keyword, the new two chunks get more precise, individual start & end times. Otherwise the new chunk will have no unique timestamp = insertion of timestamp here is not possible.

## Source code

[Gitgub](https://github.com/jesperengstrom/autoscribe)