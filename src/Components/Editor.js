import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import Sentence from './Sentence';
import { Word, Keyword } from './Words';
import EditorMessage from './EditorMessage';
import handleExport from '../api/export';
import './Editor.css';

class Editor extends Component {
  state = {
    newTranscript: false,
    keywordPlaying: false,
    sentencePlaying: {},
    transcripts: [],
  };

  componentDidMount() {
    this.getFromLocalStorage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.latestTranscript.start !== this.props.latestTranscript.start) {
      // differs from current = new transcript
      this.setState({ newTranscript: true });
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
    if (this.state.newTranscript) {
      // we have a new unlogged transcripton here
      this.updateTranscriptStates();
    }
  }

  getFromLocalStorage = () => {
    if (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('savedEditor')
    ) {
      console.log('loaded saved transcript from localStorage!');
      const savedEditor = JSON.parse(localStorage.getItem('savedEditor'));
      this.setState({
        transcripts: savedEditor.transcripts,
        keywordPlaying: savedEditor.keywordPlaying,
        sentencePlaying: savedEditor.sentencePlaying,
      });
    } else console.log('No found transcript in localStorage');
  };

  saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'savedEditor',
        JSON.stringify({
          transcripts: this.state.transcripts,
          keywordPlaying: this.state.keywordPlaying,
          sentencePlaying: this.state.sentencePlaying,
        }),
      );
    }
  };

  updateTranscriptStates = () => {
    const addedKeywords = this.logKeywords();
    const addedSentences = this.logSentences();
    const newTranscripts = this.addAndSortTranscripts();

    this.setState(
      {
        keywordPlaying: addedKeywords,
        sentencePlaying: addedSentences,
        transcripts: newTranscripts,
        newTranscript: false,
      },
      () => {
        // call back to Audiocontrol with current bounds
        this.props.setTranscriptSpan({
          start: newTranscripts[0].start,
          end: newTranscripts[newTranscripts.length - 1].end,
        });
        this.saveToLocalStorage();
      },
    );
  };

  addAndSortTranscripts = () =>
    [...this.state.transcripts, this.props.latestTranscript].sort(
      (a, b) => a.start - b.start,
    );

  logKeywords = () => {
    const kTimes = { ...this.state.keywordPlaying };
    this.props.latestTranscript.transcript.filter(el => el.time).forEach(el => {
      kTimes[el.time] = false;
    });
    return kTimes;
  };

  logSentences = () => {
    if (
      // double check we have a new transcript
      !Object.prototype.hasOwnProperty.call(
        this.state.sentencePlaying,
        this.props.latestTranscript.start,
      )
    ) {
      const sTimes = Object.assign(this.state.sentencePlaying, {
        [this.props.latestTranscript.start]: {
          playing: false,
          end: this.props.latestTranscript.end,
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

  handleToggleTimestamp = (present, start) => {
    const newTranscripts = this.state.transcripts.map(el => {
      if (el.start === start) {
        if (present) return { ...el, timestamp: false };
        return { ...el, timestamp: true };
      }
      return el;
    });
    this.setState({ transcripts: newTranscripts }, this.saveToLocalStorage);
  };

  handleWordChange = (e, i) => {
    if (
      // double check id to make sure we have the right element
      // then only change state if word it's altered
      e.target.getAttribute('data-id') ===
        this.state.transcripts[i.sen].transcript[i.word].id &&
      e.target.textContent !==
        this.state.transcripts[i.sen].transcript[i.word].word
    ) {
      const newArr = [...this.state.transcripts];
      newArr[i.sen].transcript[i.word].word = e.target.textContent;
      this.setState({ transcripts: newArr }, this.saveToLocalStorage);
    } else {
      console.log('word data-id mismatch!');
    }
  };

  handleBackspace = e => {
    if (
      e.target.parentElement.firstElementChild === e.target &&
      e.key === 'Backspace' &&
      window.getSelection().anchorOffset === 0
    ) {
      // first word & keypress backspace & at word start
      console.log('yes!');
    }
    return false;
  };

  handleDeleteSentence = (index, start) => {
    if (this.state.transcripts[index].start === start) {
      // prevent deleting wrong index w same start time
      const newArr = [...this.state.transcripts];
      newArr.splice(index, 1);
      this.setState({ transcripts: newArr }, this.saveToLocalStorage);
    }
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
            <span className="vanish-btn-text">Export markdown</span>
          </button>
        );
      }
      return false;
    };

    return (
      <section
        id="editor-section"
        className="flex justify-center align-center pt-1 "
      >
        <div id="editor-area-left">
          {this.props.speechRecError && (
            <EditorMessage type="speechRec" error={this.props.speechRecError} />
          )}
        </div>
        <div
          id="editor-container"
          ref={html => {
            this.transcribeHTML = html;
          }}
        >
          {this.state.transcripts.map((sen, senIndex) => (
            <Sentence
              nowPlaying={this.state.sentencePlaying[sen.start].playing}
              handleSelectionPlay={this.props.handleSelectionPlay}
              handleToggleTimestamp={this.handleToggleTimestamp}
              start={sen.start}
              end={sen.end}
              timestamp={sen.timestamp}
              isRecording={this.props.isRecording}
              isPlaying={this.props.isPlaying}
              offset={this.props.offset}
              handleDeleteSentence={this.handleDeleteSentence}
              index={senIndex}
              key={`sentence-${sen.start}`}
            >
              {sen.transcript.map(
                (word, wordIndex) =>
                  word.time ? (
                    <Keyword
                      nowPlaying={this.state.keywordPlaying[word.time]}
                      handleSelectionPlay={this.props.handleSelectionPlay}
                      start={word.time}
                      end={sen.end}
                      isRecording={this.props.isRecording}
                      word={word.word}
                      last={wordIndex === sen.transcript.length - 1}
                      offset={this.props.offset}
                      index={{ word: wordIndex, sen: senIndex }}
                      wordId={word.id}
                      handleWordChange={this.handleWordChange}
                      key={`keyword-${word.time}`}
                    />
                  ) : (
                    <Word
                      last={wordIndex === sen.transcript.length - 1}
                      word={word.word}
                      index={{ word: wordIndex, sen: senIndex }}
                      wordId={word.id}
                      handleWordChange={this.handleWordChange}
                      handleBackspace={this.handleBackspace}
                      key={`word${wordIndex}`}
                    />
                  ),
              )}
            </Sentence>
          ))}
          {isRecording}
        </div>
        <div id="editor-area-right" className="flex justify-end align-end">
          <div id="export-btn">{exportBtn()}</div>
        </div>
      </section>
    );
  }
}

export default Editor;

Editor.propTypes = {
  offset: PropTypes.number.isRequired,
  latestTranscript: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    transcript: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setTranscriptSpan: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  isRecording: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  speechRecError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
  handleSelectionPlay: PropTypes.func.isRequired,
};
