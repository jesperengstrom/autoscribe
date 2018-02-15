import React from 'react';
import '../css/pushy-buttons.css';
import '../css/main.css';
import './Header.css';

const Header = ({ filename, fileLoaded }) => (
  <header id="page-header" className="pr-1 pl-1">
    <heading className="flex align-center">
      <h2>
        <i id="pen-logo" className="large write icon" />
        Autoscribe
      </h2>
    </heading>
    <div className="flex align-center">
      <input type="file" name="file" id="file" className="inputfile" />
      <label htmlFor="file" className="btn btn--sm btn--red nowrap mr-05">
        <i className="large file audio outline icon" />
        Choose file
      </label>
      <button className="btn btn--sm btn--red mr-05 nowrap">
        <i className="large cloud download icon" />
        Audio Url
      </button>
    </div>
    <div className="flex align-center">
      <p className="nowrap ml-1">{filename}</p>
    </div>
    <div className="flex align-center justify-end">
      <p>
        <a
          href="http://www.github.com/jesperengstrom"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i aria-hidden="true" className="big help circle icon button-red" />
        </a>
      </p>
    </div>
  </header>
);

export default Header;
