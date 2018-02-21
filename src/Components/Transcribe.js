import React from 'react';
import './Transcribe.css';

const Transcribe = () => (
  <section
    id="transcribe-section"
    className="flex justify-center align-center pt-1 "
  >
    <div id="transcribe-container">
      <article id="transcribe-box" contentEditable />
    </div>
  </section>
);

export default Transcribe;
