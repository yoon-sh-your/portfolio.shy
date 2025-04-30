document.addEventListener("DOMContentLoaded", function () {
	const wrap = document.querySelectorAll(".boolean_wrap");

	wrap.forEach(function (wrp) {
		const btns = wrp.querySelectorAll("button");

		btns.forEach(function (btn) {
			btn.addEventListener("click", () => {
				if (btn.classList.contains("selected")) {
					btn.classList.remove("selected");
				} else {
					btn.classList.add("selected");
				}
			});
		});
	});
});

function removeResult() {
	let booleanWraps = document.querySelectorAll(".boolean_wrap");

	booleanWraps.forEach(function (booleanWrap) {
		booleanWrap.classList.remove("result");
	});
}

function addResult() {
	let booleanWraps = document.querySelectorAll(".boolean_wrap");

	booleanWraps.forEach(function (booleanWrap) {
		booleanWrap.classList.add("result");
	});
}

function resultReset() {
	const lines = document.querySelectorAll(".boolean_wrap button");

	lines.forEach(function (line) {
		line.classList.remove("selected");
	});
	document.querySelector(".boolean_wrap").classList.remove("result");
}

// 정답일 때
function onCorrectCustom() {
	addResult();
}

// 리셋일 떄
function resetCustom() {
	resultReset();
}

// 첫번째 틀렸을 때
function onIncorrectCustom() {
	removeResult();
}

// 두번째 틀렸을 때
function onIncorrectTwiceCustom() {
	addResult();
}

// 빈칸일 때
function onEmptyCustom() {
	removeResult();
}
