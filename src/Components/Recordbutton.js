import React, { Component } from 'react';

class Recordbutton extends Component {
  state = {};
  handleClick = () => {};
  render() {
    return (
      <button
        disabled={this.props.audioLoadSuccess}
        className={`RecordButton 
        ${this.props.audioLoadSuccess ? '' : 'isEnabled'} 
        ${this.props.pendingRecording ? 'pending' : ''}
        ${this.props.isRecording ? 'recording' : ''}
        `}
        onClick={this.props.onRecordChange}
      >
        <svg className="Icon RecordIcon" viewBox="0 0 100 100">
          <circle className="Icon-shape" cx="50" cy="50" r="40" />
        </svg>
      </button>
    );
  }
}

export default Recordbutton;
