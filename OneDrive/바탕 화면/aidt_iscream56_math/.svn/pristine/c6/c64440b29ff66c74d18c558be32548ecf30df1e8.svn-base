runAfterAppReady(() => {

    // ✅ multiple input 리스너 바인딩 함수
    function bindMultipleAnswerMathFields() {
      const fields = document.querySelectorAll('math-field[data-answer-multi]');
  
      fields.forEach(mathField => {
        if (mathField.dataset.multipleBound === "true") return;
        mathField.dataset.multipleBound = "true";
  
        mathField.addEventListener('input', () => {
          checkMathFieldAnswer(mathField);
        });
        
        // 초기 로드 시에도 정오채점 실행
        checkMathFieldAnswer(mathField);
      });
    }
    
    // ✅ math-field 정오채점 함수
    function checkMathFieldAnswer(mathField) {
      let userValue = (mathField.value?.trim() || "").replace(/\s+/g, "");
      userValue = userValue.replace(/\\text\{([^}]*)\}/g, "$1").trim();
      
      // 분수 형식 변환 (LaTeX -> (분자)/(분모) 형식)
      userValue = userValue.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");
      
      // \frac65 형식 변환 (괄호 없는 LaTeX 분수 -> (분자)/(분모) 형식)
      userValue = userValue.replace(/\\frac(\d+)(\d+)/g, "($1)/($2)");
      
      // 분수 형식 정규화 (공백 제거)
      userValue = userValue.replace(/\(\s*(\d+)\s*\)\s*\/\s*\(\s*(\d+)\s*\)/g, "($1)/($2)");
      
      // 분수 형식 정규화 (괄호 내부 공백 제거)
      userValue = userValue.replace(/\((\d+)\)\/(\d+)/g, "($1)/($2)");
      
      // 분수 형식 정규화 (슬래시 주변 공백 제거)
      userValue = userValue.replace(/\((\d+)\)\s*\/\s*\((\d+)\)/g, "($1)/($2)");
      
      // 복수정답 처리
      const answerMultiString = mathField.dataset.answerMulti;
      if (answerMultiString) {
        try {
          const answerMultiObj = JSON.parse(answerMultiString);
          const answerList = answerMultiObj.values.map(v => {
            v = v.trim();
            // 분수 형식 변환 (LaTeX -> (분자)/(분모) 형식)
            v = v.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");
            // \frac65 형식 변환 (괄호 없는 LaTeX 분수 -> (분자)/(분모) 형식)
            v = v.replace(/\\frac(\d+)(\d+)/g, "($1)/($2)");
            // 분수 형식 정규화 (공백 제거)
            v = v.replace(/\(\s*(\d+)\s*\)\s*\/\s*\(\s*(\d+)\s*\)/g, "($1)/($2)");
            // 분수 형식 정규화 (괄호 내부 공백 제거)
            v = v.replace(/\((\d+)\)\/(\d+)/g, "($1)/($2)");
            // 분수 형식 정규화 (슬래시 주변 공백 제거)
            v = v.replace(/\((\d+)\)\s*\/\s*\((\d+)\)/g, "($1)/($2)");
            return v;
          });
          
          const isCorrect = answerList.includes(userValue);
          mathField.dataset.correction = isCorrect ? "true" : "false";
          
          if (isCorrect) {
            mathField.classList.remove("hint");
          }
          
          // 디버깅용 로그
          console.log("복수정답 체크:", {
            userValue,
            answerList,
            isCorrect
          });
        } catch (e) {
          console.error("복수정답 파싱 오류:", e);
        }
        return;
      }
      
      // 단일정답 처리
      const answerSingle = mathField.dataset.answerSingle?.trim();
      if (answerSingle !== undefined) {
        let normalizedAnswerSingle = answerSingle.replace(/\s+/g, "").replace(/\\text\{([^}]*)\}/g, "$1");
        // 분수 형식 변환 (LaTeX -> (분자)/(분모) 형식)
        normalizedAnswerSingle = normalizedAnswerSingle.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");
        // \frac65 형식 변환 (괄호 없는 LaTeX 분수 -> (분자)/(분모) 형식)
        normalizedAnswerSingle = normalizedAnswerSingle.replace(/\\frac(\d+)(\d+)/g, "($1)/($2)");
        // 분수 형식 정규화 (공백 제거)
        normalizedAnswerSingle = normalizedAnswerSingle.replace(/\(\s*(\d+)\s*\)\s*\/\s*\(\s*(\d+)\s*\)/g, "($1)/($2)");
        // 분수 형식 정규화 (괄호 내부 공백 제거)
        normalizedAnswerSingle = normalizedAnswerSingle.replace(/\((\d+)\)\/(\d+)/g, "($1)/($2)");
        // 분수 형식 정규화 (슬래시 주변 공백 제거)
        normalizedAnswerSingle = normalizedAnswerSingle.replace(/\((\d+)\)\s*\/\s*\((\d+)\)/g, "($1)/($2)");
        
        if (normalizedAnswerSingle === "empty_answer") {
          const isCorrect = !userValue;
          mathField.dataset.correction = isCorrect ? "true" : "false";
        } else {
          // 항상 정답 체크 실행 (입력값이 없어도)
          const isCorrect = (userValue === normalizedAnswerSingle);
          mathField.dataset.correction = isCorrect ? "true" : "false";
          
          // 디버깅용 로그
          console.log("정답 체크:", {
            userValue,
            normalizedAnswerSingle,
            isCorrect
          });
        }
      }
    }
    
    // ✅ 모든 math-field에 정오채점 이벤트 바인딩
    function bindAllMathFields() {
      const allMathFields = document.querySelectorAll('math-field[data-answer-single]');
      
      allMathFields.forEach(mathField => {
        if (mathField.dataset.singleBound === "true") return;
        mathField.dataset.singleBound = "true";
        
        mathField.addEventListener('input', () => {
          checkMathFieldAnswer(mathField);
        });
        
        // 초기 로드 시에도 정오채점 실행
        checkMathFieldAnswer(mathField);
      });
    }
  
    // ✅ 페이지 on 시 multiple 필드 리스너 재바인딩
    const observePageActivation = (selector) => {
      const page = document.querySelector(selector);
      if (!page) return;
  
      const observer = new MutationObserver(() => {
        if (page.classList.contains("on")) {
          bindMultipleAnswerMathFields();
          bindAllMathFields();
          page.querySelectorAll(".boolean_wrap button.selected").forEach(button => {
            button.dispatchEvent(new Event("input", { bubbles: true }));
          });
        }
      });
  
      observer.observe(page, { attributes: true });
    };
  
    // ✅ 최초 리스너 바인딩 및 페이지 활성 감지 등록
    bindMultipleAnswerMathFields();
    bindAllMathFields();
    observePageActivation(".page_1");
    observePageActivation(".page_2");
    observePageActivation(".page_3");
    observePageActivation(".page_4");
  
    // ✅ getCustomTargets: 현재 페이지 내 boolean 또는 math-field 대상 반환
    window.getCustomTargets = function (page) {
      const booleanTargets = $(page).find(".boolean_wrap").filter((_, el) => $(el).find("button.selected").length > 0);
      const mathFields = $(page).find("math-field[data-answer-single]");
      return [...booleanTargets.get(), ...mathFields.get()];
    };
  
    // ✅ customCheckCondition: 대상 요소의 정답 여부 판단
    window.customCheckCondition = function (el) {
        const $el = $(el);
      
        if ($el.hasClass("boolean_wrap") || $el.closest(".boolean_wrap").length > 0) {
          const $wrap = $el.hasClass("boolean_wrap") ? $el : $el.closest(".boolean_wrap");
          const $selected = $wrap.find("button.selected");
          const $correct = $wrap.find("button[data-answer-single='true']");
          $wrap.find("button").removeAttr("data-correction");
          if ($selected.length === 0) return "empty";
      
          const isAllCorrect = $selected.length === $correct.length &&
            $selected.toArray().every(btn => String($(btn).data("answerSingle")) === "true");
      
          $selected.each((_, btn) => btn.setAttribute("data-correction", isAllCorrect ? "true" : "false"));
          return isAllCorrect;
        }
      
        if ($el.is("math-field")) {
          let userValue = String($el.val() || "").trim().replace(/\s+/g, "").replace(/\\text\{([^}]*)\}/g, "$1");
          // 분수 형식 변환 (LaTeX -> (분자)/(분모) 형식)
          userValue = userValue.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");
          // \frac65 형식 변환 (괄호 없는 LaTeX 분수 -> (분자)/(분모) 형식)
          userValue = userValue.replace(/\\frac(\d+)(\d+)/g, "($1)/($2)");
          // 분수 형식 정규화 (공백 제거)
          userValue = userValue.replace(/\(\s*(\d+)\s*\)\s*\/\s*\(\s*(\d+)\s*\)/g, "($1)/($2)");
          // 분수 형식 정규화 (괄호 내부 공백 제거)
          userValue = userValue.replace(/\((\d+)\)\/(\d+)/g, "($1)/($2)");
          // 분수 형식 정규화 (슬래시 주변 공백 제거)
          userValue = userValue.replace(/\((\d+)\)\s*\/\s*\((\d+)\)/g, "($1)/($2)");
          
          let correctValue = String($el.data("answerSingle") || "").trim().replace(/\s+/g, "").replace(/\\text\{([^}]*)\}/g, "$1");
          // 분수 형식 변환 (LaTeX -> (분자)/(분모) 형식)
          correctValue = correctValue.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");
          // \frac65 형식 변환 (괄호 없는 LaTeX 분수 -> (분자)/(분모) 형식)
          correctValue = correctValue.replace(/\\frac(\d+)(\d+)/g, "($1)/($2)");
          // 분수 형식 정규화 (공백 제거)
          correctValue = correctValue.replace(/\(\s*(\d+)\s*\)\s*\/\s*\(\s*(\d+)\s*\)/g, "($1)/($2)");
          // 분수 형식 정규화 (괄호 내부 공백 제거)
          correctValue = correctValue.replace(/\((\d+)\)\/(\d+)/g, "($1)/($2)");
          // 분수 형식 정규화 (슬래시 주변 공백 제거)
          correctValue = correctValue.replace(/\((\d+)\)\s*\/\s*\((\d+)\)/g, "($1)/($2)");
          
          // 항상 정답 체크 실행 (입력값이 없어도)
          const isCorrect = userValue === correctValue;
          $el.attr("data-correction", isCorrect ? "true" : "false");
          
          // 디버깅용 로그
          console.log("customCheckCondition 정답 체크:", {
            userValue,
            correctValue,
            isCorrect
          });
          
          return isCorrect;
        }
      
        // ✅ ⬇️ 버튼 채점 로직은 여기 위치해야 함
        if ($el.is("button") && $el.closest(".boolean_wrap").length > 0) {
          const $wrap = $el.closest(".boolean_wrap");
          const $selected = $wrap.find("button.selected");
          const $correct = $wrap.find("button[data-answer-single='true']");
          $wrap.find("button").removeAttr("data-correction");
      
          if ($selected.length === 0) return "empty";
      
          const isAllCorrect = $selected.length === $correct.length &&
            $selected.toArray().every(btn => String($(btn).data("answerSingle")) === "true");
      
          $selected.each((_, btn) => {
            btn.setAttribute("data-correction", isAllCorrect ? "true" : "false");
          });
      
          return isAllCorrect;
        }
      
        return true; // 마지막에 위치
      };
      
  
    // ✅ 기타 이벤트 및 채점 관련 전역 함수 정의 (생략된 부분은 기존 코드 유지)
    // resetCustom, onCorrectCustom, onIncorrectCustom, onEmptyCustom 등...
    window.resetCustom = function () {
        // boolean 버튼 초기화
        $(".boolean_wrap button").removeClass("selected hint");
      
        // multiple_hint 초기화
        document.querySelectorAll(".multiple_hint").forEach(hint => {
          hint.classList.remove("hint");
        });
      
        // math-field 힌트 제거
        document.querySelectorAll("math-field").forEach(field => {
          field.classList.remove("hint");
          field.removeAttribute("data-correction");
        });
      };
      
      window.onIncorrectTwiceCustom = function () {
        const page = pagenation.activePage;
      
        // ✅ 공통 math-field 오답 처리
        page.querySelectorAll("math-field[data-correction='false']").forEach(el => {
          el.classList.add("hint");
      
          // multiple_hint 표시
          const multipleWrap = el.closest(".multiple_answers");
          if (multipleWrap) {
            const hintEl = multipleWrap.querySelector(".multiple_hint");
            if (hintEl) hintEl.classList.add("hint");
          }
        });
      
        // ✅ page_2 또는 page_3일 경우 boolean 전체 버튼에 hint 처리
        const isSpecialPage = page.classList.contains("page_2") || page.classList.contains("page_3");
        if (isSpecialPage) {
          page.querySelectorAll(".boolean_wrap button").forEach(button => {
            button.classList.add("hint");
          });
        }
      };
      

      document.querySelectorAll(".boolean_wrap button").forEach((button) => {
        button.addEventListener("click", () => {
          button.classList.toggle("selected");
          button.dispatchEvent(new Event("input", { bubbles: true }));
      
        });
      });
      
  });
