import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Audiocontrol from './Components/Audiocontrol';
import Transcribe from './Components/Transcribe';

class App extends Component {
  state = {
    fileLoaded: false,
    filename: 'No audio file loaded',
  };
  render() {
    return (
      <main id="main">
        <Header
          fileLoaded={this.state.fileLoaded}
          filename={this.state.filename}
        />
        <Audiocontrol />
        <Transcribe />
        <Footer />
      </main>
    );
  }
}

export default App;
