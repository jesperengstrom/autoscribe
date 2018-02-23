import React, { Component } from 'react';
import WordPlay from './WordPlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {};

  renderTranscriptArr = () => {
    if (this.props.transcriptArr.length > 0) {
      const span = this.props.transcriptArr.map((el, i) => {
        if (el.time) {
          const offsetTime = el.time + this.props.offset;
          return (
            <span key={offsetTime}>
              <span className="span-keyword" data-time={offsetTime}>
                <WordPlay
                  time={offsetTime}
                  onClick={this.props.handleWordClick}
                />
                {el.word}
              </span>
              {` `}
            </span>
          );
        }
        return (
          <span key={el.word + i} className="span-word">{`${el.word} `}</span>
        );
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
          <article
            id="transcribe-box"
            contentEditable
            suppressContentEditableWarning
          >
            {this.renderTranscriptArr()}
            {this.props.isRecording && this.props.isPlaying
              ? 'Listening, please wait...'
              : ''}
          </article>
        </div>
      </section>
    );
  }
}

export default Transcribe;
