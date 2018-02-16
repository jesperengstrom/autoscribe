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
}) => (
  <section
    id="audiocontrol-section"
    className="flex  justify-center align-center"
  >
    <div>
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
      <ProgressBar
        totalTime={duration}
        currentTime={0}
        isSeekable
        // onSeek={time => this.setState(() => ({ currentTime: time }))}
        // onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
        // onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
        // onIntent={time => this.setState(() => ({ lastIntent: time }))}
      />
    </div>
  </section>
);

export default Audiocontrol;
