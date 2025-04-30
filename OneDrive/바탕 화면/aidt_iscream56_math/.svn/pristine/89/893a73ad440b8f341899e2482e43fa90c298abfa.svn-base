
runAfterAppReady(function () {

    // 페이지 로드시 data-correction을 "false"로 초기화
    $(document).each(function() { 
      $(".btnCheck, .btnReset").removeClass("active");
    });

    $("<style>")
    .prop("type", "text/css")
    .html(`
      .dragndrop_fraction_wrap .figure_triangle.highlight-border {
        border: 1px dashed var(--secondary-green) !important;
      }
    `)
    .appendTo("head");
  
     // 드래그 가능한 도형 설정
     $(".figure_triangle").draggable({
      snap: ".figure_triangle", // 자석처럼 붙을 대상 설정
      snapMode: "inner",  // 도형의 내부에 붙도록 설정
      zIndex: 9999,       // 드래그할 때 도형이 맨 위로 올라오게 함
      start: function(event, ui) {
        $(this).css("z-index", 9999); // 드래그 시작 시 해당 도형이 가장 위로 올라옴
        ui.position.left /= globalScale;
        ui.position.top /= globalScale;
     
      audioManager.playSound("drag");

      // 드래그 시작 시 pair가 같은 드롭 요소 보더 강조
        const dragPair = $(this).data("pair");  // `this`를 사용하여 원본 요소에 접근
        $(".figure_triangle").each(function () {
          const dropPair = $(this).data("pair");
          if (dragPair === dropPair) {
            $(this).addClass("highlight-border");
          }
        });
      },
      drag: function (event, ui) {
        ui.position.left /= globalScale;
        ui.position.top /= globalScale;
      },
      stop: function(event, ui) {
        $(this).css("z-index", ""); // 드래그가 끝나면 z-index 초기화
        $(".figure_triangle").removeClass("highlight-border");

        checkOverlap(); // 드래그 종료 시 겹침 상태 확인

      }
    });

    // 완전히 겹쳤는지 확인하는 함수
    function checkOverlap() {
      const drag1 = $(".figure_triangle[data-id='drag0']");
      const drag2 = $(".figure_triangle[data-id='drag1']");

      const drag1Offset = drag1.offset();
      const drag2Offset = drag2.offset();
      const drag1Width = drag1.outerWidth();
      const drag1Height = drag1.outerHeight();
      const drag2Width = drag2.outerWidth();
      const drag2Height = drag2.outerHeight();

      // 허용 오차 ±1
      const tolerance = 1;

      // 두 도형이 겹치는지 확인 (간단한 충돌 체크)
      const isOverlap = !(drag1Offset.left + drag1Width <= drag2Offset.left || 
                          drag1Offset.left >= drag2Offset.left + drag2Width || 
                          drag1Offset.top + drag1Height <= drag2Offset.top ||
                          drag1Offset.top >= drag2Offset.top + drag2Height);

      // 오차 범위 ±1로 완전히 겹쳤을 때만 data-correction="true"로 설정
      if (isOverlap &&
          Math.abs(drag1Width - drag2Width) <= tolerance && // 크기 차이 허용 오차
          Math.abs(drag1Height - drag2Height) <= tolerance && // 크기 차이 허용 오차
          Math.abs(drag1Offset.left - drag2Offset.left) <= tolerance && // X축 위치 차이 허용 오차
          Math.abs(drag1Offset.top - drag2Offset.top) <= tolerance) { // Y축 위치 차이 허용 오차
        drag1.attr("data-correction", "true");
        drag2.attr("data-correction", "true"); 
      } else {
        drag1.attr("data-correction", "false");
        drag2.attr("data-correction", "false"); 
      }
      
      window.forceWatchEvaluation();
    }

    
  // 오답 횟수 커스텀 반응
  window.onCustomIncorrect = function (count) {
    console.log(count);
    if (count === 2) {
      $(".figure_triangle").each(function() {
        if ($(this).hasClass("hint")) {
          // 두 도형의 위치를 서로 포개어지게 조정
          const drag1 = $(".figure_triangle[data-id='drag0']");
          const drag2 = $(".figure_triangle[data-id='drag1']");
          
          // 두 도형의 위치를 동일하게 설정하여 포개어지도록 함

          drag1.css({
            position:'absolute',
            top: '50%',  // 두 도형의 Y 위치를 동일하게 설정
            left: '50%',  // 두 도형의 X 위치를 동일하게 설정
            transform: 'translate(-50%, -50%)'
          });

          drag2.css({
            position:'absolute',
            top: '50%',  // 두 도형의 Y 위치를 동일하게 설정
            left: '50%',  // 두 도형의 X 위치를 동일하게 설정
            transform: 'translate(-50%, -50%)'
          });

          // 두 번째 도형에 hint 클래스를 추가하여 포개어짐을 시각적으로 표시
          drag2.addClass("hint"); // drag2에도 hint 클래스 추가
        }
      });
    }
  };
  
    // 리셋 버튼 클릭 시 초기화
    $(".btnReset").on("click", function() {
      const $currentPage = $(".page.on");

  // 드래그 앤 드롭 영역이 없는 페이지는 무시
  if ($currentPage.find(".dragndrop_fraction_wrap").length === 0) return;
  
      $(".figure_triangle[data-id='drag0'], .figure_triangle[data-id='drag1'] ").css({ top: "0", left: "0", position: "relative", transform: 'translate( 0, 0)' }).attr("data-correction", "false");
      $(".figure_triangle").removeAttr("data-correction");
      window.forceWatchEvaluation();
    });

    defineButtonClassRules([
      {
        selector: ".dragndrop_fraction_wrap .figure_triangle", //변경될 값을 감지할 태그 설정
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
    // 버튼 상태 변경 후 강제 평가 문 실행
});
