runAfterAppReady(() => {
	$(".btnSubmit").click(function () {
		$(".hint").addClass("show");
		$(".solve_area").addClass("active");
	});
	$(".btnReset").click(function () {
		$(".hint").removeClass("show");
		$(".solve_area").removeClass("active");
	});
});
