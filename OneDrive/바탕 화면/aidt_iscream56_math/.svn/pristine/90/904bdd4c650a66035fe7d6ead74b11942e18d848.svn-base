runAfterAppReady(() => {
  console.log("custom_answer_check.js 실행");

  const pages = {
    page4: document.querySelector(".ema516_15_su_0003 .page_4"),
  };

  // 페이지에서 메시지 박스를 숨기는 함수
  function hideMessageBox(page) {
    const box = page.querySelector(".message_box");
    if (box) {
      box.style.display = "none"; // 메시지 박스를 아예 숨깁니다
    }
  }

  // 정답/오답 체크 조건
  function customCheckCondition(el, page) {
    const $el = $(el);
    const rule = $el.data("answerCustom");
    const val = $el.val();
    const num = parseFloat(val);

    // 빈 값 입력 시 메시지나 정답 체크를 하지 않음
    if (val === "" || val == null || isNaN(num)) {
      return false; // 빈 값이면 정답 체크 안함
    }

    // 정답 조건
    if (rule === "min-1") {
      return num >= 1; // 최소값 1 이상인지 체크
    }

    return true;
  }

  // 오답 처리
  function onIncorrectCustom(page) {
    const exampleBox = page.querySelector(".example_box");
    if (exampleBox) exampleBox.style.display = "none"; // 오답일 때 예시 박스 숨기기
  }

  // 두 번째 오답 처리
  function onIncorrectTwiceCustom(page) {
    const exampleBox = page.querySelector(".example_box");
    if (exampleBox) exampleBox.style.display = "block"; // 두 번째 오답일 때 예시 박스 보이기

    $(page)
      .find(".custom_check_target")
      .each(function () {
        const $input = $(this);
        const answer = $input.data("answer");
        if (answer !== undefined && answer !== null && answer !== "") {
          $input.val(answer); // 정답 설정
          $input.addClass("show-answer");
        }
      });
  }

  // 페이지 이벤트 바인딩
  function bindPageEvents(page) {
    if (!page) return;

    const checkButton = page.querySelector(".check_answer_button"); // 정답 체크 버튼
    if (checkButton) {
      checkButton.addEventListener("click", function () {
        // "문제를 풀어보세요!" 메시지를 숨기기
        hideMessageBox(page);

        // 각 input 값이 유효한지 체크하고, 정답/오답 처리
        let isValid = false;

        page.querySelectorAll("math-field").forEach((el) => {
          const result = customCheckCondition(el, page);
          if (result) {
            isValid = true;
            console.log("정답입니다.");
            onIncorrectCustom(page); // 정답 처리
          } else {
            isValid = false;
            console.log("오답입니다.");
            onIncorrectTwiceCustom(page); // 오답 처리
          }
        });

        // 메시지를 아예 숨기고 바로 정답/오답을 처리
        if (!isValid) {
          console.log("정답을 다시 확인하세요.");
        }
      });
    }
  }

  // 페이지 로드 시 메시지 박스 완전히 숨기기
  if (pages.page4) hideMessageBox(pages.page4);

  // 페이지 이벤트 바인딩
  if (pages.page4) bindPageEvents(pages.page4);

  let startX, startY, rect;
  const scale = globalScale || 1;
  let squareCount = 0;
  const btnReset = document.querySelector(".btn_area .btnReset");
  const btnCheck = document.querySelector(".btn_area .btnCheck");

  // 마우스와 터치 이벤트에 대응
  function getEventCoordinates(event) {
    // 터치 이벤트에서는 `touches` 배열을 사용하여 좌표를 가져옵니다.
    if (event.type.startsWith("touch")) {
      return {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      };
    }
    // 마우스 이벤트에서는 `pageX`, `pageY`를 사용합니다.
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }
  // 마우스를 클릭한 위치 저장
  $("#square").on("mousedown touchstart", function (event) {
    if (squareCount >= 3) {
      return; // 3개 이상이면 더 이상 생성하지 않음
    }

    $(this).data("scale", scale);

    const offset = $(this).offset();
    const coordinates = getEventCoordinates(event);

    startX = (coordinates.x - offset.left) / scale;
    startY = (coordinates.y - offset.top) / scale;

    console.log("Start Position:", startX, startY);

    // 새로운 사각형 생성
    rect = $('<div class="draggable-rect"></div>');
    $("#square").append(rect);

    // 드래그한 사각형 초기 위치 설정
    rect.css({
      left: startX,
      top: startY,
      width: 0,
      height: 0,
    });
    squareCount++;
    // 마우스 이동 시 크기 변화
    $(document).on("mousemove touchmove", function (event) {
      const coordinates = getEventCoordinates(event);

      let dragX = (coordinates.x - offset.left) / scale;
      let dragY = (coordinates.y - offset.top) / scale;

      let width = dragX - startX;
      let height = dragY - startY;

      if (squareCount >= 0) {
        btnCheck.classList.add("active");
      } else {
        btnCheck.classList.remove("active");
      }

      // 사각형 크기 설정
      rect.css({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width > 0 ? startX : dragX,
        top: height > 0 ? startY : dragY,
      });
    });

    // 마우스를 놓았을 때, 드래그 종료
    $(document).on("mouseup touchend", function () {
      $(".draggable-rect").addClass("complete");

      $(document).off("mousemove touchmove");
      $(document).off("mouseup touchend");
    });

    // Reset 버튼 클릭 시 모든 사각형 제거
    btnReset.addEventListener("click", function () {
      // #square 안의 모든 사각형 제거
      $("#square").find(".draggable-rect").remove();
      // 사각형 개수 초기화
      squareCount = 0;
      btnCheck.classList.remove("active");
    });
  });
});
