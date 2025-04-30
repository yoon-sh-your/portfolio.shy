document.addEventListener("DOMContentLoaded", function () {
	// DOM 요소 선택
	const startPoints = document.querySelectorAll(".start-point");
	const objBoxes = document.querySelectorAll(".obj_box");
	const mathFields = document.querySelectorAll("math-field");

	// 각 시작점에 클릭 이벤트 추가
	startPoints.forEach((point, index) => {
		point.addEventListener("click", function () {
			// 이전 애니메이션 초기화
			resetAnimations();

			// 현재 선택된 경로 활성화
			activatePath(index);
		});
	});

	// 모든 애니메이션 초기화 함수
	function resetAnimations() {
		objBoxes.forEach((box) => {
			box.classList.remove("active");
			box.querySelector(".path-draw").classList.remove("active");
		});
	}

	// 특정 경로 활성화 함수
	function activatePath(index) {
		const currentBox = objBoxes[index];
		const obj = currentBox.querySelector(".obj");

		// active 클래스 추가
		currentBox.classList.add("active");
		currentBox.querySelector(".path-draw").classList.add("active");

		obj.style.animation = "none";
		obj.offsetHeight;
		obj.style.animation = getObjAnimation(index);

		// 애니메이션 종료 시 active 클래스 제거 및 math-field 활성화
		obj.addEventListener(
			"animationend",
			function () {
				console.log("animationend");
				// currentBox.classList.remove('active');

				// 해당하는 math-field 활성화
				const boxClass = currentBox.classList[1]; // obj_box1, obj_box2 등
				const boxNumber = boxClass.replace("obj_box", "");

				// math-field 활성화 순서 매핑
				const fieldOrder = {
					1: 3, // obj_box1 -> input3
					2: 2, // obj_box2 -> input2
					3: 4, // obj_box3 -> input4
					4: 1, // obj_box4 -> input1
				};

				const targetField = mathFields[fieldOrder[boxNumber] - 1];
				console.log(targetField);
				if (targetField) {
					targetField.removeAttribute("disabled");
					targetField.focus();
				}
			},
			{ once: true },
		);
	}
});

runAfterAppReady(() => {
	// 리셋 버튼 클릭 시 실행할 커스텀 함수
	window.resetCustom = function () {
		const objBoxes = document.querySelectorAll(".obj_box");
		objBoxes.forEach((obj, index) => {
			obj.classList.remove("active");
		});
	};
	//정오답 처리 커스텁
	window.customCheckCondition = function (el) {
		const $el = $(el);
		const rule = $el.data("answerSingle");
		const val = $el.val();
		let num = val.match(/\d+/);
		let number = parseInt(num, 10);

		// 한개라도 빈값이면 오답
		if (val == "" || val == null) return false;
		if (val !== "" && number !== rule) return false;

		return true;
	};

	// 두 번째 오답 시
	window.onIncorrectTwiceCustom = function () {
		$(".custom_check_target").addClass("hint");
	};
});

function getObjAnimation(index) {
	switch (index) {
		case 0:
			return "dummyAni 4.5s linear forwards";
		case 1:
			return "dummyAni 4.5s linear forwards";
		case 2:
			return "dummyAni 4.5s linear forwards";
		case 3:
			return "dummyAni 4.5s linear forwards";
		default:
			return "dummyAni 4.5s linear forwards";
	}
}
