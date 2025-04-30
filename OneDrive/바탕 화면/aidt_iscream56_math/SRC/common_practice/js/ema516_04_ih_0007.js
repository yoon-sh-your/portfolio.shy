runAfterAppReady(() => {
	$(".btnSubmit").click(function () {
		$(".answer_area").addClass("show");
	});
	$(".btnReset").click(function () {
		$(".answer_area").removeClass("show");
	});

	// 버튼 활성화 규칙 정의
	defineButtonClassRules([
		{
			selector: ".drawing_grid_area:not([data-answer-single])",
			key: "custom_submit_btn_active",
			test: (el) => {
				return el.dataset.connection !== undefined && el.dataset.connection !== "[]";
			},
		},
	]);
});
