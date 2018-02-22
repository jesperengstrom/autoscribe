const utils = (() => {
  let keywords = [];
  let previousResult = '';

  const makeKeywordArray = string =>
    string.split(' ').filter(el => el.length > 3);

  const findKeywords = e => {
    const latestResult = e.results[0][0].transcript;
    const { isFinal } = e.results[0];
    if (previousResult) {
      if (latestResult.toLowerCase().startsWith(previousResult.toLowerCase())) {
        // extract the part of lastest result not present i previous
        const surplus = latestResult.slice(previousResult.length).trim();
        if (surplus) {
          console.log(surplus);
          keywords.push(...makeKeywordArray(surplus));
          // duplicate
        } else return;
      } else if (!isFinal) {
        // no match - push anyway if NOT same as last keyword
        const tempArr = makeKeywordArray(latestResult);
        if (tempArr[0] !== keywords[keywords.length - 1]) {
          keywords.push(...tempArr);
        }
      }
    } else {
      // first result
      keywords.push(...makeKeywordArray(latestResult));
    }

    previousResult = latestResult;

    if (isFinal) {
      console.log(`result: ${e.results[0][0].transcript}`);
      console.log(keywords);
      keywords = [];
      previousResult = '';
    }
  };

  return {
    findKeywords,
  };
})();

export default utils;
