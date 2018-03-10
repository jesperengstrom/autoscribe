import React from 'react';
import PropTypes from 'prop-types';
import './Word.css';

const Word = props => {
  const wordPlaying = props.wordPlaying ? 'keyword-playing' : '';
  const handleClick = () => {
    // no keywordplay while recording
    if (!props.isRecording)
      props.handleSelectionPlay(
        props.wordStart + props.offset,
        props.senEnd + props.offset * 0.35,
      );
  };
  return (
    <React.Fragment>
      <span
        className={
          props.wordStart ? `span-keyword ${wordPlaying}` : `span-word`
        }
        onClick={props.wordStart ? handleClick : () => true}
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

export default Word;

Word.propTypes = {
  word: PropTypes.string.isRequired,
  wordId: PropTypes.string.isRequired,
  index: PropTypes.shape({
    sen: PropTypes.number.isRequired,
    word: PropTypes.number.isRequired,
  }).isRequired,
  isRecording: PropTypes.bool.isRequired,
  wordStart: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  senEnd: PropTypes.number.isRequired,
  wordPlaying: PropTypes.bool.isRequired,
  handleSelectionPlay: PropTypes.func.isRequired,
  handleWordChange: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  last: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
};
