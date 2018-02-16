import React, { Component } from 'react';
import { Header, Modal } from 'semantic-ui-react';
import '../css/pushy-buttons.css';

class ModalAudioUrl extends Component {
  state = {
    modalOpen: false,
    url: '',
  };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });
  handleChange = e => this.setState({ url: e.target.value });
  handleSubmit = e => {
    e.preventDefault();
    const fileObj = { filename: this.state.url, path: this.state.url };
    this.props.onSelectFile(fileObj);
    this.handleClose();
  };

  render() {
    return (
      <Modal
        trigger={
          <button
            className="btn btn--sm btn--red mr-05 nowrap"
            onClick={this.handleOpen}
          >
            <i className="large cloud download icon" />
            Audio Url
          </button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size="small"
      >
        <Header
          icon="cloud download"
          content="Add URL to your audio (.wav, .mp3 etc.)"
        />
        <Modal.Content />
        <Modal.Actions>
          <form onSubmit={this.handleSubmit} className="ui form">
            <input
              type="url"
              value={this.state.url}
              onChange={this.handleChange}
            />

            <button
              type="submit"
              className="btn btn--sm btn--green mr-05 nowrap"
            >
              <i className="large check icon" />
              OK
            </button>
            <button
              className="btn btn--sm btn--red mr-05 nowrap"
              onClick={this.handleClose}
            >
              <i className="large cancel icon" />
              Cancel
            </button>
          </form>
        </Modal.Actions>
      </Modal>
    );
  }
}
export default ModalAudioUrl;
