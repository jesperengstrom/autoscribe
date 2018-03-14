import React from 'react';
import PropTypes from 'prop-types';
import './Word.css';

const Word = props => {
  const wordPlaying = props.wordPlaying ? 'keyword-playing' : '';

  const handleClick = () => {
    if (!props.isRecording)
      // no keywordplay while recording
      props.handleSelectionPlay(
        props.wordStart + props.offset,
        props.senEnd + props.offset * 0.35,
      );
  };

  const setSelection = element => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // select word on focus
  const handleFocus = e => {
    setSelection(e.target);
  };

  const handleKeyUp = e => {
    if (!e.target.innerText && e.target.nextElementSibling) {
      // if we 'remove' a word, select the next one
      setSelection(e.target.nextElementSibling);
    }
  };

  return (
    <React.Fragment>
      <span
        className={
          props.audioLoadSuccess && props.wordStart
            ? `span-keyword ${wordPlaying}`
            : `span-word`
        }
        onClick={
          props.audioLoadSuccess && props.wordStart ? handleClick : () => true
        }
        onBlur={e => props.handleWordChange(e, props.index)}
        onFocus={handleFocus}
        onKeyDown={e => props.handleKeyDown(e, props.index)}
        onKeyUp={handleKeyUp}
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
  handleKeyDown: PropTypes.func.isRequired,
  last: PropTypes.bool.isRequired,
  offset: PropTypes.number.isRequired,
  audioLoadSuccess: PropTypes.bool.isRequired,
};
