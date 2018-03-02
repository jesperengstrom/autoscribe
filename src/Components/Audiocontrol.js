import React, { Component } from 'react';
import {
  PlaybackControls,
  ProgressBar,
  TimeMarker,
  TimeMarkerType,
  VolumeSlider,
  ControlDirection,
} from 'react-player-controls';
import { Dropdown } from 'semantic-ui-react';
import { speedOptions, langOptions } from '../api/options';
import Recordbutton from './Recordbutton';
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
          <Recordbutton
            audioLoadSuccess={!this.props.audioLoadSuccess}
            isRecording={this.props.isRecording}
            pendingRecording={this.props.pendingRecording}
            handleRecordChange={this.props.handleRecordChange}
          />
          <PlaybackControls
            isPlayable={
              this.props.audioLoadSuccess && !this.props.pendingRecording
            }
            isPlaying={this.props.isPlaying}
            showPrevious
            hasPrevious={
              this.props.audioLoadSuccess &&
              !this.props.pendingRecording &&
              (this.props.isPlaying ||
                this.props.currentTime > this.props.transcriptSpan.start) ===
                true &&
              (this.props.isPlaying && this.props.isRecording) === false
            }
            showNext
            hasNext={
              this.props.audioLoadSuccess &&
              !this.props.pendingRecording &&
              this.props.transcriptSpan.end > 0 &&
              (this.props.isPlaying ||
                this.props.currentTime !== this.props.transcriptSpan.end) ===
                true &&
              (this.props.isPlaying && this.props.isRecording) === false
            }
            onPlaybackChange={this.props.handlePlaybackChange}
            onPrevious={() =>
              this.props.handleSeek(
                this.props.transcriptSpan.start + this.props.offset * 0.35,
              )
            }
            onNext={() => this.props.handleSeek(this.props.transcriptSpan.end)}
          />
        </div>
        <div className="flex flex-column justify-center justify-evenly align-center">
          <div className="off-white">
            <Dropdown
              disabled={!this.props.audioLoadSuccess}
              inline
              options={langOptions}
              value={this.props.lang}
              onChange={this.props.handleLangChange}
            />
          </div>
          <div className="off-white">
            <Dropdown
              disabled={!this.props.audioLoadSuccess}
              inline
              options={speedOptions}
              value={this.props.speed}
              onChange={this.props.handleSpeedChange}
            />
          </div>
        </div>
        <div className="flex justify-center align-center">
          <ProgressBar
            totalTime={this.props.duration || 0}
            currentTime={this.props.currentTime}
            isSeekable={this.props.audioLoadSuccess && !this.props.isRecording}
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
