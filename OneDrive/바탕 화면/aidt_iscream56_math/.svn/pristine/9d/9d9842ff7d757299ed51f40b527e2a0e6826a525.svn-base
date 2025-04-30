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
	let pos = new Map(); // 각 요소별 위치 저장을 위해 Map 사용

	$(".draws-input-wrap").each(function () {
		pos.set(this, []);
		let $wrap = $(this);
	
		$wrap.on("click", function (e) {
			let scale = getScale();
			$(".btn_area button").addClass("active");
			audioManager.playSound("click");
	
			let x = e.pageX - $wrap.offset().left;
			let gap = parseFloat($wrap.attr("data-gap"));
			let adjustedWidth;
			let currentPos = pos.get(this);


			//if (!currentPos || currentPos.length === 2) return;
			if (!currentPos || currentPos.filter(v => typeof v !== "undefined").length === 2) return;

	
			if (typeof currentPos[0] === "undefined") {
				currentPos[0] = Math.floor(x / scale / gap) * gap;
				$wrap.children(".input-wrap").css("left", `${currentPos[0]}px`);
				$wrap.find(".dw1").addClass("on"); 
				$wrap.find(".dw3").addClass("on");

			
				  
			} else {
				currentPos[1] = Math.floor(x / scale / gap) * gap;
				currentPos.sort((a, b) => a - b);
				adjustedWidth = Math.abs(currentPos[1] - currentPos[0]);
	
				if (adjustedWidth < 1) return;
	
				$wrap.children(".input-wrap").css("left", `${currentPos[0]}px`);
				$wrap.children(".input-wrap").css("width", `${adjustedWidth}px`);
				$wrap.find(".dw2").addClass("on"); 
				$wrap.find(".dw4").addClass("on"); 
			}

			setTimeout(() => {
				const activeDw = $wrap.find(".dw1.on, .dw2.on, .dw3.on, .dw4.on"); // dw1이나 dw3 중에 on 붙은 것 찾기
				const innerElements = activeDw.find('.select_options');
				activeDw.addClass("active");
				innerElements.addClass("upper").css("display", "block");
			  }, 10);
		});
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

	//커스텀 정답 조건
	window.customCheckCondition = function(el) {
		let cnt1 = $(".diw1 .input-wrap").width();
		let cnt2 = $(".diw1 .input-wrap").css("left");
		let cnt3 = $(".diw2 .input-wrap").width();
		let cnt4 = $(".diw2 .input-wrap").css("left");

		if (cnt1 === 350 && cnt2 === "275px") {
			return true;
		} else if (cnt3 === 180 && cnt4 === "335px") {
			return true;
		} else {
			return false;
		}
	};

	// 두 번째 오답 시
	window.onIncorrectTwiceCustom = function() {
		$(".diw1 .input-wrap").css("width", 350).css("left", 275);
		$(".diw2 .input-wrap").css("width", 180).css("left", 335);
	};

	// 리셋 버튼 클릭 시 실행할 커스텀 함수
	window.resetCustom = function() {
		$(".draws-input-wrap").each(function () {
			let $wrap = $(this);
			$wrap.find(".input-wrap").css("width", 0).css("left", 0);
			$wrap.find(".dropdown_wrap").removeClass(function(index, className) {
				return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
			}).removeClass("on");
			$wrap.find(".dw1, .dw2, .dw3, .dw4").removeClass("on");
			pos.set(this, []);
		});
	
		// 버튼 활성화 초기화 (필요 시 추가)
		$(".btn_area button").removeClass("active");
	};

});