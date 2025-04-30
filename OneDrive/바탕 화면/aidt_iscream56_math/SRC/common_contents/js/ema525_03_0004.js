runAfterAppReady(() => {
  console.log("custom_answer_check.js 실행");

  (function () {
    const faces = document.querySelectorAll(".scene2 .face");
    const btnReset = document.querySelector(".btnReset");

    function resetBaseItem() {
      const baseItems = document.querySelectorAll(".face.base-item");

      baseItems.forEach((item) => {
        item.classList.remove("base-item");
      });
    }

    faces.forEach((face) => {
      face.addEventListener("click", () => {
        const baseItem = document.querySelector(".scene2 .face.select-item");
        let basePairId;
        const selectedPairId = face.dataset.pairId;

        if (baseItem) {
          basePairId = baseItem.dataset.pairId;
        }
        faces.forEach((f) => {
          const currentPairId = f.dataset.pairId;
          if (basePairId === selectedPairId) {
            f.classList.remove("disabled");
            f.classList.remove("select-item");
          } else {
            if (f === face) {
              f.classList.add("select-item");
              f.classList.add("base-item");
            } else if (currentPairId !== selectedPairId) {
              f.classList.add("disabled");
            }
          }
        });
      });
    });

    if (btnReset) {
      btnReset.addEventListener("click", resetBaseItem);
    }
  })();

  (function () {
    const pagingLayout = document.querySelector(".paging_layout");
    const parentSelector = pagingLayout ? ".page" : ".contents";
    const btnReset = document.querySelector(".btnReset");

    function resetCharacter(e) {
      const parent = document.querySelector(".contents .page.on");
      const hiddenCharacter = parent?.querySelector(".hidden_character");

      if (hiddenCharacter) {
        hiddenCharacter.style.display = "none";
      }
    }

    function showHiddenCharacter(event) {
      const clickedElement = event.target;
      const button = clickedElement.closest(".btn-show-character");

      if (!button) return;

      if (button) {
        const parent = button.closest(parentSelector);
        const hiddenCharacter = parent?.querySelector(".hidden_character");

        if (hiddenCharacter) {
          hiddenCharacter.style.display = "block";
        }
      }
    }

    document.addEventListener("click", showHiddenCharacter);
    if (btnReset) {
      btnReset.addEventListener("click", resetCharacter);
    }
  })();
});
