import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import Sentence from './Sentence';
import { Word, Keyword } from './Words';
import EditorMessage from './EditorMessage';
import handleExport from '../api/export';

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
      // differs from current = new transcription
      this.setState({ newTranscription: true });
    }
    if (
      newProps.isPlaying &&
      !newProps.isRecording &&
      this.state.keywordPlaying
    ) {
      // playing + keywords present -> look for matches
      this.keywordPlayingNow();
    }

    if (
      !newProps.isRecording &&
      Object.keys(this.state.sentencePlaying).length > 0
    ) {
      // not recording + sentences present -> look for matches.
      this.sentencePlayingNow();
    }
  }

  componentWillUpdate() {
    if (this.state.newTranscription) {
      // we have a new unlogged transcripton here
      this.updateTranscriptStates();
    }
  }

  updateTranscriptStates = () => {
    const addedKeywords = this.logKeywords();
    const addedSentences = this.logSentences();
    const newTranscripts = this.addAndSortTranscripts();

    this.setState({
      keywordPlaying: addedKeywords,
      sentencePlaying: addedSentences,
      transcripts: newTranscripts,
      newTranscription: false,
    });
  };

  addAndSortTranscripts = () =>
    [...this.state.transcripts, this.props.transcript].sort(
      (a, b) => a.start - b.start,
    );

  logKeywords = () => {
    const kTimes = { ...this.state.keywordPlaying };
    this.props.transcript.transcript.filter(el => el.time).forEach(el => {
      kTimes[el.time] = false;
    });
    return kTimes;
  };

  logSentences = () => {
    if (
      // double check we have a new transcript
      !this.state.sentencePlaying.hasOwnProperty(this.props.transcript.start)
    ) {
      const sTimes = Object.assign(this.state.sentencePlaying, {
        [this.props.transcript.start]: {
          playing: false,
          end: this.props.transcript.end,
        },
      });
      return sTimes;
    }
    return this.state.sentencePlaying;
  };

  keywordPlayingNow = () => {
    const newState = Object.assign({}, this.state.keywordPlaying);
    Object.keys(this.state.keywordPlaying).forEach(el => {
      if (
        // keyword's time is within (1 offset) sec from currentTime
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

  keywordNotPlayingNow = prop => {
    // turn focus off after 1 sec
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
      if (
        // currentTime + offset is within sentence time
        this.props.currentTime - this.props.offset > el &&
        this.props.currentTime - this.props.offset < newState[el].end
      ) {
        newState[el].playing = true;
        // outside sentence time
      } else if (
        this.props.currentTime - this.props.offset < el ||
        this.props.currentTime - this.props.offset > newState[el].end
      ) {
        newState[el].playing = false;
      }
      // only set state if it differs from current
      return this.state.sentencePlaying[el].playing !== newState[el].playing
        ? this.setState({ sentencePlaying: newState })
        : false;
    });
  };

  render() {
    const isRecording =
      this.props.isRecording && this.props.isPlaying ? (
        <span>
          <Loader size="tiny" active inline />
          {` `}
          <span>Listening...</span>
        </span>
      ) : (
        false
      );

    const exportBtn = () => {
      if (
        // exportBtn when transcript present & no rec + play
        this.state.transcripts.length > 0 &&
        (this.props.isPlaying && this.props.isRecording) === false
      ) {
        return (
          <button
            className="btn btn--sm btn--red mr-05"
            onClick={() =>
              handleExport(this.transcribeHTML.innerHTML, this.props.filename)
            }
          >
            <i className="large download icon" />
            Export markdown
          </button>
        );
      }
      return false;
    };

    return (
      <section
        id="transcribe-section"
        className="flex justify-center align-center pt-1 "
      >
        <div id="editor-area-left">
          {this.props.speechRecError && (
            <EditorMessage type="speechRec" error={this.props.speechRecError} />
          )}
        </div>
        <div
          id="transcribe-container"
          ref={html => {
            this.transcribeHTML = html;
          }}
        >
          {this.state.transcripts.map(sen => (
            <Sentence
              nowPlaying={this.state.sentencePlaying[sen.start].playing}
              handleSelectionPlay={this.props.handleSelectionPlay}
              // offset * 35 seems to equal delay between play press & starttime
              start={sen.start + this.props.offset * 0.35}
              end={sen.end + this.props.offset * 0.35}
              isRecording={this.props.isRecording}
              isPlaying={this.props.isPlaying}
              key={`sentence-${sen.start}`}
            >
              {sen.transcript.map(
                (word, i) =>
                  word.time ? (
                    <Keyword
                      nowPlaying={this.state.keywordPlaying[word.time]}
                      handleSelectionPlay={this.props.handleSelectionPlay}
                      start={word.time + this.props.offset}
                      end={sen.end}
                      isRecording={this.props.isRecording}
                      word={word.word}
                      last={i === sen.transcript.length - 1}
                      key={`keyword-${word.time}`}
                    />
                  ) : (
                    <Word
                      last={i === sen.transcript.length - 1}
                      word={word.word}
                      key={`word${i}`}
                    />
                  ),
              )}
            </Sentence>
          ))}
          {isRecording}
        </div>
        <div id="editor-area-right" className="flex justify-end align-end">
          <div>{exportBtn()}</div>
        </div>
      </section>
    );
  }
}

export default Transcribe;
