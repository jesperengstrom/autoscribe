import React, { Component } from 'react';
import Audiocontrol from './Audiocontrol';
import Transcribe from './Transcribe';
import '../css/main.css';
import './Main.css';

class Main extends Component {
  state = {};
  render() {
    return (
      <main id="main-container">
        <Audiocontrol {...this.props} />
        <Transcribe />
      </main>
    );
  }
}

export default Main;
