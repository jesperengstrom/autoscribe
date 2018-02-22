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
    return final.map(e => {
      const obj = { word: e };
      if (e.length > 3) {
        const match = k.find(
          (el, i) =>
            el.word.toLowerCase() === e.toLowerCase()
              ? { time: el.time, i }
              : false,
        );
        if (match) {
          obj.time = match.time;
          k = k.slice(match.i + 1);
          console.log('match:', match);
        }
      }
      return obj;
    });
  };

  const findKeywords = (res, time) => {
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
      console.log(keywords);
      const finalArr = res[0][0].transcript.split(' ');
      const goofyArr = addKeywords(finalArr, keywords);
      console.log('goofy arr: ', goofyArr);
      keywords = [];
      previousResult = '';
    }
  };

  return {
    findKeywords,
  };
})();

export default utils;
