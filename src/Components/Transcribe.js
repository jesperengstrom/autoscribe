import React, { Component } from 'react';
import './Transcribe.css';

class Transcribe extends Component {
  state = {};

  renderTranscriptArr = () => {
    if (this.props.transcriptArr.length > 0) {
      const span = this.props.transcriptArr.map((el, i) => {
        if (el.time) {
          return (
            <span key={`key${i}`} className="keyword" data-time={el.time}>
              {`${el.word} `}
            </span>
          );
        }
        return <span key={`key${i}`}>{`${el.word} `}</span>;
      });
      return <p>{span}.</p>;
    }
    return false;
  };

  render() {
    return (
      <section
        id="transcribe-section"
        className="flex justify-center align-center pt-1 "
      >
        <div id="transcribe-container">
          <article id="transcribe-box" contentEditable>
            {this.props.isRecording && this.props.isPlaying
              ? 'Listening, please wait...'
              : ''}
            {this.renderTranscriptArr()}
          </article>
        </div>
      </section>
    );
  }
}

export default Transcribe;
