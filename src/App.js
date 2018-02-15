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
      size: 0,
      type: false,
      path: '',
    },
  };

  componentDidMount() {
    const savedAudioFile = JSON.parse(localStorage.getItem('file'));
    if (savedAudioFile) {
      this.onLoadFile(savedAudioFile);
    }
  }

  onLoadFile = obj =>
    this.setState({
      audioFile: obj,
      audioLoadSuccess: false,
      audioError: false,
    });
  onLoadSuccess = () => {
    this.setState({ audioLoadSuccess: true });
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
        <Header {...this.state} onLoadFile={this.onLoadFile} />
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
