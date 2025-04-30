
function normalizeLatex(latex) {
    return latex.replace(/\\frac(\d+)(\d+)/g, "\\frac{$1}{$2}");
  }
  
  function latexToText(latex) {
    latex = normalizeLatex(latex);
    latex = latex.replace(/\\text\{(.+?)\}/g, "$1");
  
    // \frac{a}{b}
    const matchLatex = latex.match(/^\\frac\{(.+?)\}\{(.+?)\}$/);
    if (matchLatex) {
      const [, numerator, denominator] = matchLatex;
      return `(${numerator})/(${denominator})`;
    }
  

    const matchParentheses = latex.match(/^\((.+?)\)\/\((.+?)\)$/);
    if (matchParentheses) {
      const [, numerator, denominator] = matchParentheses;
      return `(${numerator})/(${denominator})`;
    }
  

    const matchSimpleFraction = latex.match(/^\s*-?\d+\s*\/\s*-?\d+\s*$/);
    if (matchSimpleFraction) {
      const parts = latex.split('/').map(p => p.trim());
      const numerator = parts[0];
      const denominator = parts[1];
      return `(${numerator})/(${denominator})`;
    }
  
    return latex;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const grape = document.getElementById('grape');
    const orange = document.getElementById('orange');
    const result = document.getElementById('result');
  
    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }
  
    function updateAnswer() {
      result.setAttribute("data-answer-single", "");
  
      const gRaw = latexToText(grape.value);
      const oRaw = latexToText(orange.value);
  
      let gN, gD, oN, oD;
  
      if (gRaw.includes('/')) {
        if (gRaw.startsWith('(') && gRaw.endsWith(')')) {
          [gN, gD] = gRaw.replace(/[()]/g, '').split('/');
        } else {
          [gN, gD] = gRaw.split('/');
        }
      } else if (!isNaN(gRaw) && gRaw !== '') {
        gN = gRaw;
        gD = "1";
      } else {
        return;
      }
  
      if (oRaw.includes('/')) {
        if (oRaw.startsWith('(') && oRaw.endsWith(')')) {
          [oN, oD] = oRaw.replace(/[()]/g, '').split('/');
        } else {
          [oN, oD] = oRaw.split('/');
        }
      } else if (!isNaN(oRaw) && oRaw !== '') {
        oN = oRaw;
        oD = "1";
      } else {
        return;
      }
  
      if (
        isNaN(Number(gN)) || isNaN(Number(gD)) ||
        isNaN(Number(oN)) || isNaN(Number(oD)) ||
        Number(oN) === 0
      ) {
        return;
      }
  
      const gNum = Number(gN);
      const gDen = Number(gD);
      const oNum = Number(oN);
      const oDen = Number(oD);
  
      const top = gNum * oDen;
      const bottom = gDen * oNum;
      const div = gcd(top, bottom);
      const simpTop = top / div;
      const simpBottom = bottom / div;
  
      let answerStr = '';
      if (simpTop === simpBottom) {
        answerStr = '1';
      } else if (simpBottom === 1) {
        answerStr = `${simpTop}`;
      } else {
        answerStr = `(${simpTop})/(${simpBottom})`;
      }
  
      result.setAttribute("data-answer-single", answerStr);
    }
  
    [grape, orange].forEach(input => {
      ['input', 'change', 'paste'].forEach(eventType => {
        input.addEventListener(eventType, () => {
          updateAnswer();
        });
      });
    });
  });
  
  runAfterAppReady(() => {
    window.customCheckCondition = function (el) {
        const $el = $(el);
        let rule = $el.data("answerSingle");
        let val = $el.val();
        let correction = $el.attr("data-correction"); 
      
        val = latexToText(val);
      
        if (/^[-]?\d+$/.test(val)) {
          val = String(parseInt(val, 10));
          // 정수인 경우에만 data-correction을 체크
          if (correction === "true") {
            return true;
          } else {
            return false;
          }
        }
        return val === rule;
      };
  
    window.resetCustom = function () {
      const input = $("#result");
      input.removeAttr('data-answer-single');
      input.removeData('answerSingle');
    };
  });
  