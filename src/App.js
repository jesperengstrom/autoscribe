import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import Main from './Components/Main';

class App extends Component {
  state = {
    audioLoadSuccess: false,
    audioError: false,
    audioFile: {
      filename: 'No audiofile loaded',
      duration: 0,
      path: '',
    },
    continuous: false,
    offset: -1.5,
  };

  componentDidMount() {
    const savedAudioFile = JSON.parse(localStorage.getItem('file'));
    if (savedAudioFile) {
      this.handleSelectFile(savedAudioFile);
    }
  }

  onLoadSuccess = e => {
    const audioObj = { ...this.state.audioFile };
    audioObj.duration = e.target.duration;
    this.setState({ audioLoadSuccess: true, audioFile: audioObj });
    localStorage.setItem('file', JSON.stringify(this.state.audioFile));
  };

  onLoadError = error => {
    this.setState({
      audioError: error,
      audioLoadSuccess: false,
    });
  };

  handleSelectFile = obj => {
    this.setState({
      audioFile: obj,
      audioLoadSuccess: false,
      audioError: false,
    });
  };

  handleSubmitSettings = modalState => {
    const { continuous, offset } = modalState;
    this.setState({ continuous, offset });
  };

  render() {
    return (
      <div id="app-container">
        <Header
          {...this.state}
          handleSelectFile={this.handleSelectFile}
          handleSubmitSettings={this.handleSubmitSettings}
        />
        <Main
          {...this.state}
          onLoadSuccess={this.onLoadSuccess}
          onLoadError={this.onLoadError}
        />
      </div>
    );
  }
}

export default App;
