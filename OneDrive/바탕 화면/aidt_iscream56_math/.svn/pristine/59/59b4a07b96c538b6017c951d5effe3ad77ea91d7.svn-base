runAfterAppReady(() => {
	const $draggable = $(".drag_checkout .draggable");
	const $droppable = $(".drag_checkout .droppable");
	let selectedDraggable = null;

	function updateCheckoutHighlights(apply) {
		$droppable.removeClass('ui-state-hover ui-droppable-active');
		if (apply && selectedDraggable) {
			const isTriangle = selectedDraggable.hasClass("triangle");
			const isCircle = selectedDraggable.hasClass("circle");
			const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

			if (typeClass) {
				$droppable.addClass('ui-state-hover ui-droppable-active');
			}
		}
	}

	$draggable.draggable({
		helper: "clone",
		revert: "invalid",
		revertDuration: 0,
		cursor: "move",
		start: function (event, ui) {
			if (selectedDraggable) {
				selectedDraggable.removeClass('selected');
				selectedDraggable = null;
				updateCheckoutHighlights(false);
			}
			ui.position.left /= globalScale;
			ui.position.top /= globalScale;
			audioManager.playSound("drag");
		},
		drag: function (event, ui) {
			ui.position.left /= globalScale;
			ui.position.top /= globalScale;
		},
		stop: function (event, ui) {
			updateCheckoutHighlights(false);
			setTimeout(function () {
				checkAnswer();
				const $group = $(".drag_group.g1");
				const hasDroppedItems =
				$group.find(".droppable .triangle, .droppable .circle").length > 0;
				if (!hasDroppedItems) {
				$group.removeAttr("data-correction");
				window.forceWatchEvaluation();
				}
			}, 50);
		},
	});

	$droppable.droppable({
		accept: ".drag_checkout .draggable",
		tolerance: "pointer",
		drop: function (event, ui) {
			const $this = $(this);
			const $dragItem = $(ui.draggable);
			const isTriangle = $dragItem.hasClass("triangle");
			const isCircle = $dragItem.hasClass("circle");
			const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

		if (!typeClass) return;

			$this.find(".triangle, .circle").remove();
			$this.attr("data-value", "false false");

			const $droppedEl = $(`<div class="${typeClass}"></div>`);
			$this.append($droppedEl);

			let currentValues = [false, false];
			if (isTriangle) currentValues[0] = true;
			if (isCircle) currentValues[1] = true;
			$this.attr("data-value", currentValues.join(" "));

			$droppedEl.draggable({
				revert: "invalid",
				revertDuration: 0,
				containment: "document",
				helper: "original",
				start: function (event, ui) {
				ui.position.left /= globalScale;
				ui.position.top /= globalScale;
				audioManager.playSound("drag");
				},
				drag: function (event, ui) {
				ui.position.left /= globalScale;
				ui.position.top /= globalScale;
				},
				stop: function (event, ui) {
				const scale = globalScale || 1;
				const droppedElRect = this.getBoundingClientRect();
				const droppableRect = $this[0].getBoundingClientRect();

				const droppedCenterX = (droppedElRect.left + droppedElRect.width / 2) / scale;
				const droppedCenterY = (droppedElRect.top + droppedElRect.height / 2) / scale;

				const droppableLeft = droppableRect.left / scale;
				const droppableRight = droppableRect.right / scale;
				const droppableTop = droppableRect.top / scale;
				const droppableBottom = droppableRect.bottom / scale;

				const isOutside =
					droppedCenterX < droppableLeft ||
					droppedCenterX > droppableRight ||
					droppedCenterY < droppableTop ||
					droppedCenterY > droppableBottom;

				if (isOutside) {
					let valuePartsStop = ($this.attr("data-value") || "false false").split(" ");
					let currentValuesStop = [
						valuePartsStop[0] === "true",
						valuePartsStop[1] === "true",
					];

					if ($(this).hasClass("triangle")) {
						currentValuesStop[0] = false;
					} else if ($(this).hasClass("circle")) {
						currentValuesStop[1] = false;
					}
					$this.attr("data-value", currentValuesStop.join(" "));
					$(this).remove();
					audioManager.playSound("drop");
				} else {
					$(this).css({ top: 0, left: 0 });
				}

				checkAnswer();

				const $group = $(".drag_group.g1");
				const hasDroppedItems =
					$group.find(".droppable .triangle, .droppable .circle").length > 0;
				if (!hasDroppedItems) {
					$group.removeAttr("data-correction");
					window.forceWatchEvaluation();
				}
				},
			});

			$this.append($droppedEl);
			audioManager.playSound("drop");
			checkAnswer();
		},
	});

	$draggable.off('click').on('click', function(e) {
		e.stopPropagation();
		const $this = $(this);

		if (selectedDraggable && selectedDraggable[0] === this) {
			selectedDraggable.removeClass('selected');
			selectedDraggable = null;
		} else {
			if (selectedDraggable) {
				selectedDraggable.removeClass('selected');
			}
			selectedDraggable = $this;
			selectedDraggable.addClass('selected');
			audioManager.playSound('click');
		}
		updateCheckoutHighlights(true);
	});

	$droppable.off('click').on('click', function(e) {
		e.stopPropagation();
		const $drop = $(this);

		if (selectedDraggable) {
			const $dragItem = selectedDraggable;
			const isTriangle = $dragItem.hasClass("triangle");
			const isCircle = $dragItem.hasClass("circle");
			const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

			if (!typeClass) return;

			$drop.find(".triangle, .circle").remove();
			$drop.attr("data-value", "false false");

			const $droppedEl = $(`<div class="${typeClass}"></div>`);
			$drop.append($droppedEl);

			let currentValues = [false, false];
			if (isTriangle) currentValues[0] = true;
			if (isCircle) currentValues[1] = true;
			$drop.attr("data-value", currentValues.join(" "));

			$droppedEl.draggable({
				revert: "invalid",
				revertDuration: 0,
				containment: "document",
				helper: "original",
				start: function (event, ui) {
					ui.position.left /= globalScale;
					ui.position.top /= globalScale;
					audioManager.playSound("drag");
				},
				drag: function (event, ui) {
					ui.position.left /= globalScale;
					ui.position.top /= globalScale;
				},
				stop: function (event, ui) {
					const scale = globalScale || 1;
					const droppedElRect = this.getBoundingClientRect();
					const droppableRect = $drop[0].getBoundingClientRect();
					const droppedCenterX = (droppedElRect.left + droppedElRect.width / 2) / scale;
					const droppedCenterY = (droppedElRect.top + droppedElRect.height / 2) / scale;
					const droppableLeft = droppableRect.left / scale;
					const droppableRight = droppableRect.right / scale;
					const droppableTop = droppableRect.top / scale;
					const droppableBottom = droppableRect.bottom / scale;
					const isOutside =
						droppedCenterX < droppableLeft ||
						droppedCenterX > droppableRight ||
						droppedCenterY < droppableTop ||
						droppedCenterY > droppableBottom;

					if (isOutside) {
						let valuePartsStop = ($drop.attr("data-value") || "false false").split(" ");
						let currentValuesStop = [
							valuePartsStop[0] === "true",
							valuePartsStop[1] === "true",
						];
						if ($(this).hasClass("triangle")) {
							currentValuesStop[0] = false;
						} else if ($(this).hasClass("circle")) {
							currentValuesStop[1] = false;
						}
						$drop.attr("data-value", currentValuesStop.join(" "));
						$(this).remove();
						audioManager.playSound("drop");
					} else {
						$(this).css({ top: 0, left: 0 });
					}
					checkAnswer();
					const $group = $(".drag_group.g1");
					const hasDroppedItems =
						$group.find(".droppable .triangle, .droppable .circle").length > 0;
					if (!hasDroppedItems) {
						$group.removeAttr("data-correction");
						window.forceWatchEvaluation();
					}
				},
			});

			audioManager.playSound("drop");
			checkAnswer();

			selectedDraggable.removeClass('selected');
			selectedDraggable = null;
			updateCheckoutHighlights(false);
		} else {
		}
	});

	$(document).off("click.checkoutDragDrop060005").on("click.checkoutDragDrop060005", function(e) {
		if (selectedDraggable && !$(e.target).closest('.drag_checkout .draggable').length && !$(e.target).closest('.drag_checkout .droppable').length) {
			selectedDraggable.removeClass('selected');
			selectedDraggable = null;
			updateCheckoutHighlights(false);
		}
	});

	function checkAnswer() {
		const $group = $(".drag_group.g1");
		const $droppables = $group.find(".droppable");
		const answerString = $group.attr("data-answer-single");
	
		if (!answerString) {
		console.error("Answer data (data-answer-single) not found on .drag_group.g1");
		return;
		}
	
		let answerArray;
		try {
		const validJsonString = answerString.replace(/'/g, '"');
		answerArray = JSON.parse(validJsonString);
		} catch (e) {
		console.error("Failed to parse answer data from data-answer-single:", e);
		return;
		}
	
		let isCorrect = true;
	
		if ($droppables.length !== answerArray.length) {
		console.warn("Mismatch between the number of droppable elements and the answer array length.");
		isCorrect = false;
		} else {
		$droppables.each(function (index) {
			const $drop = $(this);
			const valueStr = $drop.attr("data-value") || "false false";
			const valueParts = valueStr.split(" ");
			const currentValue = [valueParts[0] === "true", valueParts[1] === "true"];
			const expectedValue = answerArray[index];
	
			let isThisCorrect = true;
	
			if (expectedValue[0] && !currentValue[0]) {
				const $triangle = $('<div class="triangle black"></div>');
				$drop.append($triangle);
				currentValue[0] = true;
			}
			if (expectedValue[1] && !currentValue[1]) {
				const $circle = $('<div class="circle black"></div>');
				$drop.append($circle);
				currentValue[1] = true;
			}
	
			isThisCorrect = (
				currentValue[0] === expectedValue[0] &&
				currentValue[1] === expectedValue[1]
			);
	
			$drop.attr("data-value", `${currentValue[0]} ${currentValue[1]}`);
			$drop.attr("data-correct", isThisCorrect.toString());
	
			if (!isThisCorrect) {
				isCorrect = false;
			}
		});
		}
	
		$group.attr("data-correction", isCorrect.toString());
		window.forceWatchEvaluation();

		
	}
	 

	window.onIncorrectTwiceCustom = function () {
	const $sourceDraggables = $(".drag_checkout .draggable");
	const $droppedDraggables = $(".drag_group.g1 .droppable .triangle, .drag_group.g1 .droppable .circle");
	const $group = $(".drag_group.g1");
	const $droppables = $group.find(".droppable");
	const answerString = $group.attr("data-answer-single");

	$sourceDraggables.draggable("disable");
	$droppedDraggables.draggable("disable");
	$droppables.removeClass("triangle circle");

	if (!answerString) {
		console.error("onIncorrectTwiceCustom: Answer data not found.");
		return;
	}

	let answerArray;
	try {
		const validJsonString = answerString.replace(/'/g, '"');
		answerArray = JSON.parse(validJsonString);
	} catch (e) {
		console.error("onIncorrectTwiceCustom: Failed to parse answer data:", e);
		return;
	}

	if ($droppables.length !== answerArray.length) {
		console.warn("onIncorrectTwiceCustom: Mismatch between droppables and answer length.");
		return;
	}

	$droppables.each(function (index) {
		const $drop = $(this);
		const valueStr = $drop.attr("data-value") || "false false";
		const valueParts = valueStr.split(" ");
		const currentValue = [valueParts[0] === "true", valueParts[1] === "true"];
		const expectedValue = answerArray[index];
		if (currentValue[0] !== expectedValue[0]) {
			$drop.addClass("triangle");
		}
		if (currentValue[1] !== expectedValue[1]) {
			$drop.addClass("circle");
		}
	});

	if (selectedDraggable) {
		selectedDraggable.removeClass('selected');
		selectedDraggable = null;
	}
	updateCheckoutHighlights(false);
	};

	window.resetCustom = function () {
	const $group = $(".drag_group.g1");
	const hadCorrection = $group.attr("data-correction") !== undefined;
	$group.removeAttr("data-correction");
	$group.removeClass("correct incorrect");
	$group.find(".droppable").each(function () {
		$(this).attr("data-value", "false false");
		$(this).find(".triangle, .circle").remove();
		$(this).removeClass("triangle circle");
	});

	const $draggables = $(".drag_checkout .draggable");
	$draggables.draggable("enable");

	if (selectedDraggable) {
		selectedDraggable.removeClass('selected');
		selectedDraggable = null;
	}
	updateCheckoutHighlights(false);
	};

	try {
	defineButtonClassRules([
		{
			selector: ".drag_group.g1",
			key: "custom_check_btn_active",
			test: function (el) {
			const correction = $(el).attr("data-correction");
			return correction !== undefined && correction !== null;
			},
		},
	]);
	} catch (e) {
	console.error("defineButtonClassRules 호출 중 오류 발생:", e);
	}
});
