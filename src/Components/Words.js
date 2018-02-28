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
  const keywordPlaying = props.playing ? 'keyword-playing' : '';
  return (
    <React.Fragment>
      <span
        className={`span-keyword ${keywordPlaying}`}
        data-start={props.start}
        data-end={props.end}
        onClick={props.handleKeywordClick}
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
