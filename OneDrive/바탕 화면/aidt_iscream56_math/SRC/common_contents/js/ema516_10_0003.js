document.addEventListener("DOMContentLoaded", function () {
  function checkPage() {
    let isPage4Visible = document.querySelector(".page_3")?.offsetParent !== null;

    // 페이지별 대발문 및 버튼 숨김
    document.querySelector(".title.type2").style.display = isPage4Visible ? "none" : "block";
  }

  // 페이지 변경 이벤트가 있을 때마다 실행 (예: 버튼 클릭)
  document.addEventListener("click", checkPage);

  // 초기 상태 체크 (페이지가 로드되었을 때 바로 체크)
  checkPage();
});

function isCurrentPage(pageClass) {
  const currentPage = pagenation?.activePage;
  return currentPage && currentPage.classList.contains(pageClass) ? currentPage : null;
}

runAfterAppReady(() => {
  // 커스텀 채점 대상 추가
  window.getCustomTargets = function (page) {
    return $(page).find(".triangle");
  };

  // 정답 조건 정의
  window.customCheckCondition = function (el) {
    // 현재 활성 페이지
    const currentPage = isCurrentPage("page_1");
    if (!currentPage) return false;

    const $el = $(el);
    const bottom = $el.find(".line.bottom").hasClass("active");
    const left = $el.find(".line.left").hasClass("active");
    const right = $el.find(".line.right").hasClass("active");

    const hasAny = bottom || left || right;
    if (!hasAny) return "empty";

    if ((bottom && !left && !right) || (!bottom && left && !right) || (!bottom && !left && right)) {
      return true;
    }
    return false;
  };

  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    const currentPage = isCurrentPage("page_1");
    if (!currentPage) return;

    currentPage.querySelectorAll(".triangle").forEach((el) => {
      el.classList.add("hidden");
    });

    currentPage.querySelectorAll(".answer_img").forEach((img) => {
      img.classList.add("active");
    });
  };

  // 정답 시 추가 동작
  window.onCorrectCustom = function () {
    const currentPage = isCurrentPage("page_1");
    if (!currentPage) return;

    currentPage.querySelectorAll(".triangle").forEach((el) => {
      el.classList.add("hidden");
    });

    currentPage.querySelectorAll(".answer_img").forEach((img) => {
      img.classList.add("active");
    });
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    const currentPage = isCurrentPage("page_1");
    if (!currentPage) return;

    $(currentPage).find(".triangle").removeClass("hidden");
    $(currentPage).find(".answer_img").removeClass("active");
    $(currentPage).find(".triangle .line").removeClass("active");
  };

  // page_2: 제출 버튼 클릭 시 정답 처리
  window.onCorrectCustomPage2 = function () {
    const currentPage = isCurrentPage("page_2");
    if (!currentPage) return;

    // canvas 초기화
    const canvas = document.querySelector(".draw-area");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const drawCanvas = currentPage.querySelector(".draw-area");
    if (drawCanvas) {
      const canvasContainer = drawCanvas.closest(".canvas-container");
      if (canvasContainer) {
        canvasContainer.style.pointerEvents = "none";
      }
    }
    const drawTool = document.querySelector(".draw-tool-wrap");
    if (drawTool) drawTool.classList.remove("show");

    // triangle 숨기기
    currentPage.querySelectorAll(".triangle").forEach((el) => {
      el.classList.add("hidden");
    });

    // 정답 이미지 보이기
    currentPage.querySelectorAll(".answer_img").forEach((img) => {
      img.classList.add("active");
    });
  };

  // page_2: 리셋 처리
  window.resetCustomPage2 = function () {
    const currentPage = isCurrentPage("page_2");
    if (!currentPage) return;

    // 정답 이미지 숨기기
    currentPage.querySelectorAll(".answer_img").forEach((img) => {
      img?.classList.remove("active");
    });

    // triangle 보이기
    currentPage.querySelectorAll(".triangle").forEach((el) => {
      el.classList.remove("hidden");
    });
  };

  // 버튼 활성화 패턴 적용
  defineButtonClassRules([
    {
      selector: ".triangle .line, .answer_img",
      key: "custom_check_btn_active",
      test: (el) => {
        const val = $(el).closest(".triangle").find(".line.active");
        const activeImg = $(el).closest(".parallelogram").find(".answer_img.active");
        const hasAnyActive = val.length > 0;
        const hasAnyActiveImg = activeImg.length > 0;
        if (hasAnyActive || hasAnyActiveImg) {
          return true; // 버튼 활성화
        } else {
          return false; // 버튼 비활성화
        }
      },
    },
  ]);

  $(document).on("click", ".triangle .line", function (e) {
    e.stopPropagation();
    $(this).toggleClass("active");
    window.forceWatchEvaluation();
  });

  // 제출 버튼 클릭 시 page_2 전용 로직 실행
  document.querySelectorAll(".btnSubmit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentPage = pagenation?.activePage;
      if (currentPage?.classList.contains("page_2")) {
        window.onCorrectCustomPage2();
      }
    });
  });

  // 리셋 버튼 클릭 시 page_2 전용 리셋 로직 실행
  document.querySelectorAll(".btnReset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentPage = pagenation?.activePage;
      if (currentPage?.classList.contains("page_2")) {
        window.resetCustomPage2();
      }
    });
  });
});
