runAfterAppReady(() => {
    function updateDragItemsVisibility() {
        // drop_group 안에 있는 drag_item 클래스들을 하나씩 확인
        $('.drop_group .drag_item').each(function() {
            let classes = $(this).attr('class').split(/\s+/)[1];

            // 동일한 클래스 가진 요소를 drag_group 안에서 숨기고 비활성화
            $('.drag_group .' + classes).css('pointer-events', 'none').hide();
        });

        $('.drop_group .drag_item.dropped').css('pointer-events', 'none');
    }

    $('.drop_group').droppable({
        accept: '[class^="drag_item"]',
        drop: function() {
          // 드롭 후 업데이트 함수 실행
          updateDragItemsVisibility();
        }
    });

    $('.btnReset').on('click', function () {
        $('.drag_group .drag_item').css('pointer-events', '').show();
    });

    // 초기 로딩 시에도 한 번 실행
    updateDragItemsVisibility();
});
