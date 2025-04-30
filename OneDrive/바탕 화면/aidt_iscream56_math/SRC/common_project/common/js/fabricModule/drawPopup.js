runAfterAppReady(function () {
    initDrawPopup()
});

function initDrawPopup() {
    $('.draw-tool-wrap').draggable({
        handle: '.draw-tool-wrap-title',
        start: function (event, ui) {
            // 글로벌 스케일 값 가져오기
            const scale = globalScale || 1;
            $(this).data('scale', scale);

            // 마우스 클릭한 위치를 저장 (스케일 적용)
            const offset = $(this).offset();
            const clickX = (event.pageX - offset.left) / scale;
            const clickY = (event.pageY - offset.top) / scale;

            $(this).data('clickOffset', { x: clickX, y: clickY });
        },
        drag: function (event, ui) {
            const scale = $(this).data('scale');
            const clickOffset = $(this).data('clickOffset');

            // 스케일이 1이 아닌 경우에만 좌표 조정
            if (scale !== 1) {
                ui.position.left = (event.pageX - clickOffset.x * scale) / scale;
                ui.position.top = (event.pageY - clickOffset.y * scale) / scale;
            }
        }
    });
}