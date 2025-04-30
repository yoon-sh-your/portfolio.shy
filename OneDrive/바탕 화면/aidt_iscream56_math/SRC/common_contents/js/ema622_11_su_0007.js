function normalizeLatex(latex) {
    if (typeof latex !== "string") return "";
    return latex.replace(/\\frac(\d+)(\d+)/g, "\\frac{$1}{$2}");
  }
  
  function latexToText(latex) {
    if (!latex) return "";
    latex = normalizeLatex(latex);
  
    const textMatch = latex.match(/\\text\{(.+?)\}/);
    if (textMatch) {
      latex = textMatch[1];
      const simpleFractionInText = latex.match(/^\s*-?\d+(\.\d+)?\s*\/\s*-?\d+(\.\d+)?\s*$/);
      if (simpleFractionInText) {
        const parts = latex.split('/').map(p => p.trim());
        const numerator = parts[0];
        const denominator = parts[1];
        return `(${numerator})/(${denominator})`;
      }
    }
  
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
  
    const matchSimpleFraction = latex.match(/^\s*-?\d+(\.\d+)?\s*\/\s*-?\d+(\.\d+)?\s*$/);
    if (matchSimpleFraction) {
      const parts = latex.split('/').map(p => p.trim());
      const numerator = parts[0];
      const denominator = parts[1];
      return `(${numerator})/(${denominator})`;
    }
  
    return latex;
  }
  
  runAfterAppReady(() => {
    setTimeout(function () {
      const $target = $("#custom_target");
  
      if ($target.length) {
        const $hint = $target.closest(".input_wrap").find(".text_hint");
        if (!$hint.length) return;
  
        let rule = $target.data("answerSingle") || "";
        const cleanText = latexToText(rule);
        const fractionMatch = cleanText.match(/^\((.+?)\)\/\((.+?)\)$/);
  
        if (fractionMatch) {
          const numerator = fractionMatch[1];
          const denominator = fractionMatch[2];
  
          const fractionHtml = `
            <div class="fraction_box" style="--child-height: 24px;">
              <span>${numerator}</span>
              <span>${denominator}</span>
            </div>
          `;
  
          $hint.html(fractionHtml).addClass("fraction");
        } else {
          $hint.text(cleanText);
        }
      }
    }, 0);
  
    window.customCheckCondition = function (el) {
      const $el = $(el);
      let rule = $el.data("answerSingle");
      let val = $el.val();
      let correction = $el.attr("data-correction");
  
      val = latexToText(val);
      if (val == '' || val == null) return "empty";
      if (correction == "true" || val === rule) {
        return true;
      } else {
        return false;
      }
    };
  });
  