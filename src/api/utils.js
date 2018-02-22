const utils = (() => {
  let keywords = [];
  let previousResult = '';

  const makeKeywordArray = (string, time) =>
    string
      .split(' ')
      .filter(el => el.length > 3)
      .map(el => ({ word: el, time }));

  const addKeywords = (final, keywrds) => {
    let k = keywrds;
    return final.map(el => {
      const obj = { word: el };
      if (el.length > 3) {
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
    const latestResult = res[0][0].transcript;
    let modifiedResult = '';
    const { isFinal } = res[0];

    if (previousResult) {
      // get the part of latest result not present i previous
      if (latestResult.toLowerCase().startsWith(previousResult.toLowerCase())) {
        modifiedResult = latestResult.slice(previousResult.length).trim();
        // no match - unique
      } else if (!isFinal) {
        modifiedResult = latestResult;
      }
      // first result
    } else {
      modifiedResult = latestResult;
    }

    // filter out empty results
    if (modifiedResult) {
      const tempArr = makeKeywordArray(modifiedResult, time);
      // filter out adjacent identical words
      if (tempArr[0] !== keywords[keywords.length - 1]) {
        keywords.push(...tempArr);
      }
    }

    previousResult = latestResult;

    if (isFinal) {
      console.log(`result: ${res[0][0].transcript}`);
      // make arr of final string
      const fArr = res[0][0].transcript.split(' ');
      const finalArr = addKeywords(fArr, keywords);
      keywords = [];
      previousResult = '';
      return callback(finalArr);
    }
    return false;
  };

  return {
    findKeywords,
  };
})();

export default utils;
