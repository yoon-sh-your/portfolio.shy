runAfterAppReady(() => {
    window.customCheckCondition = function () {
        const $el = $(".connect_wrap");
        const rule = $el.attr("data-answer-single"); // 정답
        const userInputStr = $el.attr('data-connections'); // 사용자 입력
      
        const correctAnswers = JSON.parse(rule.replace(/'/g, '"'));
        const userAnswers = JSON.parse(userInputStr.replace(/'/g, '"'));
      
        if (userAnswers.length !== correctAnswers.length) {
          return "empty";
        }
      
        const makeKey = (pair) => {
          return pair.sort().join("-"); 
        };
        const correctSet = new Set(correctAnswers.map(makeKey));
        const userSet = new Set(userAnswers.map(makeKey));
      
        // 집합끼리 비교
        for (const key of correctSet) {
          if (!userSet.has(key)) {
            return false; 
          }
        }
      
        return true; 
      };

});