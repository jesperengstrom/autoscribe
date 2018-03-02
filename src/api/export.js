import Europa from 'europa';
import FileSaver from 'file-saver';

const handleExport = (data, fname) => {
  const filename = fname.length > 200 ? `${fname.substring(0, 200)}...` : fname;
  const date = new Date().toLocaleString();
  const header = `<h1>Transcription</h1><hr><h4>File: ${filename}</h4><hr>`;
  const footer = `<hr><p>Saved ${date}. This transcription was made using <a href="https://github.com/jesperengstrom/autoscribe">Autoscribe</a></p>`;

  const europa = new Europa();
  const markdown = europa.convert(header + data + footer);
  europa.release();

  const blob = new Blob([markdown], {
    type: 'text/markdown;charset=utf-8',
  });
  FileSaver.saveAs(blob, 'transcript.md');
};

export default handleExport;
