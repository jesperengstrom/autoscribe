import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Recordbutton extends Component {
  state = {};
  render() {
    return (
      <button
        disabled={this.props.audioLoadSuccess}
        className={`RecordButton 
        ${this.props.audioLoadSuccess ? '' : 'isEnabled'} 
        ${this.props.pendingRecording ? 'pending' : ''}
        ${this.props.isRecording ? 'recording' : ''}
        `}
        onClick={this.props.handleRecordChange}
      >
        <svg className="Icon RecordIcon" viewBox="0 0 100 100">
          <circle className="Icon-shape" cx="50" cy="50" r="40" />
        </svg>
      </button>
    );
  }
}

export default Recordbutton;

Recordbutton.propTypes = {
  audioLoadSuccess: PropTypes.bool.isRequired,

  isRecording: PropTypes.bool.isRequired,
  pendingRecording: PropTypes.bool.isRequired,
  handleRecordChange: PropTypes.func.isRequired,
};
