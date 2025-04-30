runAfterAppReady(() => {
    $('.btn_area > button.btnCheck').click(function() {
        if ($('#app_wrap').attr('data-current-page') === 'page_4') {
            $('.hidden_obj').addClass('on');
        }
    });
});