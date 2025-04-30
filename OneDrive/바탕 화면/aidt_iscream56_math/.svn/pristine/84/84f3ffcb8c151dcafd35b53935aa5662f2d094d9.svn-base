document.addEventListener("DOMContentLoaded", function () {
  const selects = document.querySelectorAll(".custom_dropdown");
  const checkBtn = document.querySelector(".btnSample");
  const resetBtn = document.querySelector(".btnReset");
  let isResetting = false; // 리셋 중 플래그

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        console.warn("🔴 btnSample 클래스 변경됨:", checkBtn.classList.value);
      }
    }
  });
  
  observer.observe(checkBtn, { attributes: true });
  

  // ✅ img_box 클릭시 selected + data-color-select 설정
  document.querySelectorAll('.img_box').forEach(box => {
    box.addEventListener("click", function () {
      if (window.isResetting) return; // 리셋 중 클릭 방지
      this.classList.add("selected");
    
      let selectedColor = "";
      const select = this.querySelector("select");
      if (select) selectedColor = select.value || "";
      this.setAttribute("data-color-select", selectedColor);
    });
    
    

    // ✅ 초기 answer-single 값 저장
    const initialAnswer = box.getAttribute("data-answer-single") || "";
    box.setAttribute("data-initial-answer", initialAnswer);
  });

  // ✅ select 변경 시 data-color, data-correction, selected 값 설정
  selects.forEach(select => {
    select.addEventListener("change", function () {
      if (isResetting) return;

      checkBtn.classList.add("active");
      resetBtn.classList.add("active");

      const parentBox = this.closest(".img_box");
      const selectedColor = this.value;

      parentBox.setAttribute("data-color", selectedColor);
      this.setAttribute("data-color", selectedColor);
      parentBox.classList.add("selected");
      parentBox.setAttribute("data-color-select", selectedColor);

      const answer = parentBox.getAttribute("data-answer-single");
      const pairKey = parentBox.getAttribute("data-color-pair");
      const allBoxes = Array.from(document.querySelectorAll(".img_box"));

      let correction = "false";

      if (answer === "empty_answer") {
        correction = selectedColor === "" ? "true" : "false";
      } else if (selectedColor !== "") {
        const pairBox = allBoxes.find(box =>
          box !== parentBox &&
          box.getAttribute("data-answer-single") === answer &&
          box.getAttribute("data-color-pair") === pairKey
        );

        const pairColor = pairBox?.getAttribute("data-color");

        if (pairBox && pairColor === selectedColor) {
          correction = "true";
          pairBox.setAttribute("data-correction", "true");
        } else {
          correction = "false";
          if (pairBox) pairBox.setAttribute("data-correction", "false");
        }
      }

      parentBox.setAttribute("data-correction", correction);
      this.setAttribute("data-correction", correction);

      // ✅ 실시간으로 answer-single 자동 업데이트
      const colorSelect = parentBox.getAttribute("data-color-select");
      const color = parentBox.getAttribute("data-color");
      const pair = parentBox.getAttribute("data-color-pair");
      if (colorSelect && color && pair && colorSelect === color) {
        const matched = Array.from(document.querySelectorAll(`.img_box[data-color-pair="${pair}"]`))
          .every(box => box.getAttribute("data-color-select") === color && box.getAttribute("data-color") === color);

        if (matched) {
          const relatedBoxes = document.querySelectorAll(`.img_box[data-color-pair="${pair}"]`);
          relatedBoxes.forEach(box => {
            box.setAttribute("data-answer-single", color);
          });
        }
      }
    });
  });

  checkBtn.addEventListener("click", function () {
    const boxes = document.querySelectorAll(".img_box");
    const resetBtn = document.querySelector(".btnReset");

    const isShowingSample = [...boxes].some(box => box.classList.contains("sample"));
  
    setTimeout(() => {
      // 100ms 후에도 class 유지 강제 재설정
      const expectedClass = isShowingSample ? "btnSample active" : "btnSample close";
      checkBtn.className = expectedClass;
    }, 50);
  
    // 먼저 클래스 제거
    checkBtn.classList.remove("active", "close");
  
    if (isShowingSample) {
      // sample이 보이는 상태였다면 제거 → active 상태
      checkBtn.classList.add("active");
      boxes.forEach(box => box.classList.remove("sample"));
  
      // ✅ close가 제거되었으므로 resetBtn에 active 추가
      resetBtn.classList.add("active");
    } else {
      // sample이 없었으면 추가 → close 상태
      checkBtn.classList.add("close");
      boxes.forEach(box => box.classList.add("sample"));
  
      // ✅ close 상태일 때 resetBtn에 active 제거
      resetBtn.classList.remove("active");
    }
  
    //console.log("📌 현재 checkBtn classList:", checkBtn.classList.value);
  });
  
  

  // ✅ reset 버튼 이벤트 (전역에서 실행)
  resetBtn.addEventListener("click", function () {
    if (typeof window.resetCustom === "function") {
      window.resetCustom();
    }
  });
});

 // ✅ runAfterAppReady 내에 resetCustom 정의
 runAfterAppReady(() => {
  window.resetCustom = function () {
    window.isResetting = true;

    // ✅ 버튼 비활성화
    document.querySelectorAll("button").forEach(btn => {
      btn.classList.remove("active", "close");
    });
  
    // ✅ 모든 img_box 상태 초기화
    document.querySelectorAll(".img_box").forEach(box => {
      box.classList.remove("selected", "sample", "correct", "wrong");
  
      // data-* 속성 정리
      const preserved = ["data-initial-answer", "data-color-pair"];
      [...box.attributes].forEach(attr => {
        if (attr.name.startsWith("data-") && !preserved.includes(attr.name)) {
          box.removeAttribute(attr.name);
        }
      });
  
      // answer 복원
      const initialAnswer = box.getAttribute("data-initial-answer") || "";
      box.setAttribute("data-answer-single", initialAnswer);
  
      // select 초기화
      const select = box.querySelector("select");
      if (select) {
        select.value = "";
  
        // 속성 정리
        [...select.attributes].forEach(attr => {
          if (attr.name.startsWith("data-")) {
            select.removeAttribute(attr.name);
          }
        });
      }
  
      // stroke 초기화
      const path = box.querySelector("svg path");
      if (path) path.setAttribute("stroke", "#1D1D1B");
    });

    document.querySelector(".btnSample")?.classList.remove("active", "close");
    document.querySelector(".btnReset")?.classList.remove("active");
    document.querySelector(".btnCheck")?.classList.remove("active");
  
  
    // ✅ 콘솔 디버깅
    document.querySelectorAll('.img_box').forEach((box, i) => {
      console.log(`Box ${i + 1}`, {
        classList: box.className,
        correction: box.getAttribute("data-correction")
      });
    });

    // ✅ 버튼 상태 다시 강제 제거
  setTimeout(() => {
    document.querySelectorAll("button").forEach(btn => {
      btn.classList.remove("active", "close");
    });
  }, 50);

  window.isResetting = false;
  };
  
});
