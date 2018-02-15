import React from 'react';
import './Audiocontrol.css';

const Audiocontrol = ({ audio, onLoadSuccess, onLoadError }) => (
  <section id="audiocontrol-section">
    <audio
      id="audio-player"
      src={audio.path}
      onCanPlay={onLoadSuccess}
      onError={onLoadError}
      controls
    >
      <track kind="captions" />
      Your browser does not support HTML Audio
    </audio>
  </section>
);

export default Audiocontrol;
