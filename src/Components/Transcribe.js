import React, { Component } from 'react';
import SentencePlay from './SentencePlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {
    keywordTimes: false,
    sentenceTimes: false,
  };

  componentWillReceiveProps(newProps) {
    // when new results come in -> save keyword times in state
    if (
      !newProps.isPlaying &&
      !newProps.isRecording &&
      newProps.transcript.transcript
    ) {
      this.logKeywordTimes();
      this.logSentenceTime();
    }
    // playing audio with keywords present... match for current keyword
    if (
      newProps.isPlaying &&
      !newProps.isRecording &&
      this.state.keywordTimes
    ) {
      this.wordPlayingNow();
    }
    // playing audio with transcription present... match current sentence.
    if (!newProps.isRecording && newProps.transcript.start) {
      this.sentencePlayingNow();
    }
  }

  logKeywordTimes = () => {
    const times = {};
    this.props.transcript.transcript.filter(el => el.time).forEach(el => {
      times[el.time] = false;
    });
    // if new number of keywords differ from present, set new state
    if (
      Object.keys(times).length !== Object.keys(this.state.keywordTimes).length
    ) {
      this.setState({ keywordTimes: times });
    }
  };

  logSentenceTime = () => {
    console.log('logsentencetime running');
    const times = {
      start: false,
      end: this.props.transcript.end,
    };
    // if no such time prop present, set state
    if (
      this.state.sentenceTimes &&
      !this.state.sentenceTimes.hasOwnProperty(this.props.transcript.start)
    ) {
      this.setState({
        sentenceTimes: Object.assign(
          this.state.sentenceTimes,
          {
            [this.props.transcript.start]: times,
          },
          () => console.log('set state', this.state.sentenceTimes),
        ),
      });
    }
  };

  /**
   * loop through keyword times
   */
  wordPlayingNow = () => {
    const newState = Object.assign({}, this.state.keywordTimes);
    Object.keys(this.state.keywordTimes).forEach(el => {
      // if a keyword's time is within (1 offset) sec from current audio time -> set state
      if (
        el > this.props.currentTime - this.props.offset &&
        el < this.props.currentTime - this.props.offset * 2
      ) {
        newState[el] = true;
        this.setState({ keywordTimes: newState }, () =>
          this.wordNotPlayingNow(el),
        );
      }
    });
  };

  /**
   * turn focus off
   */
  wordNotPlayingNow = prop => {
    setTimeout(() => {
      const newState = Object.assign(this.state.keywordTimes, {
        [prop]: false,
      });
      this.setState({ keywordTimes: newState });
    }, 1000);
  };

  sentencePlayingNow = () => {
    const newState = Object.assign({}, this.state.sentenceTimes);
    Object.keys(this.state.sentenceTimes).forEach(el => {
      // if a keyword's time is within (1 offset) sec from current audio time -> set state
      if (this.props.currentTime > el && this.props.currentTime < el.end) {
        newState[el].start = true;
      } else newState[el].start = false;
      this.setState({ keywordTimes: newState });
    });
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
                  this.state.keywordTimes[el.time] ? 'keyword-active' : ''
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
      return (
        <p
          className={`p-sentence ${
            this.state.sentenceTimes &&
            this.state.sentenceTimes[trans.start].start
              ? 'sentence-active'
              : ''
          }`}
        >
          {span}
        </p>
      );
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
