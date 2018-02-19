import React, { Component } from 'react';
import {
  PlaybackControls,
  ProgressBar,
  TimeMarker,
  TimeMarkerType,
  VolumeSlider,
  ControlDirection,
} from 'react-player-controls';
import './Audiocontrol.css';
import '../css/react-player-controls.css';

class Audiocontrol extends Component {
  state = {
    lastSeekStart: 0,
    lastSeekEnd: 0,
    lastIntent: 0,
  };
  render() {
    return (
      <section id="audiocontrol-section" className="p-05 pl-1 pr-1">
        <div className="flex justify-center align-center">
          <PlaybackControls
            isPlayable={this.props.audioLoadSuccess}
            isPlaying={this.props.isPlaying}
            showPrevious
            hasPrevious={false}
            showNext
            hasNext={false}
            onPlaybackChange={this.props.onPlaybackChange}
            onPrevious={() => alert('Go to previous')}
            onNext={() => alert('Go to next')}
          />
        </div>
        <div className="flex justify-center align-center">
          <ProgressBar
            totalTime={this.props.duration || 0}
            currentTime={this.props.currentTime}
            isSeekable={this.props.audioLoadSuccess}
            onSeek={this.props.handleSeek}
            onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
            onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
            onIntent={time => this.setState(() => ({ lastIntent: time }))}
          />
        </div>
        <div className="flex justify-center align-center off-white">
          <TimeMarker
            totalTime={this.props.duration}
            currentTime={this.props.currentTime}
            markerSeparator=" | "
            firstMarkerType={TimeMarkerType.ELAPSED}
            secondMarkerType={TimeMarkerType.DURATION}
          />
        </div>
        <div className="flex justify-center align-center">
          <VolumeSlider
            direction={ControlDirection.VERTICAL}
            volume={this.props.volume}
            onVolumeChange={this.props.handleVolumeChange}
            isEnabled={this.props.audioLoadSuccess}
          />
        </div>
      </section>
    );
  }
}
export default Audiocontrol;
