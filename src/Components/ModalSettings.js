import React, { Component } from 'react';
import { Header, Modal, Checkbox, Form, Message } from 'semantic-ui-react';
import '../css/pushy-buttons.css';

class ModalSettings extends Component {
  state = {
    modalOpen: false,
    continuous: false,
    offset: 0,
    error: false,
    errorMsg: '',
  };

  componentWillReceiveProps(newProps) {
    this.setState(newProps);
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false, error: false });

  handleCheck = (e, { name, checked }) =>
    this.setState({ [name]: checked === true });

  handleChange = (e, { name, value }) => {
    if (value) this.setState({ [name]: parseFloat(value) });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { offset } = this.state;
    if (!offset || offset < -2 || offset > 0) {
      this.setState({
        error: true,
        errorMsg: 'Offset must be number between -2 and 0',
        offset: this.props.offset,
      });
    } else {
      this.props.handleSubmitSettings(this.state);
      this.handleClose();
    }
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
        {/* <Modal.Content /> */}
        <Modal.Actions className="align-left">
          <Form onSubmit={this.handleSubmit} inverted error={this.state.error}>
            <Message error header="Oh no!" content={this.state.errorMsg} />
            <Form.Field>
              <label htmlFor="continuous">Continuous recording</label>
              <Checkbox
                type="checkbox"
                name="continuous"
                id="continuous"
                checked={this.state.continuous}
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
                value={this.state.offset}
                max={0}
                min={-2}
                step={0.1}
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
