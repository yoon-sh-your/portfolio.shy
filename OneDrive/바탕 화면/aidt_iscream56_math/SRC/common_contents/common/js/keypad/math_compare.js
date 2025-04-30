/**
 * 다양한 수학 표현식을 정규화하고 비교하는 함수 모음
 */

/**
 * 표현식을 정규화하여 비교 가능한 형태로 변환하는 함수
 * @param {string} expression - 입력 수학 표현식
 * @return {string} - 정규화된 표현식
 */
function normalizeExpression(expression) {
  // 입력값이 문자열이 아닌 경우 처리
  if (typeof expression !== 'string') {
      console.warn('문자열이 아닌 입력:', expression);
      return '';
  }
  
  // 일반적인 LaTeX 기호 확인
  const latexSymbolPattern = /\\(placeholder|text|frac|div|sqrt|sum|int|prod|lim|infty|alpha|beta|gamma|delta)/;
  
  // LaTeX 기호가 있으면 SelvyPenMathKeyboard의 convertLatexToAsciiMath 함수를 사용하여 변환
  if (latexSymbolPattern.test(expression) && typeof window !== 'undefined' && window.SelvyPenMathKeyboard && window.SelvyPenMathKeyboard.convertLatexToAsciiMath) {
    try {
        // \text{} 태그는 SelvyPenMathKeyboard에서 자체 처리됨

        // LaTeX를 ASCII Math로 변환
        expression = window.SelvyPenMathKeyboard.convertLatexToAsciiMath(expression);
        
        // SelvyPenMathKeyboard를  \text{} 처리
        expression = expression.replace(/\\text\{([^}]+)\}/g, '$1');
        
        // 변환 결과 후처리
        // "숫자" 패턴을 숫자로 변환
        expression = expression.replace(/"(\d+)"/g, '$1');
        
        // ("숫자")/("숫자") 패턴을 (숫자)/(숫자)로 변환
        expression = expression.replace(/\("(\d+)"\)\/\("(\d+)"\)/g, '($1)/($2)');
        
        // 공백 제거
        expression = expression.replace(/\s+/g, '');
    } catch (error) {
        console.error('LaTeX 변환 오류:', error);
    }
  }

  // 공백 제거
  let normalized = expression.replace(/\s+/g, '');
  
  // 1. \text{} 태그 제거 (가장 먼저 처리)
  normalized = normalized.replace(/\\text\{([^}]+)\}/g, '$1');
  
  // 2. 기본 연산자 통일
  // -:, ÷, \div 연산자를 / 로 통일
  normalized = normalized.replace(/-:/g, '/');
  normalized = normalized.replace(/÷/g, '/');
  // normalized = normalized.replace(/\\div/g, '/');
  
  // × 연산자를 * 로 통일
  normalized = normalized.replace(/[×xX]/g, '*');
  
  // ＋ 연산자를 + 로 통일
  normalized = normalized.replace(/\＋/g, "+");
  
  // － 연산자를 - 로 통일
  normalized = normalized.replace(/－/g, "-");
  
  // 5. 혼합분수 변환
  const mixedFractionPatterns = [
      /(\d+)\((\d+)\/(\d+)\)/g,          // 2(1/2) 형태
      /(\d+)\((\d+)\)\/\((\d+)\)/g       // 2(1)/(2) 형태
  ];
  
  for (const pattern of mixedFractionPatterns) {
      normalized = normalized.replace(pattern, (match, whole, num, denom) => {
          const wholeNum = parseInt(whole);
          const numerator = parseInt(num);
          const denominator = parseInt(denom);
          const improperNum = wholeNum * denominator + numerator;
          return `${improperNum}/${denominator}`;
      });
  }
  
  // 6. 연속된 나눗셈 처리 - 이 부분을 동일하게 처리하는 것이 중요!
  // 모든 연속 나눗셈을 표준 형식으로 변환 (a/b/c -> (a)/(b*c))
  const processConsecutiveDivisions = (str) => {
      let result = str;
      // 복잡한 연속 나눗셈 (a/b/c/d) 처리
      result = result.replace(/(\d+)\/(\d+)\/(\d+)\/(\d+)/g, 
          (_, a, b, c, d) => `(${a}*${d})/(${b}*${c})`);
      
      // 단순 연속 나눗셈 (a/b/c) 처리
      result = result.replace(/(\d+)\/(\d+)\/(\d+)/g,
          (_, a, b, c) => `(${a})/(${b}*${c})`);
          
      return result;
  };
  
  normalized = processConsecutiveDivisions(normalized);
  
  // 7. 괄호 단순화
  const simplifyBrackets = (str) => {
      let result = str;
      let prevResult;
      do {
          prevResult = result;
          
          // 단순 값의 괄호 제거
          result = result.replace(/\((\d+)\)/g, '$1');
          
          // 괄호 안의 분수 단순화
          result = result.replace(/\((\d+\/\d+)\)/g, '$1');
          
          // 곱셈/나눗셈의 괄호 단순화
          result = result.replace(/\((\d+)\)\*\((\d+)\)/g, '$1*$2');
          result = result.replace(/(\d+)\*\((\d+)\)/g, '$1*$2');
          result = result.replace(/\((\d+)\)\*(\d+)/g, '$1*$2');
          result = result.replace(/\((\d+)\)\/(\d+)/g, '$1/$2');
          result = result.replace(/(\d+)\/\((\d+)\)/g, '$1/$2');
          
          // 덧셈/뺄셈의 불필요한 괄호 제거
          result = result.replace(/\((\d+[\+\-]\d+)\)/g, '$1');
          
      } while (result !== prevResult);
      
      return result;
  };
  
  normalized = simplifyBrackets(normalized);
  
  return normalized;
}

