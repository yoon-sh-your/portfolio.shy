document.addEventListener("DOMContentLoaded", function () {
  const selects = document.querySelectorAll(".custom_dropdown");
  //const checkBtn = document.querySelector(".btnCheck");
  const resetBtn = document.querySelector(".btnReset");
  let isResetting = false; // 리셋 중 플래그

  document.querySelectorAll('.img_box').forEach(box => {
    const answer = (box.getAttribute("data-answer-single") || "").trim().toLowerCase();
    const pair = (box.getAttribute("data-color-pair") || "").trim().toLowerCase();
    
    box.setAttribute("data-initial-answer", answer); // 기존 코드
    box.setAttribute("data-initial-answer-pair", pair); // 🔥 추가: pair 초기값 저장
  });
  
  
  document.querySelectorAll('.custom_select.math_symbol .select_options li').forEach(li => {
    li.addEventListener('click', function () {
      const value = li.getAttribute('data-value');
      const wrapper = li.closest('.dropdown_wrap');
      const select = wrapper?.querySelector('select.custom_dropdown.math_symbol');
  
      if (!select) return;
  
      // ✅ 핵심: select 동기화
      select.value = value;
      select.setAttribute("data-color", value);
      select.setAttribute("data-color-select", value);
      select.setAttribute("data-answer-single", value);    // 🔥 핵심 포인트
      select.setAttribute("data-correction", "true");
  
      // ✅ 평가 로직 트리거
      const evt = new Event("change", { bubbles: true });
      select.dispatchEvent(evt);
    });
  });
    
  document.querySelectorAll('select.custom_dropdown.math_symbol').forEach((el, i) => {
    console.log(`🔍 [select ${i+1}]`, {
      value: el.value,
      color: el.getAttribute('data-color'),
      answer: el.getAttribute('data-answer-single'),
      correction: el.getAttribute('data-correction'),
    });
  });

  function evaluateAllCorrections() {
    const allTargets = Array.from(document.querySelectorAll('.img_box, .custom_dropdown.math_symbol'));
    
    const grouped = {}; // 그룹핑
  
    allTargets.forEach(el => {
      const pair = (el.getAttribute("data-color-pair") || "").trim();
      if (!pair) return;
  
      if (!grouped[pair]) grouped[pair] = [];
      grouped[pair].push(el);
    });
  
    Object.entries(grouped).forEach(([pair, group]) => {
      let correction = "false";
  
      if (pair === "empty_answer") {
        // ✅ empty_answer는 개별로 판단
        group.forEach(el => {
          const selected = (el.getAttribute("data-color-select") || "").trim();
          const thisCorrection = selected === "" ? "true" : "false";
  
          el.setAttribute("data-correction", thisCorrection);
  
          const tag = el.tagName.toLowerCase();
          if (tag !== "select") {
            const select = el.querySelector("select.custom_dropdown.math_symbol");
            if (select) {
              select.setAttribute("data-correction", thisCorrection);
            }
          }
  
          console.log(`[empty_answer개별] correction = ${thisCorrection}`, el);
        });
  
      } else {
        // ✅ 일반 그룹은 전체 색이 같으면 true
        const selectedColors = group.map(el => (el.getAttribute("data-color-select") || "").trim());
        const hasEmpty = selectedColors.some(color => color === "");
  
        const allSameColor = selectedColors.every(color => color && color === selectedColors[0]);
        correction = (!hasEmpty && allSameColor) ? "true" : "false";
  
        group.forEach(el => {
          el.setAttribute("data-correction", correction);
  
          const tag = el.tagName.toLowerCase();
          if (tag !== "select") {
            const select = el.querySelector("select.custom_dropdown.math_symbol");
            if (select) {
              select.setAttribute("data-correction", correction);
            }
          }
  
          console.log(`[group: ${pair}] correction = ${correction}`, el);
        });
      }
    });
  }
  
  
  
  function updateAnswerSingleIfValid() {
    const pairs = new Set();
  
    document.querySelectorAll(".img_box, .custom_dropdown.math_symbol").forEach(el => {
      const pair = el.getAttribute("data-color-pair");
      if (pair) pairs.add(pair);
    });
  
    pairs.forEach(pair => {
      const group = Array.from(document.querySelectorAll(
        `.img_box[data-color-pair="${pair}"], .custom_dropdown.math_symbol[data-color-pair="${pair}"]`
      ));
  
      const allSameColor = group.every(el =>
        el.getAttribute("data-color-select") &&
        el.getAttribute("data-color-select") === group[0].getAttribute("data-color-select")
      );
  
      const allCorrect = group.every(el =>
        el.getAttribute("data-correction") === "true"
      );
  
      if (group.length > 0 && allSameColor && allCorrect) {
        group.forEach(el => {
          const current = el.getAttribute("data-answer-single");
          const selected = el.getAttribute("data-color-select");
  
          if (selected) {
            if (current !== selected) {
              el.setAttribute("data-answer-single", selected);
            }
  
            el.setAttribute("data-correction", "true");
  
            if (el.tagName.toLowerCase() !== "select") {
              const select = el.querySelector("select.custom_dropdown.math_symbol");
              if (select) {
                select.setAttribute("data-answer-single", selected);
                select.setAttribute("data-correction", "true");
              }
            }
          }
        });
      }
    });
  }
  
  

  // ✅ img_box 클릭시 selected + data-color-select 설정
  document.querySelectorAll(".page.on .img_box").forEach(box => {
    box.classList.remove("selected", "sample", "correct", "wrong", "hint");
    box.removeAttribute("data-correction");
  
    const initial = box.getAttribute("data-initial-answer") || "empty_answer";
    box.setAttribute("data-answer-single", initial);
  });

  document.querySelectorAll('.custom_select.math_symbol .select_options li').forEach(li => {
    li.addEventListener('click', function () {
      const value = li.getAttribute('data-value');
      const wrapper = li.closest('.dropdown_wrap');
      const select = wrapper.querySelector('select.custom_dropdown.math_symbol');
  
      if (!select) return;
  
      // ✅ 선택한 값을 <select> 요소에도 반영
      select.value = value;
      select.setAttribute("data-color", value);
      select.setAttribute("data-color-select", value);
  
      // ✅ "change" 이벤트 강제 발생
      const changeEvent = new Event('change', { bubbles: true });
      select.dispatchEvent(changeEvent);
    });
  });
  

  // ✅ select 변경 시 data-color, data-correction, selected 값 설정
  selects.forEach(select => {
    select.addEventListener("change", function () {
      if (window.isResetting || this.dataset.silentReset === "true") {
        this.dataset.silentReset = "";
        return;
      }
    
      const box = this.closest(".img_box") || this;
      const selectedColor = this.value || "";
    
      box.setAttribute("data-color", selectedColor);
      box.setAttribute("data-color-select", selectedColor);
      box.classList.add("selected");
    
      // ✅ 항상 최신 상태 반영
      evaluateAllCorrections();
      updateAnswerSingleIfValid();
    });        
  });

  document.querySelector(".btnCheck").addEventListener("click", function () {
    const boxes = document.querySelectorAll(".img_box");
    
    const allCorrect = [...boxes].every(box => {
      const answer = (box.getAttribute("data-answer-single") || "").trim().toLowerCase();
      const selected = (box.getAttribute("data-color-select") || "").trim().toLowerCase();
      const correction = box.getAttribute("data-correction");
      const pair = (box.getAttribute("data-color-pair") || "").trim().toLowerCase();
      const initialPair = (box.getAttribute("data-initial-answer-pair") || pair).trim().toLowerCase();
    
      let isPairCorrect = true;
      if (pair !== "empty_answer" && initialPair !== "empty_answer") {
        isPairCorrect = pair === initialPair;
      }
    
      const isCorrect =
        correction === "true" &&
        selected === answer &&
        isPairCorrect;  // 🔥 추가 : pair 비교도 포함
    
      console.log(`[${box.className}]`, {
        answer,
        selected,
        correction,
        pair,
        initialPair,
        isPairCorrect,
        isCorrect
      });
    
      return isCorrect;
    });
  
    if (allCorrect) {
      console.log("✅ 전체 정답");
      document.querySelector(".btnCheck").classList.add("success");
    } else {
      console.log("❌ 오답 있음");
      document.querySelector(".btnCheck").classList.add("wrong");
    }
  });
  
  
  // ✅ reset 버튼 이벤트 (전역에서 실행)
  resetBtn.addEventListener("click", function () {
    if (typeof window.resetCustom === "function") {
      window.resetCustom();
      window.forceWatchEvaluation();
    }
  });
});


 // ✅ runAfterAppReady 내에 resetCustom 정의
 runAfterAppReady(() => {
  window.resetCustom = function () {
    window.isResetting = true;
  
    const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");
    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) {
      console.warn("❌ 현재 페이지 없음");
      return;
    }
  
    currentPage.querySelectorAll(".img_box").forEach(box => {
      box.classList.remove("selected", "correct", "wrong", "sample");
      box.removeAttribute("data-correction");
      box.removeAttribute("data-color");
      box.removeAttribute("data-color-select");
  
      const init = box.getAttribute("data-initial-answer") || "empty_answer";
      box.setAttribute("data-answer-single", init);
  
      const select = box.querySelector("select");
      if (select) {
        select.dataset.silentReset = "true";
        select.value = "";
        select.removeAttribute("data-correction");
        select.removeAttribute("data-color");
        select.removeAttribute("data-color-select");
      }
    });
  
    // ✅ 현재 페이지 안에 있는 버튼만 초기화
    currentPage.querySelector(".btnCheck")?.classList.remove("success", "wrong");
  
    window.isResetting = false;
    window.forceWatchEvaluation();
  };
  
  
  
  
  
  defineButtonClassRules([
    {
      selector: ".check_shape_wrap .img_box", //변경될 값을 감지할 태그 설정
      //아래 중 하나 활용
      //key: "check_target", // 공통 버튼과 똑같이 결정되는 활성화 여부 결정 키
      //key: "custom_reset_btn_active", // 리셋버튼 활성화 여부 결정 키
      //key: "custom_sample_btn_active", // 예시버튼 활성화 여부 결정 키
      key: "custom_check_btn_active", // 확인버튼 활성화 여부 결정 키
      //key: "custom_submit_btn_active", // 제출버튼 활성화 여부 결정 키
      test: (el) => {
        //활성화 여부 결정 로직 true 반환하면 버튼 활성화, false 반환하면 비활성화
        //el은 타겟을 의미하는 요소
        //ex) 값이 비어있거나 null인 경우로 조건 설정한 경우 예시
        const isCorrection = $(el).attr("data-correction") !== undefined;
        return isCorrection;
      }
    },
  ]);
  
});
