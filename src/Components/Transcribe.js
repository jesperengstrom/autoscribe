import React, { Component } from 'react';
import SentencePlay from './SentencePlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {
    newTranscription: false,
    keywordTimes: false,
    sentenceTimes: {},
    transcriptionJSX: [],
    sentencePlayJSX: [],
  };

  componentWillReceiveProps(newProps) {
    if (newProps.transcript.start !== this.props.transcript.start) {
      // <-- differs from current = new transcription incoming
      this.setState({ newTranscription: true });
    }
    if (
      newProps.isPlaying &&
      !newProps.isRecording &&
      this.state.keywordTimes
    ) {
      // playing audio with keywords logged... match for current keyword
      this.wordPlayingNow();
    }

    if (
      !newProps.isRecording &&
      Object.keys(this.state.sentenceTimes).length > 0
    ) {
      // not recording with sentence logged... match current sentence.
      this.sentencePlayingNow();
    }
  }

  componentWillUpdate() {
    if (this.state.newTranscription) {
      // we have a new unlogged transcripton here
      this.logKeywordTimes();
      this.logSentenceTime();
    }
  }

  logKeywordTimes = () => {
    const kTimes = { ...this.state.keywordTimes };
    this.props.transcript.transcript.filter(el => el.time).forEach(el => {
      kTimes[el.time] = false;
    });
    // if new number of keywords differ from present, set new state
    // if (
    //   Object.keys(kTimes).length !== Object.keys(this.state.keywordTimes).length
    // ) {
    this.setState({ keywordTimes: kTimes });
    // }
  };

  logSentenceTime = () => {
    // if no state or no such time prop present, set state
    if (!this.state.sentenceTimes.hasOwnProperty(this.props.transcript.start)) {
      const sTimes = Object.assign(this.state.sentenceTimes, {
        [this.props.transcript.start]: {
          start: false,
          end: this.props.transcript.end,
        },
      });
      this.setState({
        sentenceTimes: sTimes,
        newTranscription: false,
        transcriptionJSX: [
          // <-- OBS!! dålig placering
          ...this.state.transcriptionJSX,
          this.renderTranscriptArr(),
        ],
        sentencePlayJSX: [
          // <-- OBS!!
          ...this.state.sentencePlayJSX,
          this.renderSentencePlay(),
        ],
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
    Object.keys(newState).forEach(el => {
      // if currentTime is within sentence time -> true
      if (
        this.props.currentTime - this.props.offset > el &&
        this.props.currentTime - this.props.offset < newState[el].end
      ) {
        newState[el].start = true;
        // outside -> false
      } else if (
        this.props.currentTime - this.props.offset < el ||
        this.props.currentTime - this.props.offset > newState[el].end
      ) {
        newState[el].start = false;
      }
      // set state if it differs from current
      return this.state.sentenceTimes[el].start !== newState[el].start
        ? this.setState({ sentenceTimes: newState })
        : false;
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
            this.state.sentenceTimes[trans.start] &&
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
          // offset * 35 seems to equal delay between play press & starttime
          start={this.props.transcript.start + this.props.offset * 0.35}
          end={this.props.transcript.end + this.props.offset * 0.35}
          onClick={this.props.handleWordClick}
        />
      );
    }
    return false;
  };

  render() {
    const isRecording =
      this.props.isRecording && this.props.isPlaying
        ? 'Listening, please wait...'
        : '';

    return (
      <section
        id="transcribe-section"
        className="flex justify-center align-center pt-1 "
      >
        <div id="transcribe-container">
          <aside className="flex justify-end">
            {this.state.sentencePlayJSX}
          </aside>
          <article id="transcribe-box">
            {this.state.transcriptionJSX}
            {isRecording}
          </article>
        </div>
      </section>
    );
  }
}

export default Transcribe;
