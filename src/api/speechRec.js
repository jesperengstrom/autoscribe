import onRecognitionStart from '../Components/Main';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = true;
// recognition.continuous = true;
// create one initial p
// var timeStamps = []
// var latestP = textEditor.createNewParagraph();

// recognition.addEventListener('result', e => {
//   timeStamps.push(audioControls.getCurrentTime())
//   console.log(timeStamps);
//   let transcript = Array.from(e.results)
//   .map(result => result[0])
//   .map(result => result.transcript)
//   .join('');

//   textEditor.appendTranscript(latestP, transcript, timeStamps[0]);

//   if (e.results[0].isFinal) {
//     console.log('final. Listening ' + appState.listening + ' playing ' + appState.audioPlaying );
//     audioControls.listenAndRecord();
//     latestP = textEditor.createNewParagraph();
//     timeStamps = [];
//   }
// })

// function startListening() {
//   recognition.onstart = () => {
//     setTimeout(() =>{
//     }, 500);
//   }
//   recognition.start();
// }

// function stopListening() {
//   recognition.onend = () => {
//     appState.listening = false;
//   }
//   audioControls.pause();
//   setTimeout(() => recognition.stop(), 200);
// }

recognition.onstart = () => {
  onRecognitionStart();
};

export default recognition;
