import React from 'react';
import PropTypes from 'prop-types';
import './Words.css';

export const Word = props => (
  <React.Fragment>
    <span className="span-word" contentEditable suppressContentEditableWarning>
      {props.word}
      {props.last ? '.' : ''}
    </span>
    {` `}
  </React.Fragment>
);

export const Keyword = props => {
  const keywordPlaying = props.nowPlaying ? 'keyword-playing' : '';

  const handleClick = () => {
    // no keywordplay while recording
    if (!props.isRecording)
      props.handleSelectionPlay(
        props.start + props.offset,
        props.end + props.offset * 0.35,
      );
  };

  return (
    <React.Fragment>
      <span
        className={`span-keyword ${keywordPlaying}`}
        onClick={handleClick}
        role="button"
        onKeyPress={() => {}}
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
      >
        {props.word}
        {props.last ? '.' : ''}
      </span>
      {` `}
    </React.Fragment>
  );
};

export default { Word, Keyword };

Keyword.propTypes = {
  word: PropTypes.string.isRequired,
  isRecording: PropTypes.bool.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  nowPlaying: PropTypes.bool.isRequired,
  handleSelectionPlay: PropTypes.func.isRequired,
  last: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
};

Word.propTypes = {
  word: PropTypes.string.isRequired,
  last: PropTypes.bool.isRequired,
};
