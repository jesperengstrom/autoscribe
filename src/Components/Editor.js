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
    // keywordPlaying: false,
    // sentencePlaying: {},
    transcript: [],
  };

  componentDidMount() {
    this.getFromLocalStorage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.latestTranscript.senId !== this.props.latestTranscript.senId) {
      // differs from current = new transcript
      this.setState({ newTranscript: true });
    }
    // if (
    //   newProps.isPlaying &&
    //   !newProps.isRecording &&
    //   this.state.keywordPlaying
    // ) {
    //   // playing + keywords present -> look for matches
    //   this.keywordPlayingNow();
    // }

    if (!newProps.isRecording && this.state.transcript.length > 0) {
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
        transcript: savedEditor.transcript,
        // keywordPlaying: savedEditor.keywordPlaying,
        // sentencePlaying: savedEditor.sentencePlaying,
      });
    } else console.log('No found transcript in localStorage');
  };

  saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'savedEditor',
        JSON.stringify({
          transcript: this.state.transcript,
          // keywordPlaying: this.state.keywordPlaying,
          // sentencePlaying: this.state.sentencePlaying,
        }),
      );
    }
  };

  updateTranscriptStates = () => {
    // const addedKeywords = this.logKeywords();
    // const addedSentences = this.logSentences();
    const newTranscript = this.addAndSortTranscript();

    this.setState(
      {
        // keywordPlaying: addedKeywords,
        // sentencePlaying: addedSentences,
        transcript: newTranscript,
        newTranscript: false,
      },
      () => {
        // call back to Audiocontrol with current bounds
        this.props.setTranscriptSpan({
          start: newTranscript[0].senStart,
          end: newTranscript[newTranscript.length - 1].senEnd,
        });
        this.saveToLocalStorage();
      },
    );
  };

  addAndSortTranscript = () =>
    [...this.state.transcript, this.props.latestTranscript].sort(
      (a, b) => a.senStart - b.senStart,
    );

  // logKeywords = () => {
  //   const kTimes = { ...this.state.keywordPlaying };
  //   this.props.latestTranscript.transcript.filter(el => el.time).forEach(el => {
  //     kTimes[el.time] = false;
  //   });
  //   return kTimes;
  // };

  // logSentences = () => {
  //   if (
  //     // double check we have a new transcript
  //     !Object.prototype.hasOwnProperty.call(
  //       this.state.sentencePlaying,
  //       this.props.latestTranscript.start,
  //     )
  //   ) {
  //     const sTimes = Object.assign(this.state.sentencePlaying, {
  //       [this.props.latestTranscript.start]: {
  //         playing: false,
  //         end: this.props.latestTranscript.end,
  //       },
  //     });
  //     return sTimes;
  //   }
  //   return this.state.sentencePlaying;
  // };

  keywordPlayingNow = senIndex => {
    const newState = [...this.state.transcript];
    newState[senIndex].words.forEach((word, wordIndex) => {
      if (word.wordStart) {
        if (
          // keyword's time is within (1 offset) sec from currentTime
          word.wordStart > this.props.currentTime - this.props.offset &&
          word.wordStart < this.props.currentTime - this.props.offset * 2
        ) {
          newState[senIndex].words[wordIndex].wordPlaying = true;
          this.setState({ transcript: newState }, () => {
            // de-highligt keyword 1 sec later
            setTimeout(() => {
              newState[senIndex].words[wordIndex].wordPlaying = false;
              this.setState({ transcript: newState });
            }, 1000);
          });
        }
      }
    });
  };

  sentencePlayingNow = () => {
    const newState = [...this.state.transcript];
    newState.forEach((sen, senIndex) => {
      if (
        this.props.currentTime - this.props.offset > sen.senStart &&
        this.props.currentTime - this.props.offset < sen.senEnd
      ) {
        // currentTime + offset is within sentence time
        // check keywords within active sentence
        this.keywordPlayingNow(senIndex);
        newState[senIndex].senPlaying = true;
      } else if (
        this.props.currentTime - this.props.offset < sen.senStart ||
        this.props.currentTime - this.props.offset > sen.senEnd
      ) {
        // outside sentence time
        newState[senIndex].senPlaying = false;
      }
      // only set state if it differs from current
      return this.state.transcript[senIndex].senPlaying !==
        newState[senIndex].senPlaying
        ? this.setState({ transcript: newState })
        : false;
    });
  };

  handleToggleTimestamp = (present, start) => {
    const newTranscript = this.state.transcript.map(el => {
      if (el.senStart === start) {
        if (present) return { ...el, hasTimestamp: false };
        return { ...el, hasTimestamp: true };
      }
      return el;
    });
    this.setState({ transcript: newTranscript }, this.saveToLocalStorage);
  };

  handleWordChange = (e, i) => {
    if (
      // double check id to make sure we have the right element
      // then only change state if word it's altered
      e.target.getAttribute('data-id') ===
        this.state.transcript[i.sen].words[i.word].wordId &&
      e.target.textContent !== this.state.transcript[i.sen].words[i.word].word
    ) {
      const newArr = [...this.state.transcript];
      newArr[i.sen].words[i.word].word = e.target.textContent;
      this.setState({ transcript: newArr }, this.saveToLocalStorage);
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
    if (this.state.transcript[index].senStart === start) {
      // prevent deleting wrong index w same start time
      const newArr = [...this.state.transcript];
      newArr.splice(index, 1);
      this.setState({ transcript: newArr }, this.saveToLocalStorage);
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
        this.state.transcript.length > 0 &&
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
          {this.state.transcript.map((sen, senIndex) => (
            <Sentence
              nowPlaying={sen.senPlaying}
              handleSelectionPlay={this.props.handleSelectionPlay}
              handleToggleTimestamp={this.handleToggleTimestamp}
              start={sen.senStart}
              end={sen.senEnd}
              hasTimestamp={sen.hasTimestamp}
              isRecording={this.props.isRecording}
              isPlaying={this.props.isPlaying}
              offset={this.props.offset}
              handleDeleteSentence={this.handleDeleteSentence}
              index={senIndex}
              key={`sentence-${sen.senStart}`}
            >
              {sen.words.map(
                (word, wordIndex) =>
                  word.wordStart ? (
                    <Keyword
                      nowPlaying={word.wordPlaying}
                      handleSelectionPlay={this.props.handleSelectionPlay}
                      start={word.wordStart}
                      end={sen.senEnd}
                      isRecording={this.props.isRecording}
                      word={word.word}
                      last={wordIndex === sen.words.length - 1}
                      offset={this.props.offset}
                      index={{ word: wordIndex, sen: senIndex }}
                      wordId={word.wordId}
                      handleWordChange={this.handleWordChange}
                      key={`keyword-${word.wordStart}`}
                    />
                  ) : (
                    <Word
                      last={wordIndex === sen.words.length - 1}
                      word={word.word}
                      index={{ word: wordIndex, sen: senIndex }}
                      wordId={word.wordId}
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
    senId: PropTypes.string.isRequired,
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
