import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import speechRec from '../api/speechRec';
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
    speed: 1,
    lang: 'sv',
    transcript: '',
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
        this.handlePlaybackChange(false);
      }
    }
    if (e.type === 'error') {
      console.log(`A speech recognition error occurred: ${e.error}`);
    }
  };

  handleRecognitionResult = e => {
    // results.push(`1: ${e.results[0][0].transcript}`);
    // if (e.results.length > 1) {
    //   console.log(`2: ${e.results[1][0].transcript}`);
    // }
    // if (e.results[0].isFinal) {
    // }
  };

  /**
   * On play/pause click
   */
  handlePlaybackChange = isPlaying => {
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
  handleRecordChange = () => {
    // stop audio while recording starts
    if (this.state.isPlaying) {
      this.handlePlaybackChange(false);
    }
    if (!this.state.pendingRecording && !this.state.isRecording) {
      this.setState({ pendingRecording: true }, () =>
        speechRec.startAndListen(
          this.state.lang,
          this.onRecognitionChange,
          this.handleRecognitionResult,
        ),
      );
    }
    if (this.state.isRecording) {
      speechRec.stop();
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

  /**
   * on dropdown speed change
   * @param {obj} event
   * @param {obj} All props and proposed value
   */
  handleSpeedChange = (e, d) => {
    const speed = d.value;
    this.rap.audioEl.playbackRate = speed;
    this.setState({ speed });
  };

  handleLangChange = (e, d) => {
    const lang = d.value;
    this.setState({ lang });
  };

  handleAudioError = e => {
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
          onError={this.handleAudioError}
          listenInterval={1000}
          onListen={this.handleAudioProgressListen}
          volume={this.state.volume}
          // playbackRate={this.state.speed}
          // need to add a ref to access the play() and pause() functions on the element
          ref={element => {
            this.rap = element;
          }}
        />
        <Audiocontrol
          audioLoadSuccess={this.props.audioLoadSuccess}
          isRecording={this.state.isRecording}
          pendingRecording={this.state.pendingRecording}
          handleRecordChange={this.handleRecordChange}
          isPlaying={this.state.isPlaying}
          handlePlaybackChange={this.handlePlaybackChange}
          duration={this.props.audioFile.duration}
          currentTime={this.state.currentTime}
          handleSeek={this.handleSeek}
          volume={this.state.volume}
          handleVolumeChange={this.handleVolumeChange}
          speed={this.state.speed}
          handleSpeedChange={this.handleSpeedChange}
          lang={this.state.lang}
          handleLangChange={this.handleLangChange}
        />
        <Transcribe transcript={this.state.transcript} />
      </main>
    );
  }
}

export default Main;
