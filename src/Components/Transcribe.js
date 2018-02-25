import React, { Component } from 'react';
import SentencePlay from './SentencePlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {
    keyWordTimes: {},
  };

  componentWillReceiveProps(newProps) {
    if (
      this.props.transcript.transcript &&
      newProps.transcript !== this.props.transcript
    )
      this.logKeywordTimes();
  }

  logKeywordTimes = () => {
    console.log('logkeywordtimes called');
    const keyWordTimes = {};
    if (this.props.transcript.transcript) {
      this.props.transcript.transcript.filter(el => el.time).forEach(el => {
        keyWordTimes[el.time] = false;
      });
      console.log('keyword times:', keyWordTimes);
      this.setState(keyWordTimes);
    }
  };

  renderTranscriptArr = () => {
    const trans = this.props.transcript;
    if (trans.transcript) {
      const span = trans.transcript.map((el, i) => {
        const dot = i === trans.transcript.length - 1 ? '.' : '';
        if (el.time) {
          return (
            <span key={el.time}>
              <span
                className="span-keyword"
                data-start={el.time + this.props.offset}
                data-end={trans.end + this.props.offset}
                onClick={this.props.handleWordClick}
                role="button"
                onKeyPress={() => {}}
                tabIndex={0}
                contentEditable
                suppressContentEditableWarning
              >
                {el.word + dot}
              </span>
              {` `}
            </span>
          );
        }
        return (
          <span key={el.word + i}>
            <span
              className="span-word"
              contentEditable
              suppressContentEditableWarning
            >
              {el.word + dot}
            </span>
            {` `}
          </span>
        );
      });
      return <p>{span}</p>;
    }
    return false;
  };

  renderSentencePlay = () => {
    if (this.props.transcript.transcript) {
      return (
        <SentencePlay
          start={this.props.transcript.start + this.props.offset}
          end={this.props.transcript.end + this.props.offset}
          onClick={this.props.handleWordClick}
        />
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
          <aside className="flex justify-end">
            {this.renderSentencePlay()}
          </aside>
          <article id="transcribe-box">
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
