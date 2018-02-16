import React, { Component } from 'react';
import Audiocontrol from './Audiocontrol';
import Transcribe from './Transcribe';
import '../css/main.css';
import './Main.css';

class Main extends Component {
  state = {
    isListening: false,
    isPlaying: false,
  };
  onPlaybackChange = isPlaying => {
    if (isPlaying) this.audio.play();
    else this.audio.pause();
    this.setState({ isPlaying: isPlaying === true });
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
        <audio
          src={this.props.audioFile.path}
          onCanPlay={this.props.onLoadSuccess}
          onError={this.handleError}
          ref={audio => {
            this.audio = audio;
          }}
        >
          <track kind="captions" />
          Your browser does not support HTML Audio
        </audio>
        <Audiocontrol
          audioLoadSuccess={this.props.audioLoadSuccess}
          isListening={this.state.isListening}
          isPlaying={this.state.isPlaying}
          onPlaybackChange={this.onPlaybackChange}
          duration={this.props.audioFile.duration}
        />
        <Transcribe />
      </main>
    );
  }
}

export default Main;
