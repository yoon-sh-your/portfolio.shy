// 드래그 앤 드롭 기능
let dragCounts = { piece1: 0, piece2: 0 };
document.addEventListener("DOMContentLoaded", () => {
  const orgtriangle = document.querySelector(".peace_orgtriangle");
  const piece1 = document.querySelector(".peace_img1");
  const piece2 = document.querySelector(".peace_img2");
  const dropArea = document.querySelector(".drop_area");

  const isTouchDevice = () => "ontouchstart" in window;

  orgtriangle.addEventListener("click", () => {
    orgtriangle.classList.add("hidden");
    piece1.classList.remove("hidden");
    piece1.classList.add("cutting");
    piece2.classList.remove("hidden");
    piece2.classList.add("cutting");
  });

  // 드롭 처리 함수
  const handleDrop = (id, clone) => {
    const existingPieces = [...dropArea.querySelectorAll(".draggable")];
    const existingIds = existingPieces.map((piece) => piece.dataset.id);

    const hasPiece1 = existingIds.includes("piece1");
    const hasPiece2 = existingIds.includes("piece2");

    if (dragCounts[id] >= 2) {
      toastCheckMsg("이 조각은 더 이상 사용할 수 없습니다!", 4, false);
      clone.remove();
      return;
    }

    if (existingIds.length === 1 && existingIds.includes(id)) {
      toastCheckMsg("이미 선택한 조각입니다. 다른 조각을 선택하세요!", 4, false);
      clone.remove();
      return;
    }

    if (hasPiece1 && hasPiece2 && existingIds.includes(id)) {
      dropArea.innerHTML = "";
    }

    dragCounts[id] = (dragCounts[id] || 0) + 1;

    if (dragCounts[id] === 2) {
      const original = id === "piece1" ? piece1 : piece2;
      original.classList.add("inactive");
    }

    dropArea.appendChild(clone);
    enableDragWithinDropArea(clone);
    bindRotationHandle(clone);

    $(".btnReset").addClass("active");
    window.forceWatchEvaluation();
  };

  [piece1, piece2].forEach((piece, index) => {
    const id = `piece${index + 1}`;
    const startEvent = isTouchDevice() ? "touchstart" : "mousedown";

    piece.addEventListener(startEvent, (e) => {
      if (dragCounts[id] >= 2) {
        toastCheckMsg("이 조각은 더 이상 사용할 수 없습니다!", 4, false);
        return;
      }
      e.preventDefault();

      const originalEvent = isTouchDevice() ? e.touches[0] : e;

      const clone = piece.cloneNode(true);
      clone.classList.add("draggable");
      clone.dataset.id = id;
      clone.dataset.rotation = "0";
      clone.style.position = "absolute";
      clone.style.left = `${originalEvent.pageX}px`;
      clone.style.top = `${originalEvent.pageY}px`;
      clone.classList.remove("cutting");
      clone.innerHTML += `<button class="handle" style="background-color: transparent;"></button>`;
      document.body.appendChild(clone);

      const shiftX = isTouchDevice() ? clone.offsetWidth / 2 : originalEvent.offsetX;
      const shiftY = isTouchDevice() ? clone.offsetHeight / 2 : originalEvent.offsetY;

      const move = (ev) => {
        const clientX = isTouchDevice() ? ev.touches[0].clientX : ev.clientX;
        const clientY = isTouchDevice() ? ev.touches[0].clientY : ev.clientY;
        clone.style.left = `${clientX - shiftX}px`;
        clone.style.top = `${clientY - shiftY}px`;
      };

      const end = (ev) => {
        document.removeEventListener(isTouchDevice() ? "touchmove" : "mousemove", move);
        document.removeEventListener(isTouchDevice() ? "touchend" : "mouseup", end);

        const clientX = isTouchDevice() ? ev.changedTouches[0].clientX : ev.clientX;
        const clientY = isTouchDevice() ? ev.changedTouches[0].clientY : ev.clientY;

        const dropRect = dropArea.getBoundingClientRect();
        if (
          clientX >= dropRect.left &&
          clientX <= dropRect.right &&
          clientY >= dropRect.top &&
          clientY <= dropRect.bottom
        ) {
          const x = clientX - dropRect.left - shiftX;
          const y = clientY - dropRect.top - shiftY;

          const snappedX = Math.round(x / 20) * 20;
          const snappedY = Math.round(y / 20) * 20;

          clone.style.left = `${snappedX}px`;
          clone.style.top = `${snappedY}px`;
          clone.style.pointerEvents = "auto";
          handleDrop(id, clone);
        } else {
          clone.remove();
        }
      };

      document.addEventListener(isTouchDevice() ? "touchmove" : "mousemove", move);
      document.addEventListener(isTouchDevice() ? "touchend" : "mouseup", end);
    });
  });

  function enableDragWithinDropArea(elem) {
    const startEvt = isTouchDevice() ? "touchstart" : "mousedown";
    const moveEvt = isTouchDevice() ? "touchmove" : "mousemove";
    const endEvt = isTouchDevice() ? "touchend" : "mouseup";

    elem.addEventListener(startEvt, (e) => {
      if (e.target.classList.contains("handle")) return;
      e.preventDefault();

      const original = isTouchDevice() ? e.touches[0] : e;
      const startX = original.clientX;
      const startY = original.clientY;

      const elemRect = elem.getBoundingClientRect();
      const dropRect = dropArea.getBoundingClientRect();
      const offsetX = startX - elemRect.left;
      const offsetY = startY - elemRect.top;

      const move = (ev) => {
        const moveX = isTouchDevice() ? ev.touches[0].clientX : ev.clientX;
        const moveY = isTouchDevice() ? ev.touches[0].clientY : ev.clientY;

        let newX = moveX - dropRect.left - offsetX;
        let newY = moveY - dropRect.top - offsetY;

        newX = Math.max(0, Math.min(dropArea.clientWidth - elem.offsetWidth, newX));
        newY = Math.max(0, Math.min(dropArea.clientHeight - elem.offsetHeight, newY));

        elem.style.left = `${newX}px`;
        elem.style.top = `${newY}px`;
      };

      const up = () => {
        document.removeEventListener(moveEvt, move);
        document.removeEventListener(endEvt, up);
      };

      document.addEventListener(moveEvt, move);
      document.addEventListener(endEvt, up);
    });
  }

  function bindRotationHandle(clone) {
    const handle = clone.querySelector(".handle");
    if (!handle) return;

    const startEvt = isTouchDevice() ? "touchstart" : "mousedown";
    const moveEvt = isTouchDevice() ? "touchmove" : "mousemove";
    const endEvt = isTouchDevice() ? "touchend" : "mouseup";

    handle.addEventListener(startEvt, (e) => {
      e.preventDefault();
      e.stopPropagation();

      const clientX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
      const clientY = isTouchDevice() ? e.touches[0].clientY : e.clientY;

      const rect = clone.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const startAngle = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
      const initialRotation = parseFloat(clone.dataset.rotation || "0");

      const move = (ev) => {
        const moveX = isTouchDevice() ? ev.touches[0].clientX : ev.clientX;
        const moveY = isTouchDevice() ? ev.touches[0].clientY : ev.clientY;

        let rotation =
          initialRotation +
          (Math.atan2(moveY - center.y, moveX - center.x) * (180 / Math.PI) - startAngle);

        rotation = Math.round(rotation / 15) * 15;
        rotation = (rotation + 360) % 360;

        clone.style.transform = `rotate(${rotation}deg)`;
        clone.dataset.rotation = rotation;
      };

      const end = () => {
        document.removeEventListener(moveEvt, move);
        document.removeEventListener(endEvt, end);
      };

      document.addEventListener(moveEvt, move);
      document.addEventListener(endEvt, end);
    });
  }
});

