import React from 'react';

const WordPlay = props => (
  <span
    role="button"
    tabIndex={0}
    contentEditable="false"
    suppressContentEditableWarning
    className="wordPlay"
    data-time={props.time}
    onClick={props.onClick}
    onKeyPress={props.onClick}
  >
    {/* <i aria-hidden="true" className="play small icon" /> */}
    ▶️
  </span>
);

export default WordPlay;