/**
* 표현식의 수학적 값을 계산하는 함수
* @param {string} expression - 정규화된 표현식
* @return {number} - 계산된 값
*/
function evaluateExpression(expression) {
try {
  // 복잡한 표현식은 String -> Function으로 평가
  // 보안 주의: 실제 프로덕션 환경에서는 사용자 입력을 직접 eval하는 것을 피해야 함
  return Function(`"use strict"; return ${expression}`)();
} catch (error) {
  console.error('표현식 평가 오류:', error);
  return NaN;
}
}

/**
* 두 수학 표현식이 수학적으로 같은지 비교하는 함수
* @param {string} expr1 - 첫 번째 수학 표현식
* @param {string} expr2 - 두 번째 수학 표현식
* @param {number} [tolerance=1e-10] - 부동소수점 비교 허용 오차
* @return {object} - 비교 결과 객체
*/
function compareMathExpressions(expr1, expr2, tolerance = 1e-10) {
const result = {
  original1: expr1,
  original2: expr2,
  normalized1: '',
  normalized2: '',
  value1: null,
  value2: null,
  areEqual: false,
  error: null
};

try {
  // 표현식 정규화
  result.normalized1 = normalizeExpression(expr1);
  result.normalized2 = normalizeExpression(expr2);
  
  // 정규화된 표현식이 동일하면 즉시 true 반환
  if (result.normalized1 === result.normalized2) {
    result.areEqual = true;
    return result;
  }
  
  // 수치적으로 계산하여 비교
  result.value1 = evaluateExpression(result.normalized1);
  result.value2 = evaluateExpression(result.normalized2);
  
  // NaN 처리
  if (isNaN(result.value1) || isNaN(result.value2)) {
    result.error = '하나 이상의 표현식을 수치적으로 평가할 수 없습니다';
    return result;
  }
  
  // 부동소수점 비교
  result.areEqual = Math.abs(result.value1 - result.value2) < tolerance;
  
} catch (error) {
  result.error = `비교 오류: ${error.message}`;
}

return result;
}

/**
* 여러 수학 표현식이 모두 같은지 비교하는 함수
* @param {string[]} expressions - 비교할 수학 표현식 배열
* @param {number} [tolerance=1e-10] - 부동소수점 비교 허용 오차
* @return {object} - 비교 결과 객체
*/
function compareMultipleMathExpressions(expressions, tolerance = 1e-10) {
const result = {
  originals: expressions,
  normalized: [],
  values: [],
  areAllEqual: false,
  error: null
};

try {
  // 모든 표현식이 빈 문자열이면 true 반환
  if (expressions.every(expr => !expr.trim())) {
    result.areAllEqual = true;
    return result;
  }

  // 배열이 비어있거나 요소가 1개 이하면 에러
  if (!Array.isArray(expressions) || expressions.length <= 1) {
    result.error = '비교할 표현식이 2개 이상 필요합니다';
    return result;
  }

  // 모든 표현식 정규화
  result.normalized = expressions.map(expr => normalizeExpression(expr));

  // 정규화된 표현식이 모두 같은지 확인
  if (result.normalized.every(norm => norm === result.normalized[0])) {
    result.areAllEqual = true;
    return result;
  }

  // 수치적으로 계산하여 비교
  result.values = result.normalized.map(norm => evaluateExpression(norm));

  // NaN 체크
  if (result.values.some(val => isNaN(val))) {
    result.error = '하나 이상의 표현식을 수치적으로 평가할 수 없습니다';
    return result;
  }

  // 모든 값이 허용 오차 내에서 같은지 확인
  result.areAllEqual = result.values.every((val, i) => 
    i === 0 || Math.abs(val - result.values[0]) < tolerance
  );

} catch (error) {
  result.error = `비교 오류: ${error.message}`;
}

return result;
}

