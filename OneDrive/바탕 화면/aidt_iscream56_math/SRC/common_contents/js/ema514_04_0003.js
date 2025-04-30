$(document).ready(function() {
    // revel_act 클래스를 가진 reveal_btn 클릭 이벤트 처리
    $('.reveal_btn.revel_act').on('click', function() {
        if($(this).hasClass('on')) {
            $('.speech_bubble').removeClass('on');
        } else {
            $('.speech_bubble').addClass('on');
        }
    });
    
    // btnReset 버튼 클릭 이벤트 처리
    $('.btnReset').on('click', function() {
        $('.reveal_btn').removeClass('on');
        $('.speech_bubble').removeClass('on');
    });
});
