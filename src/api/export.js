import Europa from 'europa';
import FileSaver from 'file-saver';

const header = '<h1>Transcription</h1><hr>';
const footer =
  '<hr><p>This transcription was made using <a href="https://github.com/jesperengstrom/autoscribe">Autoscribe</a></p>';

const handleExport = data => {
  const europa = new Europa();
  const markdown = europa.convert(header + data + footer);
  europa.release();
  const blob = new Blob([markdown], {
    type: 'text/markdown;charset=utf-8',
  });
  FileSaver.saveAs(blob, 'transcript.md');
};

export default handleExport;
