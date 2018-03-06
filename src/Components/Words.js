import React from 'react';
import PropTypes from 'prop-types';
import './Words.css';

export const Word = props => (
  <React.Fragment>
    <span
      className="span-word"
      // listen for when user leaves element after change
      onBlur={e => props.handleWordChange(e, props.index)}
      role="textbox"
      tabIndex={0}
      data-id={props.wordId}
      contentEditable
      suppressContentEditableWarning
    >
      {props.word}
      {/* {props.last ? '.' : ''} */}
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
        onKeyDown={() => true}
        data-id={props.wordId}
        role="button"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
      >
        {props.word}
        {/* {props.last ? '.' : ''} */}
      </span>
      {props.last ? `` : ` `}
    </React.Fragment>
  );
};

export default { Word, Keyword };

Keyword.propTypes = {
  word: PropTypes.string.isRequired,
  wordId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isRecording: PropTypes.bool.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  nowPlaying: PropTypes.bool.isRequired,
  handleSelectionPlay: PropTypes.func.isRequired,
  handleWordChange: PropTypes.func.isRequired,
  last: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
};

Word.propTypes = {
  word: PropTypes.string.isRequired,
  wordId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  last: PropTypes.bool.isRequired,
  handleWordChange: PropTypes.func.isRequired,
};
