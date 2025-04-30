runAfterAppReady(() => {
	let pos = [];
	$(".draws-input-wrap").on("click", function (e) {
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

			$wrap.children(".input-wrap").css("left", `${pos[0] + 25}px`);
			$(".dw1").addClass("on");
		} else {
			pos[1] = Math.floor(x / scale / gap) * gap;
			pos.sort();
			adjustedWidth = pos[1] - pos[0];

			$wrap.children(".input-wrap").css("left", `${pos[0] + 25}px`);
			$wrap.children(".input-wrap").css("width", `${adjustedWidth}px`);
			$(".dw2").addClass("on");
		}
	});

	$(".dropdown_wrap, .dropdown_wrap *").on("click", function (e) {
		e.stopPropagation();
	});

	$(".custom_dropdown").on("change", function () {
		const selectedVal = $(this).val(); // 선택된 값
		const $wrap = $(this).closest(".dropdown_wrap"); // 부모 래퍼 찾기

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
		let cnt2 = $(".diw1 .input-wrap").css("left");
		console.log(cnt1, cnt2);
		if (cnt1 === 198 && cnt2 === "223px") {
			return true; //true 반환하면 정답 처리 됩니다.
		} else {
			return false;
		}
	};
	window.onCorrectCustom = function () {
		// const $activeSlide = $(".page_1.on, .page_2.on");
		const $thisSlide = $("#app_wrap").data("current-page");
		const $activeSlide = $(`.${$thisSlide}`);
		$activeSlide.addClass("success");
		$activeSlide.addClass("result");
		console.log($activeSlide);
	};

	// 두 번째 오답 시
	window.onIncorrectTwiceCustom = function () {
		$(".diw1 .input-wrap").css("width", 198).css("left", 223);
	};

	// 리셋 버튼 클릭 시 실행할 커스텀 함수
	window.resetCustom = function () {
		$(".input-wrap").css("width", 0);
		$(".dropdown_wrap").removeClass("on val-1 val-2");
		pos = [];
	};
});
