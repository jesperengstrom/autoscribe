import React from 'react';
import './Audiocontrol.css';

const Audiocontrol = ({ audio, onLoadSuccess, onLoadError }) => {
  const audioError = e => {
    // don't display error when no file loaded
    if (audio.filename === 'No audiofile loaded') {
      return onLoadError(false);
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
    return onLoadError(error);
  };

  return (
    <section id="audiocontrol-section">
      <audio
        id="audio-player"
        src={audio.path}
        onCanPlay={onLoadSuccess}
        onError={audioError}
        controls
        controlsList="nodownload"
      >
        <track kind="captions" />
        Your browser does not support HTML Audio
      </audio>
    </section>
  );
};

export default Audiocontrol;
