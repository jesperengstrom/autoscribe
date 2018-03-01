import React from 'react';
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
    if (!props.isRecording) props.handleSelectionPlay(props.start, props.end);
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
