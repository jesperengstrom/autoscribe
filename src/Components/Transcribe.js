import React, { Component } from 'react';
import SentencePlay from './SentencePlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {};

  renderTranscriptArr = () => {
    const trans = this.props.transcript;
    if (trans.transcript) {
      const span = trans.transcript.map((el, i) => {
        const dot = i === trans.transcript.length - 1 ? '.' : '';
        if (el.time) {
          const offsetTime = el.time + this.props.offset;
          return (
            <span key={offsetTime}>
              <span
                className="span-keyword"
                data-start={offsetTime}
                onClick={this.props.handleWordClick}
                role="button"
                onKeyPress={this.props.handleWordClick}
                tabIndex={0}
              >
                {el.word + dot}
              </span>
              {` `}
            </span>
          );
        }
        return (
          <span key={el.word + i} className="span-word">
            {`${el.word + dot} `}
          </span>
        );
      });
      return (
        <p>
          <SentencePlay
            start={trans.start + this.props.offset}
            end={trans.end + this.props.offset}
            onClick={this.props.handleWordClick}
          />
          {span}
        </p>
      );
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
