import React from 'react';

const SentencePlay = props => (
  <i
    aria-hidden="true"
    data-start={props.start}
    data-end={props.end}
    onClick={props.onClick}
    className="sentence-play play icon"
  />
);

export default SentencePlay;
