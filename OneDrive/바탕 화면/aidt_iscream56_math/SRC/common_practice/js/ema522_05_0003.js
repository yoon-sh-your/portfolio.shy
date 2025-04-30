function initializeCustomFractionDrop() {
	const $wrap = $(".dragndrop_fraction_wrap");
	const $draggables = $wrap.find(".drag_item");
	const $droppables = $wrap.find(".drop_item");

	// 드래그 가능한 요소 초기화
	$draggables.draggable({
		helper: function () {
			const $helper = $(this).clone();
			$helper.css({ opacity: 0.8, pointerEvents: "none" });
			return $helper;
		},
		revert: "invalid",
		revertDuration: 0,
		start: function (event, ui) {
			ui.position.left /= globalScale;
			ui.position.top /= globalScale;
			audioManager.playSound("drag");
		},
		drag: function (event, ui) {
			ui.position.left /= globalScale;
			ui.position.top /= globalScale;
		},
	});

	// 드롭 가능한 영역 초기화
	$droppables.droppable({
		accept: function (draggable) {
			return $(this).find(".drag_item").length === 0;
		},
		tolerance: "pointer",
		over: function () {
			$(this).addClass("ui-state-hover ui-droppable-active");
		},
		out: function () {
			$(this).removeClass("ui-state-hover ui-droppable-active");
		},
		drop: function (event, ui) {
			const $drop = $(this).removeClass("ui-state-hover ui-droppable-active");
			const $drag = $(ui.draggable);

			// 드롭 영역에 이미 드래그 요소가 있으면 무시
			if ($drop.find(".drag_item").length === 0) {
				const $clone = $drag.clone();

				// 클론된 요소 스타일 및 드래그 설정
				$clone
					.addClass("dropped")
					.removeAttr("style")
					.css({ position: "absolute", width: "100%", height: "100%", zIndex: 10 })
					.draggable({
						helper: "original",
						containment: "document",
						zIndex: 1000,
						revert: "invalid",
						revertDuration: 0,
						start: function (event, ui) {
							ui.position.left /= globalScale;
							ui.position.top /= globalScale;
						},
						drag: function (event, ui) {
							ui.position.left /= globalScale;
							ui.position.top /= globalScale;
						},
						stop: function (event, ui) {
							// 드래그가 영역 밖으로 나가면 삭제
							const dropEl = this.parentElement;
							const scale = globalScale || 1;
							const dropRect = dropEl.getBoundingClientRect();
							const x = event.pageX / scale;
							const y = event.pageY / scale;

							const isInside =
								x >= dropRect.left / scale &&
								x <= dropRect.right / scale &&
								y >= dropRect.top / scale &&
								y <= dropRect.bottom / scale;

							if (!isInside) {
								$(this).remove();
								$(dropEl).parent().removeClass("selected");
								dropEl.removeAttribute("data-value");
								dropEl.removeAttribute("data-correction");
								window.triggerDropoutEvaluation();
							}
						},
					});

				$drop.append($clone);
				$drop.parent().addClass("on");

				// 정답 여부 기록
				const userValue = String($drag.data("pair")).trim();
				const answerValue = String($drop.attr("data-answer-single")).trim();
				$drop
					.attr("data-value", userValue)
					.attr("data-correction", userValue === answerValue ? "true" : "false");

				audioManager.playSound("drop");
			}
		},
	});
}

runAfterAppReady(() => {
	initializeCustomFractionDrop();

	// 현재 페이지 요소 추출
	function getCurrentPageElement() {
		const currentPageName = $("[data-current-page]").attr("data-current-page");
		return $(".page").filter(`.${currentPageName}`);
	}

	// 채점 대상 그룹 추출
	window.getCustomTargets = function () {
		return getCurrentPageElement().find(".drop_group");
	};

	// 정답 확인 로직
	window.customCheckCondition = function (el) {
		const $group = $(el);
		const $drops = $group.find(".drop_item");

		// 모든 드롭이 채워져 있어야 함
		const allFilled = $drops.toArray().every((drop) => {
			const $drop = $(drop);
			const val = $drop.attr("data-value");
			return val !== undefined && $drop.find(".drag_item").length > 0;
		});
		if (!allFilled) return false;

		// 각 드롭 영역이 정답인지 확인
		let allCorrect = true;
		$drops.each(function () {
			const $drop = $(this);
			const answer = String($drop.attr("data-answer-single")).trim();
			const userValue = String($drop.find(".drag_item").attr("data-pair")).trim();
			const isCorrect = userValue === answer;
			$drop.attr("data-correction", isCorrect ? "true" : "false");
			if (!isCorrect) allCorrect = false;
		});

		return allCorrect;
	};

	// 2회 오답 시 정답 공개
	window.onIncorrectTwiceCustom = function () {
		const $currentPage = getCurrentPageElement();

		$currentPage.find(".drop_item").each(function () {
			const $drop = $(this);
			const answer = $drop.attr("data-answer-single");

			$drop.find(".drag_item").remove();

			const correctImgSrc =
				answer === "1"
					? "../../common_contents/img/EMA514_08_SU/0003_mark1.svg"
					: "../../common_contents/img/EMA514_08_SU/0003_mark2.svg";

			const $correctItem = $("<div>")
				.addClass("drag_item dropped")
				.attr("data-pair", answer)
				.css({ position: "absolute", width: "100%", height: "100%", zIndex: 10 })
				.append(
					$("<img>")
						.attr("src", correctImgSrc)
						.attr("alt", answer === "1" ? "동그라미" : "세모"),
				);

			$drop.append($correctItem);
			$drop.attr("data-value", answer).attr("data-correction", "true");
			$drop.removeClass("incorrect").addClass("correct");
		});
	};

	// 리셋 로직
	window.resetCustom = function () {
		$(".dragndrop_fraction_wrap").each(function () {
			const $wrap = $(this);

			$wrap.find(".drop_item").each(function () {
				$(this).find(".drag_item").remove();
				$(this).removeAttr("data-value data-correction").removeClass("correct incorrect on selected");
			});

			$wrap.find(".drag_item_group .drag_item").removeAttr("style");

			$(".btn_area button").removeClass("active").prop("disabled", false);
		});

		attemptCount = 0;
	};

	let attemptCount = 0;

	// 정답 확인 버튼
	$(".btnCheck").on("click", function () {
		const $currentPage = getCurrentPageElement();
		const $groups = $currentPage.find(".drop_group");

		const isEmpty = $groups.toArray().some((group) => {
			return $(group)
				.find(".drop_item")
				.toArray()
				.some((drop) => !drop.hasAttribute("data-value"));
		});

		if (isEmpty) {
			window.onEmptyCustom?.();
			return;
		}

		const allCorrect = $groups.toArray().every((group) => window.customCheckCondition(group));

		if (allCorrect) {
			attemptCount = 0;
			window.onCorrectCustom?.();
			$(".btn_area .btnCheck").removeClass("active");
		} else {
			attemptCount++;
			if (attemptCount === 1) {
				window.onIncorrectCustom?.();
			} else {
				window.onIncorrectTwiceCustom?.();
				attemptCount = 0;
			}
		}
	});

	// 리셋 버튼
	$(".btnReset").on("click", function () {
		attemptCount = 0;
		window.resetCustom?.();
	});
});
