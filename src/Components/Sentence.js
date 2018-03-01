import React from 'react';
import { Popup, Button } from 'semantic-ui-react';
import './Sentence.css';

const PopupContent = props => (
  <div>
    <Button
      onClick={props.handleKeywordClick}
      circular
      icon="play"
      className="sentence-play-btn"
      data-start={props.start}
      data-end={props.end}
    />
  </div>
);

const Sentence = props => {
  // <-- call sentence, return popup containting PopupContent
  const sentencePlaying = props.playing ? 'sentence-playing' : '';
  const sentence = (
    <p className={`p-sentence ${sentencePlaying}`}>{props.children}</p>
  );
  return (
    <Popup
      trigger={sentence}
      position="left center"
      on="hover"
      horizontalOffset={5}
      hoverable
    >
      <Popup.Content>{PopupContent(props)}</Popup.Content>
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
