runAfterAppReady(() => {
	$(".draws-input-wrap").on("click", function (e) {
		let scale = getScale();
		$(".btn_area button").addClass("active");
		audioManager.playSound("click");

		let $wrap = $(this);
		let x = e.pageX - $wrap.offset().left;
		let gap = parseFloat($wrap.attr("data-gap"));
		let adjustedWidth;
		if (x < gap / 2) {
			adjustedWidth = 25;
		} else {
			if ($wrap.hasClass("reverse")) {
				// 전체 너비 기준 오른쪽에서 클릭한 만큼만 표시되도록 계산
				let totalWidth = $wrap.width();
				adjustedWidth = Math.floor((totalWidth - x / scale) / gap) * gap;
			} else {
				adjustedWidth = Math.floor(x / scale / gap) * gap;
			}
		}

		// 공통적으로 25px padding 고려
		$wrap.children(".input-wrap").css("width", `${adjustedWidth + 25}px`);

		let cnt = $wrap.find(".input-wrap").width();
		console.log(cnt);
	});

	$(".dropdown_wrap, .dropdown_wrap *").on("click", function (e) {
		e.stopPropagation();
	});

	$(".custom_dropdown").on("change", function () {
		const selectedVal = $(this).val(); // 선택된 값
		const $wrap = $(this).closest(".draws-input-wrap"); // 부모 래퍼 찾기

		// 기존 숫자 클래스 제거 (1~9에 한정하거나 상황에 맞게 조정 가능)
		$wrap.removeClass(function (index, className) {
			return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
		});

		if (selectedVal) {
			$wrap.addClass(`val-${selectedVal}`);
		}
	});

	// 커스텀 정답 조건
	window.customCheckCondition = function (el) {
		let cnt1 = $(".diw1 .input-wrap").width();
		let cnt2 = $(".diw2 .input-wrap").width();
		if (cnt1 === 286 && cnt2 === 233) {
			return true; //true 반환하면 정답 처리 됩니다.
		} else {
			return false;
		}
	};
	window.onCorrectCustom = function () {
		document.body.classList.add("success");
		document.body.classList.add("result");
	};
	// 두 번째 오답 시
	window.onIncorrectTwiceCustom = function () {
		$(".diw1 .input-wrap").css("width", 286);
		$(".diw2 .input-wrap").css("width", 233);
	};

	// 리셋 버튼 클릭 시 실행할 커스텀 함수
	window.resetCustom = function () {
		$(".input-wrap").css("width", 0);
	};
});
