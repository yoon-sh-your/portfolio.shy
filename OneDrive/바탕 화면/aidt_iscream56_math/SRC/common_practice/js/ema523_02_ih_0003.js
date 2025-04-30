runAfterAppReady(() => {
	$(".custom_dropdown").on("change", function () {
		const selectedVal = $(this).val(); // 선택된 값
		const $svg = $(this).closest(".answer").find("svg"); // 부모 래퍼 찾기

		// 기존 숫자 클래스 제거 (1~9에 한정하거나 상황에 맞게 조정 가능)
		$svg.removeClass(function (index, className) {
			return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
		});

		if (selectedVal) {
			$svg.addClass(`val-${selectedVal}`);
			$svg.attr("data-val", selectedVal);
		}

		// 버튼 활성화
		$(".btn_area button").addClass("active");
	});

	// 커스텀 정답 조건
	window.customCheckCondition = function (el) {
		const ans1 =
			$(".answer1 svg").attr("data-val") === $(".answer8 svg").attr("data-val") &&
			$(`.answer svg[data-val=${$(".answer1 svg").attr("data-val")}]`).length === 2;
		const ans2 =
			$(".answer3 svg").attr("data-val") === $(".answer7 svg").attr("data-val") &&
			$(`.answer svg[data-val=${$(".answer3 svg").attr("data-val")}]`).length === 2;
		const ans3 =
			$(".answer5 svg").attr("data-val") === $(".answer6 svg").attr("data-val") &&
			$(`.answer svg[data-val=${$(".answer5 svg").attr("data-val")}]`).length === 2;
		if (ans1 && ans2 && ans3) {
			return true;
		} else {
			return false;
		}
	};
});
