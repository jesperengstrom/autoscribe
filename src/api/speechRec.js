const speechRec = (() => {
  try {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const startAndListen = (continuous, lang, handleChange, handleResult) => {
      console.log(`continous is ${continuous}`);
      recognition.continuous = continuous;
      recognition.lang = lang;
      recognition.onstart = handleChange;
      recognition.onend = handleChange;
      recognition.onerror = handleChange;
      recognition.onresult = handleResult;
      recognition.start();
    };

    const stop = () => {
      recognition.stop();
    };

    return {
      startAndListen,
      stop,
    };
  } catch (error) {
    alert(
      'Sorry, Speech Recognition does not seem to work in your browser. Please try the lastest version of Chrome.',
    );
  }
})();

export default speechRec;
