document.addEventListener("DOMContentLoaded", function () {
  function checkPage() {
    let isPage4Visible = document.querySelector(".page_4")?.offsetParent !== null;

    // 페이지별 대발문 및 버튼 숨김
    document.querySelector(".title.type2").style.display = isPage4Visible ? "none" : "block";
  }

  // 페이지 변경 이벤트가 있을 때마다 실행 (예: 버튼 클릭)
  document.addEventListener("click", checkPage);

  // 초기 상태 체크 (페이지가 로드되었을 때 바로 체크)
  checkPage();
});

document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");

  // 도형별 드롭 횟수
  let dropCounts = {};

  // 드래그 시작
  draggables.forEach((drag) => {
    drag.setAttribute("draggable", "true");

    drag.addEventListener("dragstart", (e) => {
      if (drag.classList.contains("disabled")) {
        e.preventDefault(); // 비활성 도형은 드래그 못함
        return;
      }
      e.dataTransfer.setData("text/plain", drag.classList[1]);
      console.log("드래그 시작:", drag.classList[1]);
    });
  });

  // 드롭 영역 처리
  droppables.forEach((dropZone) => {
    dropZone.addEventListener("dragover", (e) => e.preventDefault());

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedClass = e.dataTransfer.getData("text/plain");
      const dragged = document.querySelector(`.${draggedClass}`);

      // 도형당 최대 2회 드롭 제한
      if (!dropCounts[draggedClass]) dropCounts[draggedClass] = 0;

      if (dropCounts[draggedClass] < 2) {
        const clone = dragged.cloneNode(true);
        clone.classList.add("dropped");
        clone.setAttribute("draggable", "false");
        dropZone.appendChild(clone);

        dropCounts[draggedClass] += 1;

        if (dropCounts[draggedClass] >= 2) {
          dragged.classList.add("disabled"); // 회색처리
          dragged.style.opacity = "0.9";
          dragged.style.pointerEvents = "none"; // 클릭/드래그 안되게
        }
      }
    });
  });
});

// 1. 선택 버튼 중복 선택 방지 로직
const booleanButtons = document.querySelectorAll(".boolean1, .boolean2");
booleanButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.stopImmediatePropagation();
    booleanButtons.forEach((btn) => btn.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// boolean 버튼 개별 처리
window.onCustomIncorrect = function (count) {
  if (count > 1) {
    document.querySelectorAll(".boolean_wrap > button").forEach((button) => {
      const isTrueAnswer = button.dataset.answerSingle === "true";
      // console.log(page, button.dataset.answerSingle);
      if (isTrueAnswer) {
        button.classList.add("hint");
      } else {
        button.classList.remove("hint", "selected");
      }
    });
  }
};

// 초기화 함수
function resetAll() {
  // 드롭된 요소 제거
  document.querySelectorAll(".droppable .dropped").forEach((el) => el.remove());

  // 원본 도형 상태 복구
  document.querySelectorAll(".draggable").forEach((el) => {
    el.classList.remove("disabled");
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
  });

  // 드롭 카운트 초기화
  dropCounts = {};
}

runAfterAppReady(() => {
  window.resetCustom = function () {
    resetAll();
  };

  defineButtonClassRules([
    {
      selector: ".droppable1, .droppable2, .textarea",
      key: "custom_check_btn_active",
      test: (el) => {
        const ids = $(el)
          .find(".dropped")
          .map(function () {
            return $(this).attr("class").split(" ")[1];
          })
          .get();

        const value = el.getValue?.("plain-text") || el.textContent || el.value || "";

        return ids.length > 0 || value.trim() !== "";
      },
    },
  ]);

  // 이미지 선택
  document.addEventListener("click", (e) => {
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_3")) return;

    const clickedEl = e.target.closest(".ractangle_1, .ractangle_2, .circle_1");
    const parentWrap = e.target.closest(".img_wrap");

    if (parentWrap && clickedEl) {
      parentWrap.querySelectorAll(".ractangle_1, .ractangle_2, .circle_1").forEach((el) => {
        el.classList.remove("active");
      });

      clickedEl.classList.add("active");
    }
  });

  // page_3: 정답 처리
  window.onCorrectCustomPage3 = function () {
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_3")) return;

    // 정답 이미지 보이기
    currentPage.querySelectorAll(".example_box").forEach((img) => {
      img.classList.add("on");
    });
  };

  document.querySelectorAll(".btnCheck").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentPage = pagenation?.activePage;
      if (currentPage?.classList.contains("page_3")) {
        window.onCorrectCustomPage3();
      }
    });
  });
});


