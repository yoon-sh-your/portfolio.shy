runAfterAppReady(() => {
  // 드래그 설정
  $(".drag_item").draggable({
    helper: "clone",
    revert: "invalid",
    cursor: "grabbing",
    start: function (event, ui) {
      if ($(this).data("pair") == 1) {
        $(ui.helper).find("path").css({
          "animation": "none",
          "stroke-dashoffset": 0
        });
      }
    }
  });

  // 드롭 설정
  $(".drop_item").droppable({
    accept: ".drag_item",
    drop: function (event, ui) {
      const $dropZone = $(this);
      const dropPair = $dropZone.data("pair");
      const dragPair = ui.draggable.data("pair");

      if (dropPair != dragPair) return;

      const $clone = ui.helper.clone();
      $clone.removeClass("ui-draggable-dragging").css({
        position: "relative",
        left: 0,
        top: 0
      });

      $dropZone.empty().append($clone);

      // ✅ 리셋버튼 활성화
      $(".btnReset").addClass("active");

      if (dragPair == 1) {
        $(".drag_item.scissors").fadeIn();
      }

      if (dragPair == 2) {
        ui.draggable.hide();
        const $dropGroup = $dropZone.closest(".drop_group");
        $dropGroup.find('.drop_item[data-pair="1"]').hide();
        $dropGroup.find('.drop_item.scissors').hide();
        $dropGroup.find('.img_motion').fadeIn();
      }
      window.forceWatchEvaluation(); // 버튼 활성화 상태 재평가
    }
  });

  // ✅ 리셋 버튼 클릭 시 현재 페이지만 초기화
  $(".btnReset").on("click", function () {
    const currentPageId = $("#app_wrap").attr("data-current-page"); // ex) page_1
    if (!currentPageId) return;

    const $currentPage = $(`.page.${currentPageId}`);
    if ($currentPage.length === 0) return;

    // drop_item 비우고 보이게
    $currentPage.find(".drop_item").each(function () {
      $(this).empty().show();
    });

    // 드래그 아이템 보이기
    $currentPage.find(".drag_item").show();

    // 이미지 모션 숨기기
    $currentPage.find(".img_motion").hide();

    // 버튼 비활성화
    $(this).removeClass("active");

    window.forceWatchEvaluation(); // 버튼 활성화 상태 재평가
  });
  defineButtonClassRules([
    {
      selector: ".drop_group .drop_item", //변경될 값을 감지할 태그 설정
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


runAfterAppReady(() => {
  // 드래그 설정
  $(".drag_item").draggable({
    helper: "clone",
    revert: "invalid",
    cursor: "grabbing",
    start: function (event, ui) {
      if ($(this).data("pair") == 1) {
        $(ui.helper).find("path").css({
          "animation": "none",
          "stroke-dashoffset": 0
        });
      }
    }
  });

  // 드롭 설정
  $(".drop_item").droppable({
    accept: ".drag_item",
    drop: function (event, ui) {
      const $dropZone = $(this);
      const dropPair = $dropZone.data("pair");
      const dragPair = ui.draggable.data("pair");

      if (dropPair != dragPair) return;

      const $clone = ui.helper.clone();
      $clone.removeClass("ui-draggable-dragging").css({
        position: "relative",
        left: 0,
        top: 0
      });

      $dropZone.empty().append($clone);

      // ✅ 리셋버튼 활성화
      $(".btnReset").addClass("active");

      if (dragPair == 1) {
        $(".drag_item.scissors").fadeIn();
      }

      if (dragPair == 2) {
        ui.draggable.hide();
        const $dropGroup = $dropZone.closest(".drop_group");
        $dropGroup.find('.drop_item[data-pair="1"]').hide();
        $dropGroup.find('.drop_item.scissors').hide();
        $dropGroup.find('.img_motion').fadeIn();
      }
      window.forceWatchEvaluation(); // 버튼 활성화 상태 재평가
    }
  });

  // ✅ 리셋 버튼 클릭 시 현재 페이지만 초기화
  $(".btnReset").on("click", function () {
    const $currentPage = $(".page.on"); // 현재 슬라이드된 페이지만 처리
    if ($currentPage.length === 0) return;

    // drop_item 비우기
    $currentPage.find(".drop_item").each(function () {
      $(this).empty().show(); // 복제본 제거 + 보이게
    });

    // 숨겨진 drag_item 보이기
    $currentPage.find(".drag_item").show();

    // 이미지 모션 숨기기
    $currentPage.find(".img_motion").hide();

    // 버튼 active 해제
    $(this).removeClass("active");
    window.forceWatchEvaluation(); // 버튼 활성화 상태 재평가
  });

  defineButtonClassRules([
    {
      selector: ".drop_group .drop_item", //변경될 값을 감지할 태그 설정
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
