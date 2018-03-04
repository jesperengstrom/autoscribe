import React from 'react';
import PropTypes from 'prop-types';
import { FormattedTime } from 'react-player-controls';
import { Popup, Button } from 'semantic-ui-react';
import './Sentence.css';

const PopupContent = props => {
  const handlePlayClick = () => {
    // offset * 35 seems to equal delay between play press & starttime
    props.handleSelectionPlay(
      props.start + props.offset * 0.35,
      props.end + props.offset * 0.35,
    );
  };

  const handleTimestampClick = () => {
    props.handleToggleTimestamp(props.timestamp, props.start);
  };

  return (
    <div>
      <Button
        onClick={handleTimestampClick}
        circular
        icon="hourglass start"
        className={`popup-btn add-timestamp-btn ${
          props.timestamp ? 'timestamp-present' : ''
        }`}
      />
      <Button
        onClick={handlePlayClick}
        circular
        icon="play"
        className="popup-btn sentence-play-btn"
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
      {props.timestamp && (
        <span className="timestamp">
          [<FormattedTime numSeconds={props.start} />]{` `}
        </span>
      )}
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

Sentence.propTypes = {
  timestamp: PropTypes.bool,
  isRecording: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  start: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    .isRequired,
  nowPlaying: PropTypes.bool.isRequired,
};

Sentence.defaultProps = {
  timestamp: false,
};

Popup.propTypes = {
  timestamp: PropTypes.bool,
  handleToggleTimestamp: PropTypes.func,
  offset: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  isRecording: PropTypes.bool,
  isPlaying: PropTypes.bool,
  handleSelectionPlay: PropTypes.func,
};

PopupContent.propTypes = {
  timestamp: PropTypes.bool,
  handleToggleTimestamp: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  handleSelectionPlay: PropTypes.func.isRequired,
};

PopupContent.defaultProps = {
  timestamp: false,
};
