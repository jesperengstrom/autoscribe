import React, { Component } from 'react';
import './Transcribe.css';

class Transcribe extends Component {
  state = {};
  render() {
    return (
      <section
        id="transcribe-section"
        className="flex justify-center align-center pt-1 "
      >
        <div id="transcribe-container">
          <article id="transcribe-box">{`${this.props.transcript}`}</article>
        </div>
      </section>
    );
  }
}

export default Transcribe;
