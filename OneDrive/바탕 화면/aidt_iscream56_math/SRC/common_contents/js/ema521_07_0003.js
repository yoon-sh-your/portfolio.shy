const getScale = () => {
	let scaleValue = $('#app_wrap').css('transform');
	if (scaleValue && scaleValue !== 'none') {
		const match = scaleValue.match(/^matrix\(([^,]+)/);
		if (match) {
			scaleValue = parseFloat(match[1]);
		}
	}
	return scaleValue || 1; // 기본값 1 추가
};
runAfterAppReady(() => {
    $('.page_1 .boolean_wrap button').each(function () {
        $(this).on('click',function(){
            $(this).siblings().removeClass('selected');
        })
    });
    $('.page_3 .boolean_wrap button').each(function () {
        $(this).on('click',function(){
            $(this).siblings().removeClass('selected');
        })
    });

});