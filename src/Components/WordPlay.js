import React from 'react';

const WordPlay = props => (
  <button
    contentEditable="false"
    suppressContentEditableWarning
    className="wordPlay"
    data-time={props.time}
    onClick={props.onClick}
  >
    {/* <i aria-hidden="true" className="play small icon" /> */}
    play
  </button>
);

export default WordPlay;
