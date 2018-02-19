import React from 'react';
import { PlaybackControls, ProgressBar } from 'react-player-controls';
import './Audiocontrol.css';
import '../css/react-player-controls.css';

const Audiocontrol = ({
  audioLoadSuccess,
  isListening,
  isPlaying,
  onPlaybackChange,
  duration = 0,
  currentTime,
  handleSeek,
}) => (
  <section id="audiocontrol-section" className="p-05">
    <div className="flex justify-center align-center">
      <PlaybackControls
        isPlayable={audioLoadSuccess}
        isPlaying={isPlaying}
        showPrevious
        hasPrevious={false}
        showNext
        hasNext={false}
        onPlaybackChange={onPlaybackChange}
        onPrevious={() => alert('Go to previous')}
        onNext={() => alert('Go to next')}
      />
    </div>
    <div className="flex justify-center align-center">
      <ProgressBar
        totalTime={duration}
        currentTime={currentTime}
        isSeekable={audioLoadSuccess}
        onSeek={handleSeek}
        // onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
        // onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
        // onIntent={time => this.setState(() => ({ lastIntent: time }))}
      />
    </div>
  </section>
);
export default Audiocontrol;
