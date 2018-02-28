import React, { Component } from 'react';
import Sentence from './Sentence';
import { Word, Keyword } from './Words';
import SentencePlay from './SentencePlay';
import './Transcribe.css';

class Transcribe extends Component {
  state = {
    newTranscription: false,
    keywordPlaying: false,
    sentencePlaying: {},
    transcripts: [],
  };

  componentWillReceiveProps(newProps) {
    if (newProps.transcript.start !== this.props.transcript.start) {
      // <-- differs from current = new transcription incoming
      this.setState({ newTranscription: true });
    }
    if (
      newProps.isPlaying &&
      !newProps.isRecording &&
      this.state.keywordPlaying
    ) {
      // playing audio with keywords logged... match for current keyword
      this.keywordPlayingNow();
    }

    if (
      !newProps.isRecording &&
      Object.keys(this.state.sentencePlaying).length > 0
    ) {
      // not recording with sentence logged... match current sentence.
      this.sentencePlayingNow();
    }
  }

  componentWillUpdate() {
    if (this.state.newTranscription) {
      // we have a new unlogged transcripton here
      this.logKeywords();
      this.logSentences();
    }
  }

  logKeywords = () => {
    const kTimes = { ...this.state.keywordPlaying };
    this.props.transcript.transcript.filter(el => el.time).forEach(el => {
      kTimes[el.time] = false;
    });
    this.setState({ keywordPlaying: kTimes });
  };

  logSentences = () => {
    // if no state or no such time prop present, set state
    if (
      !this.state.sentencePlaying.hasOwnProperty(this.props.transcript.start)
    ) {
      const sTimes = Object.assign(this.state.sentencePlaying, {
        [this.props.transcript.start]: {
          playing: false,
          end: this.props.transcript.end,
        },
      });
      this.setState({
        sentencePlaying: sTimes,
        newTranscription: false,
        transcripts: [...this.state.transcripts, this.props.transcript],
      });
    }
  };

  keywordPlayingNow = () => {
    const newState = Object.assign({}, this.state.keywordPlaying);
    Object.keys(this.state.keywordPlaying).forEach(el => {
      // if a keyword's time is within (1 offset) sec from current audio time -> set state
      if (
        el > this.props.currentTime - this.props.offset &&
        el < this.props.currentTime - this.props.offset * 2
      ) {
        newState[el] = true;
        this.setState({ keywordPlaying: newState }, () =>
          this.keywordNotPlayingNow(el),
        );
      }
    });
  };

  /**
   * turn focus off after 1 sec
   */
  keywordNotPlayingNow = prop => {
    setTimeout(() => {
      const newState = Object.assign(this.state.keywordPlaying, {
        [prop]: false,
      });
      this.setState({ keywordPlaying: newState });
    }, 1000);
  };

  sentencePlayingNow = () => {
    const newState = Object.assign({}, this.state.sentencePlaying);
    Object.keys(newState).forEach(el => {
      // if currentTime is within sentence time -> true
      if (
        this.props.currentTime - this.props.offset > el &&
        this.props.currentTime - this.props.offset < newState[el].end
      ) {
        newState[el].playing = true;
        // outside -> false
      } else if (
        this.props.currentTime - this.props.offset < el ||
        this.props.currentTime - this.props.offset > newState[el].end
      ) {
        newState[el].playing = false;
      }
      // set state if it differs from current
      return this.state.sentencePlaying[el].playing !== newState[el].playing
        ? this.setState({ sentencePlaying: newState })
        : false;
    });
  };

  renderSentencePlay = () => {
    if (this.props.transcript.transcript) {
      return (
        <SentencePlay
          // offset * 35 seems to equal delay between play press & starttime
          start={this.props.transcript.start + this.props.offset * 0.35}
          end={this.props.transcript.end + this.props.offset * 0.35}
          handleKeywordClick={this.props.handleKeywordClick}
        />
      );
    }
    return false;
  };

  render() {
    const isRecording =
      this.props.isRecording && this.props.isPlaying ? (
        <p>Listening, please wait...</p>
      ) : (
        ''
      );

    return (
      <section
        id="transcribe-section"
        className="flex justify-center align-center pt-1 "
      >
        <div id="transcribe-container">
          {this.state.transcripts.map(sen => (
            <Sentence playing={this.state.sentencePlaying[sen.start].playing}>
              {sen.transcript.map(
                word =>
                  word.time ? (
                    <Keyword
                      start={word.time + this.props.offset}
                      end={sen.end}
                      playing={this.state.keywordPlaying[word.time]}
                      handleKeywordClick={this.props.handleKeywordClick}
                      word={word.word}
                    />
                  ) : (
                    <Word word={word.word} />
                  ),
              )}
            </Sentence>
          ))}
          {isRecording}
        </div>
      </section>
    );
  }
}

export default Transcribe;
