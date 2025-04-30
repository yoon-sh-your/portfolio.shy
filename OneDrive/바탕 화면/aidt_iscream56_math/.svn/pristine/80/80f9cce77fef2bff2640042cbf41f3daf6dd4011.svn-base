runAfterAppReady(() => {
  // 앱 준비 후 실행, jQuery 사용가능
  console.log("custom_answer_check.js 실행");

  // 페이지별로 math-field 중복 검사
  function setupDuplicateAnswerCheck1() {
    // 현재 활성 페이지가 page_1인지 확인
    const activePage = pagenation?.activePage;
    if (!activePage || !activePage.classList.contains("page_1")) {
      return; // page_1이 아니면 실행 중단
    }

    // const page1 = document.querySelector(".page.page_1"); // 기존 코드 대신 activePage 사용
    const page1 = activePage;
    if (!page1) return;

    const mathFields = page1.querySelectorAll(".problem1 math-field");

    function checkDuplicates() {
      const values = [];
      mathFields.forEach((field) => {
        field.classList.remove("duplicate");
        const value = field.value.trim();
        if (value !== "") {
          if (values.includes(value)) {
            field.classList.add("duplicate");
          } else {
            values.push(value);
          }
        }
      });
    }

    mathFields.forEach((field) => {
      field.addEventListener("input", checkDuplicates);
    });
  }

  function setupDuplicateAnswerCheck2() {
    // 현재 활성 페이지가 page_1인지 확인
    const activePage = pagenation?.activePage;
    if (!activePage || !activePage.classList.contains("page_1")) {
      return; // page_1이 아니면 실행 중단
    }

    // const probelm2 = document.querySelector(".page.page_1"); // 기존 코드 대신 activePage 사용
    const probelm2 = activePage;
    if (!probelm2) return;

    const mathFields = probelm2.querySelectorAll(".problem2 math-field");

    function checkDuplicates() {
      const values = [];
      mathFields.forEach((field) => {
        field.classList.remove("duplicate");
        const value = field.value.trim();
        if (value !== "") {
          if (values.includes(value)) {
            field.classList.add("duplicate");
          } else {
            values.push(value);
          }
        }
      });
    }

    mathFields.forEach((field) => {
      field.addEventListener("input", checkDuplicates);
    });
  }

  setupDuplicateAnswerCheck1();
  setupDuplicateAnswerCheck2();

  // 커스텀 채점 대상 추가
  window.getCustomTargets = function (page) {
    // getCustomTargets는 btn_act.js의 checkAnswers에서 호출 시 page_1 요소만 찾으므로,
    // 여기서는 페이지 검사를 추가할 필요가 없습니다.
    return $(page).find(".page_1 .multi_input_wrap math-field");
  };

  // 커스텀 정답 조건
  window.customCheckCondition = function (el) {
    // 현재 페이지가 page_1이 아니면 실행하지 않음
    const activePage = pagenation?.activePage; // 안전 호출 사용
    if (!activePage || !activePage.classList.contains("page_1")) {
      // page_1이 아닌 경우, 기본 채점 로직에 영향을 주지 않도록 undefined 반환
      return false; 
    }

    // 이곳에 체크버튼을 클릭했을때 실행할 커스텀 채점 로직을 작성합니다.
    // 체크버튼 클릭시 실행되는 함수입니다.
    // return true 반환하면 정답 처리 됩니다.
    // return false 반환하면 오답 처리 됩니다.
    // return "empty" 반환하면 비어있는 경우 처리(풀이 독려 토스트 메시지 발생)됩니다.

    // ex) 숫자 입력창에 값이 1이상이면 정답 처리, 1이하이면 오답 처리, 비어있으면 풀이 독려 토스트 메시지(기본값) 발생
    const $el = $(el); //채점 대상 추가에서 추가한 요소를 가져옵니다.
    const rule = $el.data("answerMulti"); //채점 대상 추가에서 추가한 요소의 data-answer-custom 속성을 가져옵니다.
    const val = $el.val(); //채점 대상 추가에서 추가한 요소의 값을 가져옵니다.

    if (el.classList[0] === "duplicate") {
      el.classList.add("hint");
      return false; //false 반환하면 오답 처리 됩니다.
    }

    // 조건 설정
    if (val === "" || val == null) return "empty"; // 비어있으면 empty 처리

    let num = val.match(/\d+/); // 숫자 패턴 찾기
    if (num) {
      let numberOnly = num[0]; // "5"
      let number = parseInt(numberOnly, 10); // 5
      // console.log("숫자만:", number); // 출력: 숫자만: 5
    } else {
      // console.log("숫자가 포함되어 있지 않습니다.");
      return "empty";
    }

    if (isNaN(num)) return "empty"; // empty 반환하면 비어있는 경우 처리 됩니다.

    if (rule.values !== num || el.classList[0] === "duplicate") {
      return false; //false 반환하면 오답 처리 됩니다.
    }

    return true; //true 반환하면 정답 처리 됩니다.
  };

  // 오답 시 추가 동작
  window.onIncorrectCustom = function () {
    const activePage = pagenation?.activePage; // 안전 호출 사용
    if (!activePage || !activePage.classList.contains("page_1")) {
      return;
    }
    $(activePage).find(".input_wrap math-field.hint.duplicate .text_hint").css("opacity", "1");
  };

  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    const activePage = pagenation?.activePage; // 안전 호출 사용
    if (!activePage || !activePage.classList.contains("page_1")) {
      return;
    }
    $(activePage).find(".input_wrap math-field.hint.duplicate + .text_hint").css("opacity", "1");
    $(activePage).find(".input_wrap math-field.hint + .text_hint").css("opacity", "1");
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    const activePage = pagenation?.activePage; // 안전 호출 사용
    if (!activePage || !activePage.classList.contains("page_1")) {
      return;
    }
    $(activePage).find("math-field.duplicate").removeClass("duplicate");
    $(activePage).find(".input_wrap math-field + .text_hint").css("opacity", "0");
  };
});