// 브라우저 환경에서 테스트 실행
if (typeof window !== 'undefined') {
window.runTests = testExamples;
window.compareMathExpressions = compareMathExpressions;
window.compareMultipleMathExpressions = compareMultipleMathExpressions;
window.normalizeExpression = normalizeExpression;
console.log('테스트를 실행하려면 runTests()를 호출하세요.');
}

/**
* 주어진 예제를 테스트하는 함수
*/
function testExamples() {
const examples = [
  {
    expr1: "2(2)/(3)+(1)/(2)",
    expr2: "2(2/3)+(1/2)",
    expr3: "2\\frac{2}{3}+\\frac{1}{2}"
  },
  {
    expr1: "1(47)/(63)",
    expr2: "(110)/(63)",
    expr3: "110/63",
    expr4: "1(47/63)"
  },
  {
    expr1: "(3)/(4)+(5)/(8)",
    expr2: "(3/4)+(5/8)",
    expr3: "3/4+5/8"
  },
  {
    expr1: "(2+3)+((18)/(30)+(25)/(30))",
    expr2: "2+3+(18/30)+(25/30)"
  },
  {
    expr1: "(5)/(6)-(1)/(2)",
    expr2: "5/6-1/2",
    expr3: "(5/6)-(1/2)"
  },
  {
    expr1: "(5×5)/(8×5)-(3)×(4)/(10)×(4)",
    expr2: "(5*5)/(8X5)-3×(4/10)x4"
  },
  {
    expr1: "(28-:4)/(32)",
    expr2: "(28÷4)/32"
  },
  {
    expr1: "1(4)/(5)-:4",
    expr2: "1(4/5)÷4"
  },
  {
    expr1: "(4×2)/(9×2)",
    expr2: "(4*2)/(9*2)",
    expr3: "(4X2)/(9X2)"
  },
  {
    expr1: "5×4",
    expr2: "5*4",
    expr3: "5X4",
    expr4: "5x4",
    expr5: "5×4"
  },
  {
    expr1: "4(1)/(2)-:(3)/(4)",
    expr2: "4\\frac{1}{2}\\div\\frac{3}{4}",
    expr3: "4\\frac12\\div\\frac34",
    expr4: "\\text{4}\\frac{\\text{1}}{\\text{2}}\\div\\frac{3}{4}",
    expr5: "\\text{4}\\frac{\\text{1}}{\\text{2}}\\div\\frac34"
  }
];

const results = [];

// 각 예제 그룹 테스트
examples.forEach((group, groupIndex) => {
  console.log(`=== 예제 ${groupIndex + 1} 테스트 ===`);
  
  // 그룹 내 모든 표현식 쌍 비교
  const expressions = Object.values(group);
  const groupResult = { group: groupIndex + 1, comparisons: [] };
  
  for (let i = 0; i < expressions.length; i++) {
    for (let j = i + 1; j < expressions.length; j++) {
      const result = compareMathExpressions(expressions[i], expressions[j]);
      console.log(`"${expressions[i]}" vs "${expressions[j]}": ${result.areEqual ? '같음' : '다름'}`);
      if (result.normalized1 && result.normalized2) {
        console.log(`정규화: "${result.normalized1}" vs "${result.normalized2}"`);
      }
      if (result.value1 !== null && result.value2 !== null) {
        console.log(`값: ${result.value1} vs ${result.value2}`);
      }
      
      groupResult.comparisons.push({
        expr1: expressions[i],
        expr2: expressions[j],
        areEqual: result.areEqual,
        normalized1: result.normalized1,
        normalized2: result.normalized2,
        value1: result.value1,
        value2: result.value2
      });
    }
  }
  
  results.push(groupResult);
  console.log('\n');
});

return results;
}