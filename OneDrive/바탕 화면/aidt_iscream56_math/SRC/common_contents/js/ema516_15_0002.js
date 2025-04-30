runAfterAppReady(() => {
  $(document).ready(function () {
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
});
