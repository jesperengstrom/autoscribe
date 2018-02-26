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
    settings: { continuous: false, offset: -1.5 },
  };

  componentDidMount() {
    if (typeof localStorage !== 'undefined') {
      const savedAudioFile = JSON.parse(localStorage.getItem('file'));
      const savedSettings = JSON.parse(localStorage.getItem('settings'));
      if (savedSettings) this.handleSubmitSettings(savedSettings);
      if (savedAudioFile) this.handleSelectFile(savedAudioFile);
    }
  }

  onLoadSuccess = e => {
    const audioObj = { ...this.state.audioFile };
    audioObj.duration = e.target.duration;
    this.setState({ audioLoadSuccess: true, audioFile: audioObj });

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('file', JSON.stringify(this.state.audioFile));
    }
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

  handleSubmitSettings = settings => {
    this.setState({ settings });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
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