function isCurrentPage(pageClass) {
  const currentPage = pagenation?.activePage;
  return currentPage && currentPage.classList.contains(pageClass) ? currentPage : null;
}

runAfterAppReady(() => {
  window.getCustomTargets = function (page) {
    return $(page).find(".drop_area .draggable");
  };

  // 정답 조건 정의
  window.customCheckCondition = function () {
    // 현재 활성 페이지
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_2")) return false;

    const droppedItems = $(".drop_area .draggable");

    if (droppedItems.length !== 2) return "empty";

    const ids = droppedItems.map((_, el) => el.dataset.id).get();
    const hasPiece1 = ids.includes("piece1");
    const hasPiece2 = ids.includes("piece2");

    if (!hasPiece1 && !hasPiece2) return "empty";

    const first = droppedItems[0];
    const second = droppedItems[1];

    const firstId = first.dataset.id;
    const secondId = second.dataset.id;
    const firstRot = parseInt(first.dataset.rotation || "0");
    const secondRot = parseInt(second.dataset.rotation || "0");
    const firstRect = first.getBoundingClientRect();
    const secondRect = second.getBoundingClientRect();

    const getCenter = (rect) => ({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    const c1 = getCenter(firstRect);
    const c2 = getCenter(secondRect);

    const distance = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
    const alignedHorizontally = Math.abs(firstRect.top - secondRect.top) <= 10;

    // 정답 조건
    const isCorrect =
      // 사다리꼴 두 개가 올바르게 배치되어 사각형을 형성하는 경우
      (((firstId === "piece1" && secondId === "piece2") ||
        (firstId === "piece2" && secondId === "piece1")) &&
        // 두 조각이 모두 0도 회전 상태에서 상하로 배치된 경우
        ((firstRot === 0 &&
          secondRot === 0 &&
          Math.abs(firstRect.bottom - secondRect.top) <= 10 &&
          alignedHorizontally) ||
          // 두 조각이 모두 180도 회전 상태에서 상하로 배치된 경우
          (firstRot === 180 &&
            secondRot === 180 &&
            Math.abs(firstRect.bottom - secondRect.top) <= 10 &&
            alignedHorizontally) ||
          // 두 조각이 모두 90도 회전 상태에서 좌우로 배치된 경우
          (firstRot === 90 &&
            secondRot === 90 &&
            Math.abs(firstRect.right - secondRect.left) <= 10) ||
          // 두 조각이 모두 270도 회전 상태에서 좌우로 배치된 경우
          (firstRot === 270 &&
            secondRot === 270 &&
            Math.abs(firstRect.right - secondRect.left) <= 10) ||
          // 두 조각이 90도와 270도 회전 상태에서 좌우로 배치된 경우
          (((firstRot === 90 && secondRot === 270) || (firstRot === 270 && secondRot === 90)) &&
            Math.abs(firstRect.right - secondRect.left) <= 10))) ||
      //  거리 조건
      distance <= 50;

    return isCorrect; // 정답이면 true, 아니면 false 반환
  };

  window.onEmptyCustom = function () {
    // 현재 활성 페이지
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_2")) return false;
    // 드롭 영역에 조각이 없을 때 처리
    const droppedItems = $(".drop_area .draggable");
    if (droppedItems.length === 0) {
      toastCheckMsg("조각을 먼저 배치해보세요.", 4, false);
      return;
    }
  };

  window.resetCustom = function () {
    // 현재 활성 페이지
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_2")) return false;

    // drop_area 초기화
    $(".drop_area").empty();

    // 드롭 횟수 초기화
    dragCounts = { piece1: 0, piece2: 0 };

    // 정답이미지 숨기기
    $(".example_box").removeClass("on");
    // 조각 상태 초기화
    $(".peace_img1, .peace_img2").removeClass("inactive");
    $(".peace_img1, .peace_img2").addClass("hidden");
    $(".peace_orgtriangle").removeClass("hidden");
    // 버튼 상태 초기화
    $(".btnReset").removeClass("active");
    $(".btnCheck").removeClass("active").prop("disabled", false);
    $(".btnSubmit").removeClass("active").prop("disabled", false);
  };

  // page_1: 제출 버튼 클릭시
  window.onCorrectCustomPage1 = function () {
    // 현재 활성 페이지
    const currentPage = isCurrentPage("page_1");
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

    currentPage.querySelectorAll(".diagram").forEach((el) => {
      el.classList.add("hidden");
    });
    // answer_img 보이기
    currentPage.querySelectorAll(".answer_img").forEach((img) => {
      img.classList.add("active");
    });
  };

  // page_1: 리셋 처리
  window.resetCustomPage1 = function () {
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_1")) return false;

    // 정답 이미지 숨기기
    currentPage.querySelectorAll(".answer_img").forEach((img) => {
      img?.classList.remove("active");
    });
    currentPage.querySelectorAll(".diagram").forEach((el) => {
      el.classList.remove("hidden");
    });
  };

  // 제출 버튼 클릭 시 _ page_2 전용 로직 실행
  window.onCorrectCustomPage2 = function () {
    // 현재 활성 페이지
    const currentPage = pagenation?.activePage;
    if (!currentPage || !currentPage.classList.contains("page_2")) return false;

    // 정답 이미지 보이기
    $(".answer_img").addClass("on");

    const btnHandels = $(".drop_area").find(".handle");
    btnHandels.each(function () {
      $(this).remove();
    });
    $(".drop_area .peace_img1, .drop_area .peace_img2").css("pointer-events", "none");

    // 드롭 횟수 초기화
    dragCounts = { piece1: 2, piece2: 2 };
    // 조각 상태 초기화
    $(".main_area .peace_img1, .main_area .peace_img2").addClass("inactive");
  };

  defineButtonClassRules([
    {
      selector: ".drop_area",
      key: "custom_submit_btn_active",
      test: (el) => {
        const ids = $(el)
          .find(".draggable")
          .map((_, el) => el.dataset.id)
          .get();
        return ids.length >= 1;
      },
    },
  ]);

  // window.forceWatchEvaluation();

  // 리셋 버튼 클릭 시 page_2
  document.querySelectorAll(".btnReset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentPage = pagenation?.activePage;
      if (currentPage?.classList.contains("page_1")) {
        window.resetCustomPage1();
      }
    });
  });

  // 제출 버튼 클릭 시 page_2
  document.querySelectorAll(".btnSubmit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentPage = pagenation?.activePage;
      if (currentPage?.classList.contains("page_2")) {
        window.onCorrectCustomPage2();
      }

      if (currentPage?.classList.contains("page_1")) {
        window.onCorrectCustomPage1();
      }
    });
  });
});
