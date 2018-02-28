import React from 'react';
import './Sentence.css';

const Sentence = props => {
  const sentencePlaying = props.playing ? 'sentence-playing' : '';
  return (
    <p className={`p-sentence ${sentencePlaying}`}>
      {props.children}
      <span>.</span>
    </p>
  );
};

export default Sentence;

{
  /* <aside className="flex justify-end">
{this.state.transcripts.forEach(el => this.renderSentencePlay(el))}
</aside>
<article id="transcribe-box">
{this.renderTranscriptArr()}

</article> */
}
