import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import speechRec from '../api/SpeechRec';
import Audiocontrol from './Audiocontrol';
import Transcribe from './Transcribe';
import '../css/main.css';
import './Main.css';

class Main extends Component {
  state = {
    isRecording: false,
    pendingRecording: false,
    isPlaying: false,
    currentTime: 0,
    volume: 0.5,
  };
  /**
   * On play/pause click
   */
  onPlaybackChange = isPlaying => {
    if (isPlaying) {
      this.rap.audioEl.play();
    } else {
      this.rap.audioEl.pause();
    }
    this.setState({ isPlaying: isPlaying === true });
  };
  /**
   * On rec button click
   */
  onRecordChange = () => {
    // stop audio while recording starts
    if (this.state.isPlaying) {
      this.onPlaybackChange(false);
    }
    if (!this.state.pendingRecording && !this.state.isRecording) {
      this.setState({ pendingRecording: true }, () =>
        speechRec.startAndListen(this.onRecognitionChange),
      );
    }
    if (this.state.isRecording) {
      speechRec.stop();
    }
  };
  /**
   * Speech recognition onstart event
   */
  onRecognitionChange = e => {
    if (e.type === 'start') {
      console.log('speech recognition started');
      this.setState({ isRecording: true, pendingRecording: false });
    }
    if (e.type === 'end') {
      console.log('speech recognition ended');
      this.setState({ isRecording: false });
      // stop audio when recording stops
      if (this.state.isPlaying) {
        this.onPlaybackChange(false);
      }
    }
  };

  /**
   * returns audio.currentTime every 1 sec and sets state
   */
  handleAudioProgressListen = time =>
    this.setState(() => ({ currentTime: time }));
  /**
   * handles seeking from progress bar
   */
  handleSeek = time => {
    this.setState({ currentTime: time }, () => {
      this.rap.audioEl.currentTime = time;
    });
  };
  handleVolumeChange = volume => {
    this.setState({ volume });
  };
  handleError = e => {
    // don't display error when no file loaded
    if (this.props.audioFile.filename === 'No audiofile loaded') {
      return this.props.onLoadError(false);
    }
    let error;

    switch (e.target.error.code) {
      case 2:
        error = 'A network error prevents audio from playing. Try reloading it';
        break;
      case 3:
        error =
          'There was a problem decoding the audio. Please inspect the file';
        break;
      case 4:
        error =
          "Can't read audio source. Try relocating it or see docs for help.";
        break;
      default:
        error = true;
        break;
    }
    return this.props.onLoadError(error);
  };

  render() {
    return (
      <main id="main-container">
        <ReactAudioPlayer
          src={this.props.audioFile.path}
          onCanPlay={this.props.onLoadSuccess}
          onError={this.handleError}
          listenInterval={1000}
          onListen={this.handleAudioProgressListen}
          volume={this.state.volume}
          // need to add a ref to access the play() and pause() functions on the element
          ref={element => {
            this.rap = element;
          }}
        />
        <Audiocontrol
          audioLoadSuccess={this.props.audioLoadSuccess}
          isRecording={this.state.isRecording}
          pendingRecording={this.state.pendingRecording}
          onRecordChange={this.onRecordChange}
          isPlaying={this.state.isPlaying}
          onPlaybackChange={this.onPlaybackChange}
          duration={this.props.audioFile.duration}
          currentTime={this.state.currentTime}
          handleSeek={this.handleSeek}
          volume={this.state.volume}
          handleVolumeChange={this.handleVolumeChange}
        />
        <Transcribe />
      </main>
    );
  }
}

export default Main;
