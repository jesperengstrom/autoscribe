import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Modal, Checkbox, Form } from 'semantic-ui-react';
import '../css/pushy-buttons.css';

class ModalSettings extends Component {
  state = {
    settings: { offset: 0, continuous: false },
    modalOpen: false,
  };

  componentWillReceiveProps(newProps) {
    this.setState({ settings: newProps.settings });
  }

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });
  handleCheck = (e, { name, checked }) => {
    this.setState({
      settings: { ...this.state.settings, [name]: checked === true },
    });
  };

  handleChange = (e, { name, value }) => {
    this.setState({
      settings: { ...this.state.settings, [name]: parseFloat(value) },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmitSettings(this.state.settings);
    this.handleClose();
  };

  render() {
    return (
      <Modal
        trigger={
          <span
            className="cursor-pointer"
            onClick={this.handleOpen}
            role="button"
            onKeyPress={this.handleOpen}
            tabIndex={0}
          >
            <i aria-hidden="true" className="big setting icon" />
          </span>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size="tiny"
      >
        <Header icon="setting" content="Autoscribe settings" />
        <Modal.Actions className="align-left">
          <Form onSubmit={this.handleSubmit} inverted>
            <Form.Field>
              <label htmlFor="continuous">Continuous recording</label>
              <Checkbox
                type="checkbox"
                name="continuous"
                id="continuous"
                checked={this.state.settings.continuous}
                onChange={this.handleCheck}
              />
            </Form.Field>

            <Form.Field>
              <label htmlFor="offset">
                Seconds of delay offset (min: -2.0 s, max: 0.0 s)
              </label>
              <Form.Input
                type="number"
                name="offset"
                id="offset"
                value={this.state.settings.offset}
                max={0}
                min={-2}
                step={0.05}
                width={3}
                onChange={this.handleChange}
              />
            </Form.Field>
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
          </Form>
        </Modal.Actions>
      </Modal>
    );
  }
}
export default ModalSettings;

ModalSettings.propTypes = {
  handleSubmitSettings: PropTypes.func.isRequired,
};
