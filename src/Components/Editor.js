import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import Sentence from './Sentence';
import Word from './Word';
import EditorMessage from './EditorMessage';
import handleExport from '../api/export';
import './Editor.css';

class Editor extends Component {
  state = {
    newTranscript: false,
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
      this.setState(
        { transcript: savedEditor.transcript },
        this.updateTranscriptSpan,
      );
    } else console.log('No found transcript in localStorage');
  };

  saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'savedEditor',
        JSON.stringify({ transcript: this.state.transcript }),
      );
    }
  };

  updateTranscriptStates = () => {
    const newState = this.addAndSortTranscript();
    this.setState({ transcript: newState, newTranscript: false }, () => {
      this.updateTranscriptSpan();
      this.saveToLocalStorage();
    });
  };

  addAndSortTranscript = () =>
    [...this.state.transcript, this.props.latestTranscript].sort(
      (a, b) => a.senStart - b.senStart,
    );

  updateTranscriptSpan() {
    const updatedValue =
      this.state.transcript.length > 0
        ? {
            start: this.state.transcript[0].senStart,
            end: this.state.transcript[this.state.transcript.length - 1].senEnd,
          }
        : {
            start: 0,
            end: 0,
          };
    this.props.setTranscriptSpan(updatedValue);
  }

  keywordPlayingNow = senIndex => {
    const newState = [...this.state.transcript];
    newState[senIndex].words.forEach((word, wordIndex) => {
      if (word.wordStart) {
        if (
          // keyword's time is within (1 offset) sec from currentTime
          word.wordStart > this.props.currentTime - this.props.offset &&
          word.wordStart < this.props.currentTime - this.props.offset * 2
        ) {
          console.log(
            `time:${this.props.currentTime} playing: ${
              newState[senIndex].words[wordIndex].word
            }`,
          );

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
        // check keywords within active sentence, only of not playing
        if (this.props.isPlaying) {
          this.keywordPlayingNow(senIndex);
        }

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
      const newState = [...this.state.transcript];
      newState[i.sen].words[i.word].word = e.target.textContent;
      this.setState({ transcript: newState }, this.saveToLocalStorage);
    }
  };

  // ctrl + backspace merges sentences
  handleKeyDown = (e, index) => {
    if (
      e.target.getAttribute('data-first') &&
      e.key === 'Backspace' &&
      window.getSelection().anchorOffset === 0 &&
      e.ctrlKey &&
      index.sen !== 0 // sentence before to append to
    ) {
      return this.mergeSentences(index);
    }
    if (
      e.target.getAttribute('data-first') === 'false' && // can't leave an empty sentencec
      e.key === 'Enter' &&
      e.ctrlKey &&
      window.getSelection().anchorOffset === 0
    ) {
      return e.target.classList.contains('span-keyword')
        ? // split sentence using keyword timestamp or shared
          this.splitSentences(true, index)
        : this.splitSentences(false, index);
    }
    return false;
  };

  splitSentences = (isKeyword, index) => {
    const sourceSen = { ...this.state.transcript[index.sen] };
    const newSen = { ...this.state.transcript[index.sen] };
    sourceSen.words = this.state.transcript[index.sen].words.slice(
      0,
      index.word,
    );
    newSen.words = this.state.transcript[index.sen].words.slice(index.word);
    if (isKeyword) {
      // keyword time -> source end & new sen start
      sourceSen.senEnd = this.state.transcript[index.sen].words[
        index.word
      ].wordStart;
      newSen.senStart = this.state.transcript[index.sen].words[
        index.word
      ].wordStart;
      newSen.isSplit = false;
    } else newSen.isSplit = true;

    newSen.senStart += 0.01; // add 10 ms for sorting purposes

    this.state.transcript.splice(index.sen, 1); // alter state directly, bad!
    this.setState(
      {
        transcript: [...this.state.transcript, sourceSen, newSen].sort(
          (a, b) => a.senStart - b.senStart,
        ),
      },
      this.saveToLocalStorage,
    );
  };

  mergeSentences = index => {
    const newState = [...this.state.transcript];
    const newArr = newState[index.sen - 1];
    const oldArr = newState[index.sen];
    newArr.words = [...newArr.words, ...oldArr.words];
    newArr.senEnd = oldArr.senEnd;
    newState.splice(index.sen, 1);
    this.setState({ transcript: newState }, this.saveToLocalStorage);
  };

  handleDeleteSentence = (index, start) => {
    if (this.state.transcript[index].senStart === start) {
      // prevent deleting wrong index w same start time
      const newState = [...this.state.transcript];
      newState.splice(index, 1);
      this.setState({ transcript: newState }, () => {
        this.updateTranscriptSpan();
        this.saveToLocalStorage();
      });
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
              isSplit={sen.isSplit ? sen.isSplit : false}
              audioLoadSuccess={this.props.audioLoadSuccess}
              isRecording={this.props.isRecording}
              isPlaying={this.props.isPlaying}
              offset={this.props.offset}
              handleDeleteSentence={this.handleDeleteSentence}
              index={senIndex}
              key={`${sen.senId}-${senIndex}`}
            >
              {sen.words.map((word, wordIndex) => (
                <Word
                  wordPlaying={word.wordPlaying}
                  handleSelectionPlay={this.props.handleSelectionPlay}
                  wordStart={word.wordStart}
                  senEnd={sen.senEnd}
                  audioLoadSuccess={this.props.audioLoadSuccess}
                  isRecording={this.props.isRecording}
                  word={word.word}
                  last={wordIndex === sen.words.length - 1}
                  offset={this.props.offset}
                  index={{ word: wordIndex, sen: senIndex }}
                  wordId={word.wordId}
                  handleWordChange={this.handleWordChange}
                  handleKeyDown={this.handleKeyDown}
                  key={`${word.wordId}-${wordIndex}`}
                />
              ))}
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
    senId: PropTypes.string,
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
