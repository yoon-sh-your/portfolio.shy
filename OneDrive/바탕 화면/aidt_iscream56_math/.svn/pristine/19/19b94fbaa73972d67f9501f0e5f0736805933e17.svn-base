// runAfterAppReady 함수를 사용하여 앱이 준비된 후 코드 실행
runAfterAppReady(() => {
  // 공통 버튼 활성화 로직 오버라이드
  const originalWatchWithCustomTest = window.watchWithCustomTest;
  window.watchWithCustomTest = function(rules, callback, callbackNot) {
    // 원래 콜백 함수를 래핑하여 btnReset 버튼에 active 클래스가 추가되지 않도록 함
    const wrappedCallback = function(selector) {
      // 원래 콜백 실행
      if (callback) callback(selector);
      
      // btnReset 버튼의 active 클래스 제거
      $('.btnReset').removeClass('active');
    };
    
    // 원래 함수 호출 (래핑된 콜백 사용)
    originalWatchWithCustomTest(rules, wrappedCallback, callbackNot);
  };
  
  // 초기 버튼 상태 설정
  $('.btnCheck').prop('disabled', false).addClass('active');
  $('.btnReset').prop('disabled', true).removeClass('active').addClass('reset_off');
  
  // 드래그 앤 드롭 초기화
  initializeDragDrop();
  
  // 리셋 버튼 클릭 이벤트
  $('.btnReset').on('click', function() {
    resetDragDrop();
  });
  
  // 확인 버튼 클릭 이벤트
  $('.btnCheck').on('click', function() {
    // 모든 dragndrop li 요소에 'on' 클래스 추가
    $('.dragndrop.letKnow li').addClass('on');
    
    // 확인 버튼 비활성화
    $(this).prop('disabled', true).removeClass('active');
    
    // 리셋 버튼 활성화 및 active 클래스 추가
    $('.btnReset').prop('disabled', false).addClass('active reset_on').removeClass('reset_off');
    
    // 정답 확인
    checkAnswers();
  });
});

// 드래그 앤 드롭 초기화 함수
function initializeDragDrop() {
  // jQuery UI 라이브러리가 로드되었는지 확인
  if (typeof $.fn.draggable === 'undefined') {
    return;
  }
  
  const $draggables = $('.letKnow .draggable');
  const $droppables = $('.letKnow .droppable');
  
  // 드래그 가능한 요소 설정
  $draggables.draggable({
    start: function(event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      audioManager.playSound("drag");
      // 드래그 시작 시 reset_off 클래스 제거
      $('.btnReset').removeClass('reset_off');
    },
    drag: function(event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
    },
    revert: function() {
      return true;
    },
    revertDuration: 0
  });
  
  // 드롭 가능한 영역 설정
  $droppables.droppable({
    accept: '.letKnow .draggable',
    tolerance: 'fit',
    over: function() {
      $(this).addClass('ui-state-hover ui-droppable-active');
    },
    out: function() {
      $(this).removeClass('ui-state-hover ui-droppable-active');
    },
    drop: function(event, ui) {
      $(this).removeClass('ui-state-hover ui-droppable-active');
      
      const $drag = $(ui.draggable);
      const $drop = $(this);
      
      const dragPair = $drag.data('pair');
      const dropPair = $drop.data('pair');
      
      if (dragPair === dropPair) {
        $drop.parent().toggleClass('on');
        audioManager.playSound('drop');
        
        // 드롭이 발생하면 리셋 버튼 활성화
        $('.btnReset').prop('disabled', false);
        
        // 모든 드래그 요소가 드롭되었는지 확인
        checkAllDropped();
      }
    }
  });
}

// 모든 드래그 요소가 드롭되었는지 확인하는 함수
function checkAllDropped() {
  const $allItems = $('.letKnow li');
  const $droppedItems = $('.letKnow li.on');
  
  // 모든 아이템이 드롭되었으면 확인 버튼 비활성화
  if ($allItems.length === $droppedItems.length) {
    $('.btnCheck').prop('disabled', true).removeClass('active');
  }
}

// 리셋 함수
function resetDragDrop() {
  // 모든 드롭된 요소 제거
  $('.letKnow li').removeClass('on');
  
  // 모든 드래그 요소를 원래 위치로 되돌림
  $('.letKnow .draggable').each(function() {
    $(this).css({
      left: '',
      top: ''
    });
  });
  
  // 버튼 상태 초기화
  $('.btnCheck').prop('disabled', false).addClass('active');
  $('.btnReset').prop('disabled', true).removeClass('active').addClass('reset_off');
}

