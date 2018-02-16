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
  };

  componentDidMount() {
    const savedAudioFile = JSON.parse(localStorage.getItem('file'));
    if (savedAudioFile) {
      this.onSelectFile(savedAudioFile);
    }
  }

  onSelectFile = obj =>
    this.setState({
      audioFile: obj,
      audioLoadSuccess: false,
      audioError: false,
    });

  onLoadSuccess = e => {
    const audioObj = { ...this.state.audioFile };
    audioObj.durtion = e.target.duration;
    this.setState({ audioLoadSuccess: true, audioFile: audioObj });
    localStorage.setItem('file', JSON.stringify(this.state.audioFile));
  };

  onLoadError = error => {
    this.setState({
      audioError: error,
      audioLoadSuccess: false,
    });
  };

  render() {
    return (
      <div id="app-container">
        <Header {...this.state} onSelectFile={this.onSelectFile} />
        <Main
          audio={this.state.audioFile}
          onLoadSuccess={this.onLoadSuccess}
          onLoadError={this.onLoadError}
        />
      </div>
    );
  }
}

export default App;
