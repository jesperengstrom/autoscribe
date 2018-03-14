import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import './EditorMessage.css';

const EditorMessage = props => {
  if (props.type === 'speechRec') {
    return (
      <Message negative className="editor-message">
        <Message.Header>Speech recognition error</Message.Header>
        <p>{`Error: ${props.message}. See docs for help.`}</p>
      </Message>
    );
  }

  if (props.type === 'audioMismatch') {
    return (
      <Message warning className="editor-message">
        <Message.Header>Audio mismatch</Message.Header>
        <p>
          <span>
            {`Loaded filename doesn't match the one originally used: ${
              props.message
            }`}
          </span>
          <br />
          <span>Continue at own risk!</span>
        </p>
      </Message>
    );
  }
  return false;
};

export default EditorMessage;

EditorMessage.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
