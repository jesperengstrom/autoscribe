import React, { Component } from 'react';
import { Header, Icon, Modal } from 'semantic-ui-react';
import '../css/pushy-buttons.css';

class ModalAudioUrl extends Component {
  state = {
    modalOpen: true,
  };

  closeModal = () => this.setState({ modalOpen: false });
  render() {
    return (
      <Modal
        trigger={
          <button className="btn btn--sm btn--red mr-05 nowrap">
            <i className="large cloud download icon" />
            Audio Url
          </button>
        }
        basic
        size="small"
      >
        <Header
          icon="large cloud download"
          content="Add URL to your audio (.wav, .mp3 etc.)"
        />
        <Modal.Content>
          <form className="ui form">
            <input />
          </form>
        </Modal.Content>
        <Modal.Actions>
          <button className="btn btn--sm btn--green mr-05 nowrap">
            <i className="large check icon" />
            OK
          </button>
          <button
            className="btn btn--sm btn--red mr-05 nowrap"
            onClick={this.closeModal}
          >
            <i className="large cancel icon" />
            Cancel
          </button>
        </Modal.Actions>
      </Modal>
    );
  }
}
export default ModalAudioUrl;
