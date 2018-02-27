const utils = (() => {
  let startTime;
  let endTime;
  let keywords = [];
  let previousResult = '';

  const resetVals = () => {
    keywords = [];
    previousResult = '';
    startTime = undefined;
    endTime = undefined;
  };

  const makeKeywordArray = (string, time) =>
    string
      .split(' ')
      // filter out large words
      .filter(el => el.length > 5)
      .map(el => ({ word: el, time }))
      // filter duplicate words & times present in keywords
      // below line causes mixes up duplicate words
      // .filter(el => keywords.every(e => e.word !== el.word))
      .filter(el =>
        keywords.every(e => Math.round(e.time) !== Math.round(el.time)),
      );

  const addKeywords = (final, keywrds) => {
    let k = keywrds;
    return final.map(el => {
      const obj = { word: el };
      if (el.length > 5) {
        const i = k.findIndex(e => e.word.toLowerCase() === el.toLowerCase());
        if (i >= 0) {
          obj.time = k[i].time;
          // slice keyword arr so we don't find same word again
          k = k.slice(i + 1);
        }
      }
      return obj;
    });
  };

  const findKeywords = (res, time, callback) => {
    if (!startTime) {
      console.log('start time: findkeywords call');
      startTime = time;
    }
    const { isFinal } = res[0];
    const latestResult = res[0][0].transcript;
    let modifiedResult = '';

    if (previousResult) {
      // get the part of latest result not present i previous
      if (latestResult.toLowerCase().startsWith(previousResult.toLowerCase())) {
        modifiedResult = latestResult.slice(previousResult.length).trim();
        previousResult = latestResult;
        // no match - unique
      } else if (!isFinal) {
        modifiedResult = latestResult;
        previousResult = latestResult;
      }
      // first result
    } else {
      modifiedResult = latestResult;
      previousResult = latestResult;
    }

    // filter out empty results
    if (modifiedResult) {
      let newKeywords = makeKeywordArray(modifiedResult, time);
      newKeywords = newKeywords.length > 1 ? newKeywords[0] : newKeywords;
      keywords.push(...newKeywords);
    }

    if (isFinal) {
      endTime = time;
      console.log(`result: ${res[0][0].transcript}`);
      // make arr of final string
      const fArr = res[0][0].transcript.split(' ');
      const finalArr = addKeywords(fArr, keywords);
      const finalObj = { start: startTime, end: endTime, transcript: finalArr };
      resetVals();
      return callback(finalObj);
    }
    return false;
  };

  return {
    findKeywords,
  };
})();

export default utils;
