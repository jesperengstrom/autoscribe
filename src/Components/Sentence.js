import React from 'react';
import { Popup, Button } from 'semantic-ui-react';
import './Sentence.css';

const PopupContent = props => {
  const handleClick = () => {
    props.handleSelectionPlay(props.start, props.end);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        circular
        icon="play"
        className="sentence-play-btn"
      />
    </div>
  );
};

const Sentence = props => {
  // <-- call sentence, but return popup containting PopupContent triggered by Sentence
  const sentencePlaying = props.nowPlaying ? 'sentence-playing' : '';
  const sentence = (
    <p
      className={`p-sentence ${sentencePlaying} ${
        props.isRecording && props.isPlaying ? 'tone-down' : ''
      }`}
    >
      {props.children}
    </p>
  );
  return (
    <Popup
      trigger={sentence}
      position="left center"
      on="hover"
      horizontalOffset={5}
      className={props.isRecording ? 'display-none' : ''} // do not display popup when recording
      hoverable
    >
      <Popup.Content>{PopupContent(props)}</Popup.Content>
    </Popup>
  );
};

export default Sentence;
