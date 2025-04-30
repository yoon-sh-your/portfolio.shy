document.addEventListener("DOMContentLoaded", function () {
	const btnSubmit = document.querySelector(".btnSubmit");
	const btnReset = document.querySelector(".btnReset");
	const wrap = document.querySelector("#app_wrap");

	btnSubmit.addEventListener("click", () => {
		if (wrap.classList.contains("checked")) {
			wrap.classList.remove("checked");
		} else {
			wrap.classList.add("checked");
		}
	});

	btnReset.addEventListener("click", () => {
		wrap.classList.remove("checked");
	});
});
