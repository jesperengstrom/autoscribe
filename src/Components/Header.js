import React from 'react';
import ModalAudioUrl from './ModalAudioUrl';
import '../css/pushy-buttons.css';
import '../css/main.css';
import './Header.css';

const Header = ({ audioLoadSuccess, audioError, audioFile, onSelectFile }) => {
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
    return onSelectFile(sourceObj);
  };

  const loadStatus = () => {
    if (audioLoadSuccess) return 'success';
    if (audioError) return 'warning';
    return '';
  };

  return (
    <section id="page-header" className="pr-1 pl-1">
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
          Choose file
        </label>
        <ModalAudioUrl onSelectFile={onSelectFile} />
      </div>
      <div className="flex align-center">
        <p className={`nowrap ml-1 ${loadStatus()}`}>
          {audioFile.filename}
          {audioError && <span className="ml-1">{audioError}</span>}
        </p>
      </div>
      <div className="flex align-center justify-end">
        <p>
          <a
            href="https://github.com/jesperengstrom/autoscribe/blob/master/Documentation.md"
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

export default Header;
