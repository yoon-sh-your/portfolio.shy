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
	let pos = [];
	$(".draws-input-wrap").on("click", function(e) {
		let scale = getScale();
		$(".btn_area button").addClass("active");
		audioManager.playSound("click");
		let $wrap = $(this);
		let x = e.pageX - $wrap.offset().left;
		let gap = parseFloat($wrap.attr("data-gap"));
		let adjustedWidth;
		if (pos.length === 2) return;
		if (typeof pos[0] === "undefined") {
			pos[0] = Math.floor(x / scale / gap) * gap;
			$wrap.children(".input-wrap").css("left", `${pos[0]}px`);
			$(".dw1").addClass("on");
		} else {
			pos[1] = Math.floor(x / scale / gap) * gap;
			pos.sort((a, b) => a - b);
			adjustedWidth = Math.abs(pos[1] - pos[0]);
			if (adjustedWidth < 1) return;
			$wrap.children(".input-wrap").css("left", `${pos[0]}px`);
			$wrap.children(".input-wrap").css("width", `${adjustedWidth}px`);
			$(".dw2").addClass("on");
		}
	});
	$(".dropdown_wrap, .dropdown_wrap *").on("click", function(e) {
		e.stopPropagation();
	});
	$(".custom_dropdown").on("change", function() {
		const selectedVal = $(this).val(); // 선택된 값
		const $wrap = $(this).closest(".dropdown_wrap"); // 부모 래퍼 찾기
		// 기존 숫자 클래스 제거 (1~9에 한정하거나 상황에 맞게 조정 가능)
		$wrap.removeClass(function(index, className) {
			return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
		});
		if (selectedVal) {
			$wrap.addClass(`val-${selectedVal}`);
		}
	});
	// 커스텀 정답 조건
	window.customCheckCondition = function(el) {
		if ($('.page_2').hasClass('on')) {
			let cnt1 = $(".diw1 .input-wrap").width();
			let cnt2 = $(".diw1 .input-wrap").css("left");
	
			if (cnt1 === 253 && cnt2 === "121px") {
				return true;
			} else {
				$(".diw1 .input-wrap").css("width", 0).css("left", 0);
				$(".dropdown_wrap").removeClass(function(index, className) {
					return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
				}).removeClass("on");
				pos = [];
				return false;
			}
		} else if ($('.page_1').hasClass('on')) {
			let isCorrect = true;
	
			$('.page_1 .boolean_wrap button').each(function () {
				if ($(this).attr('data-answer-single') === 'false' && $(this).hasClass('selected')) {
					isCorrect = false;
				}
			});
	
			return isCorrect;
		}
	};
	// 두 번째 오답 시
	window.onIncorrectTwiceCustom = function() {
		if ($('.page_2').hasClass('on')) {
			$(".diw1 .input-wrap").css("width", 253).css("left", 121);
			$(".dropdown_wrap").removeClass(function(index, className) {
				return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
			}).addClass("on");
		}
	};
	// 리셋 버튼 클릭 시 실행할 커스텀 함수
	window.resetCustom = function() {
		if ($('.page_2').hasClass('on')) {
			// 입력 위치 초기화
			$(".diw1 .input-wrap")
				.css("width", 0)
				.css("left", 0); // ← left도 초기화해야 실제 위치가 초기화됨
		
			// 드롭다운 초기화 (val-* 전부 제거)
			$(".dropdown_wrap").removeClass(function(index, className) {
				return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
			}).removeClass("on");
		
			// 위치 변수 초기화
			pos = [];
		}
	};

	// $('.btn_area .btnReset').on('click', function () {
	// 	var result = {};
	// 	result.caliper = {
	// 	  'EVENT_TYPE': 'NavigationEvent',
	// 	  'PROFILE_TYPE': 'AssessmentProfile',
	// 	  'ACTION_TYPE': 'NavigatedTo',
	// 	  'OBJ_NAME': '다시하기'
	// 	};
	// 	result.isReset = true;
	// 	 console.log('%c 컨텐츠 %c data: %c' + JSON.stringify(result, null, 2), 'color:#870070;background:#FF97FF;', 'color:#1266FF;', 'color:#AB125E;');
	// 	 Receiver.send('button', result);
	// });
});