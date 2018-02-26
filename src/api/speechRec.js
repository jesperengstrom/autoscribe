const speechRec = (() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  const startAndListen = (continuous, lang, callback, handleResult) => {
    console.log(`continous is ${continuous}`);
    recognition.continuous = continuous;
    recognition.lang = lang;
    recognition.start();
    recognition.onstart = callback;
    recognition.onend = callback;
    recognition.onerror = callback;
    recognition.onresult = handleResult;
  };

  const stop = () => {
    recognition.stop();
  };

  return {
    startAndListen,
    stop,
  };
})();

export default speechRec;

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

// recognition.onstart = () => {
//   onRecognitionStart();
// };
