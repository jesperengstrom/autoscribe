import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';
import speechRec from '../api/speechRec';
import utils from '../api/utils';
import Playback from './Playback';
import Editor from './Editor';
import '../css/main.css';
import './Audiocontrol.css';

class Audiocontrol extends Component {
  state = {
    isRecording: false,
    pendingRecording: false,
    isPlaying: false,
    speechRecError: false,
    currentTime: 0,
    volume: 0.5,
    speed: 1,
    lang: 'sv',
    latestTranscript: {},
    stopOn: false,
    stopOnEndIsRunning: false,
    transcriptSpan: { start: 0, end: 0 },
  };

  onRecognitionChange = e => {
    if (e.type === 'start') {
      console.log('speech recognition started');
      this.setState({
        isRecording: true,
        pendingRecording: false,
        speechRecError: false,
      });
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
      this.setState({ speechRecError: e.error });
    }
  };

  onRecognitionResult = e => {
    // get ref instead of state since it's more exact
    utils.findKeywords(
      e.results,
      this.rap.audioEl.currentTime,
      this.recognitionArrCallback,
    );
  };

  setTranscriptSpan = transcriptSpan => {
    this.setState({ transcriptSpan });
  };

  recognitionArrCallback = obj => {
    this.setState({ latestTranscript: obj });
    // force rec stop if results isfinal + continous -- remove later?
    if (this.props.settings.continuous) {
      this.handleRecordChange();
    }
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
    this.setState({ isPlaying: isPlaying === true }, () => {
      // pause also stops recording (if rec)
      if (!this.state.isPlaying && this.state.isRecording) {
        this.handleRecordChange();
      }
    });
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
          this.props.settings.continuous,
          this.state.lang,
          this.onRecognitionChange,
          this.onRecognitionResult,
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

  handleSeek = time => {
    this.setState({ currentTime: time }, () => {
      this.rap.audioEl.currentTime = time;
    });
  };

  handleVolumeChange = volume => {
    this.setState({ volume });
  };

  handleSelectionPlay = (start, end) => {
    if (start) {
      console.log(`playing from: ${start}`);
      this.handleSeek(start);
      this.handlePlaybackChange(true);
      this.setState({ stopOn: end }, () => {
        // prevent more & more setIntervals running
        if (!this.state.stopOnEndIsRunning) this.stopOnEnd();
      });
    } else console.log(`handleSelectionPlay got a ${start}`);
  };

  stopOnEnd = () => {
    this.setState({ stopOnEndIsRunning: true }, () => {
      const interval = setInterval(() => {
        // console.log('running interval!');
        if (
          this.state.currentTime > this.state.stopOn ||
          !this.state.isPlaying
        ) {
          this.handlePlaybackChange(false);
          clearInterval(interval);
          this.setState({ stopOn: false, stopOnEndIsRunning: false });
        }
      }, 500);
    });
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
      <main id="audiocontrol-container">
        <ReactAudioPlayer
          src={this.props.audioFile.path}
          onCanPlay={this.props.onLoadSuccess}
          onError={this.handleAudioError}
          listenInterval={1000}
          onListen={this.handleAudioProgressListen}
          volume={this.state.volume}
          // need to add a ref to access the play() and pause() functions on the element
          ref={element => {
            this.rap = element;
          }}
        />
        <Playback
          audioLoadSuccess={this.props.audioLoadSuccess}
          duration={this.props.audioFile.duration}
          offset={this.props.settings.offset}
          isRecording={this.state.isRecording}
          pendingRecording={this.state.pendingRecording}
          isPlaying={this.state.isPlaying}
          currentTime={this.state.currentTime}
          transcriptSpan={this.state.transcriptSpan}
          volume={this.state.volume}
          speed={this.state.speed}
          lang={this.state.lang}
          handleRecordChange={this.handleRecordChange}
          handlePlaybackChange={this.handlePlaybackChange}
          handleSeek={this.handleSeek}
          handleVolumeChange={this.handleVolumeChange}
          handleSpeedChange={this.handleSpeedChange}
          handleLangChange={this.handleLangChange}
        />
        <Editor
          offset={this.props.settings.offset}
          filename={this.props.audioFile.filename}
          currentTime={this.state.currentTime}
          latestTranscript={this.state.latestTranscript}
          isRecording={this.state.isRecording}
          isPlaying={this.state.isPlaying}
          speechRecError={this.state.speechRecError}
          handleSelectionPlay={this.handleSelectionPlay}
          setTranscriptSpan={this.setTranscriptSpan}
        />
      </main>
    );
  }
}

export default Audiocontrol;

Audiocontrol.propTypes = {
  audioLoadSuccess: PropTypes.bool.isRequired,
  audioFile: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  settings: PropTypes.shape({
    continuous: PropTypes.bool.isRequired,
    offset: PropTypes.number.isRequired,
  }).isRequired,
  onLoadError: PropTypes.func.isRequired,
  onLoadSuccess: PropTypes.func.isRequired,
};
