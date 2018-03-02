import React from 'react';
import { Message } from 'semantic-ui-react';

const EditorMessage = props =>
  props.type === 'speechRec' && (
    <Message negative>
      <Message.Header>Speech recognition error</Message.Header>
      <p>{`Error: ${props.error}. See docs for help.`}</p>
    </Message>
  );

export default EditorMessage;
