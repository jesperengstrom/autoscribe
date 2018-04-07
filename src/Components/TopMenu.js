import React from 'react';
import PropTypes from 'prop-types';
import ModalAudioUrl from './ModalAudioUrl';
import ModalSettings from './ModalSettings';
import '../css/pushy-buttons.css';
import '../css/main.css';
import './TopMenu.css';

const TopMenu = props => {
  const onChange = e => {
    // in case a file is selected, reslected and aborted
    if (!e.target.files[0]) {
      return false;
    }
    const source = e.target.files[0];
    const sourceObj = {
      filename: source.name,
      path: URL.createObjectURL(e.target.files[0]),
      // set duration to 0 while evaluating file
      duration: 0,
    };
    return props.handleSelectFile(sourceObj);
  };

  const loadStatus = () => {
    if (props.audioLoadSuccess) return 'success';
    if (props.audioError) return 'warning';
    return '';
  };

  return (
    <section id="top-menu" className="pr-1 pl-1">
      <header className="flex align-center">
        <h2>
          <i id="pen-logo" className="large write icon" />
          Autoscribe
        </h2>
      </header>
      <div className="flex align-center">
        <input
          type="file"
          name="file"
          id="file"
          className="inputfile"
          accept="audio/*"
          onChange={onChange}
        />
        <label
          htmlFor="file"
          className="btn btn--sm btn--slim btn--red nowrap mr-05"
        >
          <i className="large file audio outline icon" />
          <span className="vanish-btn-text">Choose file</span>
        </label>
        <ModalAudioUrl handleSelectFile={props.handleSelectFile} />
      </div>
      <div className="flex align-center">
        <p id="filename-p">
          <span id="filename" className={`nowrap ml-1 ${loadStatus()}`}>
            {props.audioFile.filename}
          </span>
          {props.audioError && (
            <span className={`nowrap ml-1 ${loadStatus()}`}>
              {props.audioError}
            </span>
          )}
        </p>
      </div>
      <div className="flex align-center justify-end">
        <p>
          <ModalSettings
            settings={props.settings}
            handleSubmitSettings={props.handleSubmitSettings}
          />
        </p>
      </div>
      <div className="flex align-center justify-end">
        <p>
          <a
            href="https://github.com/jesperengstrom/autoscribe/blob/master/src/documentation/Documentation.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i aria-hidden="true" className="big help circle icon button-red" />
          </a>
        </p>
      </div>
    </section>
  );
};

export default TopMenu;

TopMenu.propTypes = {
  handleSelectFile: PropTypes.func.isRequired,
  audioLoadSuccess: PropTypes.bool.isRequired,
  audioError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
  audioFile: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  settings: PropTypes.shape({
    continuous: PropTypes.bool.isRequired,
    offset: PropTypes.number.isRequired,
  }).isRequired,
  handleSubmitSettings: PropTypes.func.isRequired,
};
