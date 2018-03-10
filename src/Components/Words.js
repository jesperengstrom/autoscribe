import React from 'react';
import PropTypes from 'prop-types';
import './Words.css';

export const Word = props => (
  <React.Fragment>
    <span
      className="span-word"
      // listen for when user leaves element after change
      onBlur={e => props.handleWordChange(e, props.index)}
      onKeyDown={e => props.handleBackspace(e, props.index)}
      role="textbox"
      tabIndex={0}
      data-id={props.wordId}
      data-first={props.index.word === 0}
      contentEditable
      suppressContentEditableWarning
    >
      {props.word}
    </span>
    {props.last ? `` : ` `}
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
        onBlur={e => props.handleWordChange(e, props.index)}
        onKeyDown={e => props.handleBackspace(e, props.index)}
        data-id={props.wordId}
        data-first={props.index.word === 0}
        role="button"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
      >
        {props.word}
      </span>
      {props.last ? `` : ` `}
    </React.Fragment>
  );
};

export default { Word, Keyword };

Keyword.propTypes = {
  word: PropTypes.string.isRequired,
  wordId: PropTypes.string.isRequired,
  index: PropTypes.shape({
    sen: PropTypes.number.isRequired,
    word: PropTypes.number.isRequired,
  }).isRequired,
  isRecording: PropTypes.bool.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  nowPlaying: PropTypes.bool.isRequired,
  handleSelectionPlay: PropTypes.func.isRequired,
  handleWordChange: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  last: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
};

Word.propTypes = {
  word: PropTypes.string.isRequired,
  wordId: PropTypes.string.isRequired,
  index: PropTypes.shape({
    sen: PropTypes.number.isRequired,
    word: PropTypes.number.isRequired,
  }).isRequired,
  last: PropTypes.bool.isRequired,
  handleWordChange: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
};
