runAfterAppReady(() => {

  $('.drag_item').draggable({
    helper: 'clone',         // 복제본 사용
    revert: 'invalid',       // 잘못 놓으면 원위치
    cursor: 'move',
    zIndex: 100,
    containment: '.contents' // 또는 원하는 영역
  });
  
  $('.drop_item').droppable({
    accept: '.drag_item',
    drop: function (event, ui) {
      const $dropTarget = $(this);
      const $clone = ui.helper.clone();
      const dragValue = $clone.attr('data-value');
    
      $clone.css({
        position: 'relative',
        left: '0',
        top: '0',
        zIndex: '1'
      });
    
      $dropTarget.empty().append($clone);
    
      $dropTarget.attr('data-drop-value', dragValue); // ⭐ 드롭된 값 기록

      // ⭐ 드롭 직후 ui-state-hover 제거
      $dropTarget.removeClass('ui-state-hover');
    
      checkAllDropGroupsCorrection(); // ✅
    }    
  });
  
  function checkAllDropGroupsCorrection() {
    const requiredAnswersGroup1 = ['가', '나', '마'];
  
    $('.drop_group').each(function () {
      const $dropGroup = $(this);
      const isDropGroup1 = $dropGroup.hasClass('drop_group1');
      const answersFound = new Set();
      let hasAnyDropped = false;
  
      $dropGroup.find('.drop_item').each(function () {
        const $dropItem = $(this);
        const dropValue = $dropItem.attr('data-drop-value');
        const correctAnswer = $dropItem.attr('data-answer-single');
  
        if (dropValue) {
          hasAnyDropped = true;
  
          // 기본 drop_item 개별 정오답 체크
          if (dropValue === correctAnswer) {
            $dropItem.attr('data-correction', 'true');
          } else {
            $dropItem.attr('data-correction', 'false');
          }
  
          // drop_group1용: 가, 나, 마 들어있는지 체크
          if (isDropGroup1 && requiredAnswersGroup1.includes(dropValue)) {
            answersFound.add(dropValue);
          }
  
        } else {
          // ⭐ 드롭되지 않은 경우에는 data-correction 아예 없애기
          $dropItem.removeAttr('data-correction');
        }
      });
  
      if (isDropGroup1) {
        // drop_group1 특별 처리
        const isGroup1Correct = requiredAnswersGroup1.every(ans => answersFound.has(ans));
  
        if (isGroup1Correct) {
          $dropGroup.attr('data-correction', 'true');
  
          // ⭐ drop_item 모두 강제 true 덮어쓰기
          $dropGroup.find('.drop_item').each(function () {
            const $dropItem = $(this);
            if ($dropItem.attr('data-drop-value')) {
              $dropItem.attr('data-correction', 'true');
            }
          });
        } else {
          $dropGroup.attr('data-correction', 'false');
          // drop_item은 기존 개별 판단 유지 (별도 변경 없음)
        }
      } else {
        // drop_group2 같은 그룹은 그냥 개별 판단만 유지
        if (hasAnyDropped) {
          $dropGroup.attr('data-correction', 'true');
        } else {
          $dropGroup.removeAttr('data-correction');
        }
      }
    });
  
    // ✅ 버튼 활성화 처리
    const $btnReset = $('.btnReset');
    const $btnCheck = $('.btnCheck');
  
    const hasAnyDropItemDropped = $('.drop_item[data-drop-value]').length > 0;
  
    if (hasAnyDropItemDropped) {
      $btnReset.addClass('active').prop('disabled', false);
      $btnCheck.addClass('active').prop('disabled', false);
    } else {
      $btnReset.removeClass('active').prop('disabled', true);
      $btnCheck.removeClass('active').prop('disabled', true);
    }
  }
  
  

  const targetNode = document.querySelector('.drop_group1');
  const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-answer-single']
  };

  const observer = new MutationObserver(() => {
    checkAllDropGroupsCorrection();
  });

  if (targetNode) {
    observer.observe(targetNode, config);
  }

  // 로딩 시 1회 실행
  checkAllDropGroupsCorrection();

  $('.btnReset').on('click', function () {
    // ✅ drop_group 전체 초기화
    $('.drop_group').each(function () {
      const $dropGroup = $(this);
  
      $dropGroup.removeAttr('data-correction');
  
      $dropGroup.find('.drop_item').each(function () {
        const $dropItem = $(this);
  
        $dropItem.removeAttr('data-correction');
        $dropItem.removeAttr('data-drop-value');
        $dropItem.removeClass('correct wrong hint'); // ✅ class도 모두 제거
  
        $dropItem.empty(); // 내부 복제 drag_item 제거
      });
    });
  
    // ✅ 버튼 초기화
    const $btnReset = $('.btnReset');
    const $btnCheck = $('.btnCheck');
  
    $btnReset.removeClass('active').prop('disabled', true);
    $btnCheck.removeClass('active').prop('disabled', true);
  });
  
  
});
