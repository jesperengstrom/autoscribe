import React, { Component } from 'react';
import SentencePlay from './SentencePlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {
    keywordTimes: false,
  };

  componentWillReceiveProps(newProps) {
    // when new results come in -> log times
    if (
      !newProps.isPlaying &&
      !newProps.isRecording &&
      newProps.transcript.transcript
    ) {
      this.logKeywordTimes();
    }
    // playing audio with keywords present... search for current
    if (
      newProps.isPlaying &&
      !newProps.isRecording &&
      this.state.keywordTimes
    ) {
      this.wordPlayingNow();
    }
  }

  wordPlayingNow = () => {
    const newState = Object.assign({}, this.state.keywordTimes);
    Object.keys(this.state.keywordTimes).forEach(el => {
      // if one of keyword's time + offset is withing +1 sec from current audio time
      if (el > this.props.currentTime && el < this.props.currentTime + 1) {
        newState[el] = true;
        console.log('match!', newState);
        this.setState({ keywordTimes: newState });
      }
    });
  };

  logKeywordTimes = () => {
    const newTimes = {};
    this.props.transcript.transcript.filter(el => el.time).forEach(el => {
      newTimes[el.time] = false;
    });
    // if new number of keywords differ from present, set new state
    if (
      Object.keys(newTimes).length !==
      Object.keys(this.state.keywordTimes).length
    ) {
      this.setState({ keywordTimes: newTimes });
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
                className={`span-keyword ${
                  this.state.keywordTimes[el.time] ? 'active' : ''
                }`}
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
