import React from 'react';
import { Popup } from 'semantic-ui-react';

import './Sentence.css';

const Sentence = props => {
  const sentencePlaying = props.playing ? 'sentence-playing' : '';
  const sentence = (
    <p className={`p-sentence ${sentencePlaying}`}>{props.children}</p>
  );
  const popupContent = <span>Hi!</span>;

  return (
    <Popup
      trigger={sentence}
      position="left center"
      on="hover"
      horizontalOffset={5}
      hoverable="false"
    >
      <Popup.Content>{popupContent}</Popup.Content>
    </Popup>
  );
};

export default Sentence;

// renderSentencePlay = () => {
//   if (this.props.transcript.transcript) {
//     return (
//       <SentencePlay
//         // offset * 35 seems to equal delay between play press & starttime
//         start={this.props.transcript.start + this.props.offset * 0.35}
//         end={this.props.transcript.end + this.props.offset * 0.35}
//         handleKeywordClick={this.props.handleKeywordClick}
//       />
//     );
//   }
//   return false;
// };

// import React from 'react';

// const SentencePlay = props => (
//   <i
//     aria-hidden="true"
//     data-start={props.start}
//     data-end={props.end}
//     onClick={props.onClick}
//     className="sentence-play play icon"
//   />
// );

// export default SentencePlay;
