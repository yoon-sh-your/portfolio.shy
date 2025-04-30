runAfterAppReady(() => {
  function initPage4Interaction() {
    const wrapper = document.querySelector("#app_wrap");
    const currentPageId = wrapper?.getAttribute("data-current-page");
    if (currentPageId !== "page_4") return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    console.log("✅ page_4 진입 확인");

    const questionBox = currentPage.querySelector(".question_box");
    const inner1 = questionBox.querySelector(".inner1");
    const inner2 = questionBox.querySelector(".inner2");
    const inner3 = questionBox.querySelector(".inner3");

    const select1 = inner1.querySelector("select.custom_dropdown");
    const customSelect1 = inner1.querySelector(".custom_select");
    const select2 = inner2.querySelector("select.custom_dropdown");
    const customSelect2 = inner2.querySelector(".custom_select");
    const select3 = inner3.querySelector("select.custom_dropdown");
    const customSelect3 = inner3.querySelector(".custom_select");

    const textarea1 = inner1.querySelector("math-field.textarea");
    const textarea2 = inner2.querySelector("math-field.textarea");
    const textarea3 = inner3.querySelector("math-field.textarea");

    if (!select1 || !customSelect1 || !select2 || !customSelect2 || !select3 || !customSelect3 || !textarea1 || !textarea2 || !textarea3) {
      console.warn("❌ 필수 요소 누락");
      return;
    }

    let inputDone = false;
    let selected2 = null;

    textarea1.addEventListener("input", () => {
      const value = textarea1.getValue()?.trim();
      inputDone = !!value;
      console.log("✏️ 입력 감지됨:", inputDone);

      setTimeout(() => {
        checkAndFixButtonDataValue(customSelect1);
      }, 0);
    });

    textarea2.addEventListener("input", () => {
      const value = textarea2.getValue()?.trim();
      console.log("✏️ inner2 입력 감지됨:", value);

      setTimeout(() => {
        checkAndFixButtonDataValue(customSelect2);
      }, 0);
    });

    textarea3.addEventListener("input", () => {
      const value = textarea3.getValue()?.trim();
      console.log("✏️ inner3 입력 감지됨:", value);

      setTimeout(() => {
        checkAndFixButtonDataValue(customSelect3);
      }, 0);
    });

    select1.addEventListener("change", function () {
      const selectedValue = this.value;
      if (!selectedValue) return;

      if (!select1.dataset.initialValue) {
        select1.dataset.initialValue = selectedValue;

        const button1 = customSelect1.querySelector(".select_trigger");
        button1.dataset.initialButtonValue = selectedValue;
        button1.dataset.value = selectedValue;

        console.log("🔐 최초 inner1 선택 저장:", selectedValue);
      } else {
        if (inputDone && selectedValue !== select1.dataset.initialValue) {
          console.log("🚨 다른 값 선택됨 (inner2용):", selectedValue);

          inner2.style.display = "flex";

          select2.value = selectedValue;
          updateCustomSelect(customSelect2, selectedValue);

          selected2 = selectedValue;

          select1.value = select1.dataset.initialValue;
          restoreSelectButton(customSelect1, select1.dataset.initialValue);

          setTimeout(() => {
            forceRestoreButton(customSelect1);
          }, 0);

          textarea2.setValue("");

          disableOptions(customSelect2, [select1.dataset.initialValue]);

          questionBox.classList.add("input_row");
          console.log("🎯 inner2 열림 + inner1 복원 완료");
        }
      }
    });

    select2.addEventListener("change", function () {
      const selectedValue = this.value;
      if (!selectedValue) return;

      if (!selected2) {
        selected2 = selectedValue;

        const button2 = customSelect2.querySelector(".select_trigger");
        button2.dataset.initialButtonValue = selectedValue;
        button2.dataset.value = selectedValue;

        console.log("🔐 최초 inner2 선택 저장:", selected2);
      } else {
        if (inputDone && selectedValue !== selected2) {
          console.log("🚨 다른 값 선택됨 (inner3용):", selectedValue);

          inner3.style.display = "flex";

          select3.value = selectedValue;
          updateCustomSelect(customSelect3, selectedValue);

          select2.value = selected2;
          restoreSelectButton(customSelect2, selected2);

          setTimeout(() => {
            forceRestoreButton(customSelect2);
          }, 0);

          textarea3.setValue("");

          disableOptions(customSelect3, [select1.dataset.initialValue, selected2]);

          questionBox.classList.add("input_row");
          console.log("🎯 inner3 열림 + inner2 복원 완료");
        }
      }
    });

    function updateCustomSelect(customSelectBox, valueToSelect) {
      if (!customSelectBox) return;

      setTimeout(() => {
        const button = customSelectBox.querySelector(".select_trigger");
        const items = customSelectBox.querySelectorAll(".select_options li");

        items.forEach(li => {
          if (li.dataset.value === valueToSelect) {
            li.classList.add("selected");

            button.dataset.value = li.dataset.value;
            button.dataset.initialButtonValue = li.dataset.value;
            button.classList.remove("default");
            button.classList.add("completion");

            const childNodes = Array.from(button.childNodes);
            let textNodeFound = false;
            for (const node of childNodes) {
              if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = li.textContent.trim() + " ";
                textNodeFound = true;
                break;
              }
            }
            if (!textNodeFound) {
              const textNode = document.createTextNode(li.textContent.trim() + " ");
              button.insertBefore(textNode, button.firstChild);
            }
          } else {
            li.classList.remove("selected");
          }
        });
      }, 0);
    }

    function restoreSelectButton(customSelectBox, valueToRestore) {
      if (!customSelectBox) return;

      const button = customSelectBox.querySelector(".select_trigger");
      const li = [...customSelectBox.querySelectorAll(".select_options li")]
        .find(li => li.dataset.value === valueToRestore);

      if (!li) return;

      button.dataset.value = li.dataset.value;
      button.dataset.initialButtonValue = li.dataset.value;
      button.classList.remove("default");
      button.classList.add("completion");

      const childNodes = Array.from(button.childNodes);
      let textNodeFound = false;
      for (const node of childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = li.textContent.trim() + " ";
          textNodeFound = true;
          break;
        }
      }
      if (!textNodeFound) {
        const textNode = document.createTextNode(li.textContent.trim() + " ");
        button.insertBefore(textNode, button.firstChild);
      }

      customSelectBox.querySelectorAll(".select_options li").forEach(li => {
        li.classList.remove("selected");
      });
      li.classList.add("selected");
    }

    function disableOptions(customSelectBox, valuesToDisable) {
      if (!customSelectBox) return;

      const items = customSelectBox.querySelectorAll(".select_options li");
      items.forEach(li => {
        if (valuesToDisable.includes(li.dataset.value)) {
          li.classList.add("disabled");
          li.style.pointerEvents = "none";
          li.style.opacity = "0.5";
        } else {
          li.classList.remove("disabled");
          li.style.pointerEvents = "";
          li.style.opacity = "";
        }
      });
    }

    function checkAndFixButtonDataValue(customSelectBox) {
      if (!customSelectBox) return;

      const button = customSelectBox.querySelector(".select_trigger");
      const selectedLi = customSelectBox.querySelector(".select_options li.selected");

      if (button && selectedLi) {
        const liValue = selectedLi.dataset.value;
        const liText = selectedLi.textContent.trim();

        button.dataset.value = liValue;
        button.dataset.initialButtonValue = liValue;

        const childNodes = Array.from(button.childNodes);
        let textNodeFound = false;
        for (const node of childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = liText + " ";
            textNodeFound = true;
            break;
          }
        }
        if (!textNodeFound) {
          const textNode = document.createTextNode(liText + " ");
          button.insertBefore(textNode, button.firstChild);
        }
      }
    }

    function forceRestoreButton(customSelectBox) {
      if (!customSelectBox) return;

      const button = customSelectBox.querySelector(".select_trigger");
      if (!button) return;

      const correctValue = button.dataset.initialButtonValue;
      if (correctValue) {
        setTimeout(() => {
          button.dataset.value = correctValue;
          console.warn(`✅ (setTimeout) 버튼 data-value 복구 완료: ${correctValue}`);
        }, 0);
      }
    }

    // ✅ btnReset 클릭 시 page_4만 초기화
    const btnReset = document.querySelector(".btnReset");
    btnReset?.addEventListener("click", () => {
      const currentPageId = wrapper?.getAttribute("data-current-page");
      if (currentPageId !== "page_4") return;

      console.log("🔄 btnReset 클릭 → page_4 초기화 시작");

      [select1, select2, select3].forEach(select => {
        select.value = "";
      });

      [customSelect1, customSelect2, customSelect3].forEach(customSelectBox => {
        const button = customSelectBox.querySelector(".select_trigger");
        if (button) {
          button.dataset.value = "";
          button.dataset.initialButtonValue = "";
          button.classList.remove("completion");
          button.classList.add("default");

          button.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              node.textContent = "선택 ";
            }
          });
        }

        customSelectBox.querySelectorAll(".select_options li").forEach(li => {
          li.classList.remove("selected", "disabled");
          li.style.pointerEvents = "";
          li.style.opacity = "";
        });
      });

      [textarea1, textarea2, textarea3].forEach(textarea => {
        textarea.setValue("");
      });

      inner2.style.display = "none";
      inner3.style.display = "none";

      questionBox.classList.remove("input_row");

      console.log("✅ page_4 초기화 완료");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initPage4Interaction();
  });

  const appWrapForObserver = document.querySelector("#app_wrap");
  if (appWrapForObserver) {
    const observer = new MutationObserver(() => {
      initPage4Interaction();
    });
    observer.observe(appWrapForObserver, {
      attributes: true,
      attributeFilter: ["data-current-page"]
    });
  }

  window.onCorrectCustom = function () {
    const wrapper = document.querySelector("#app_wrap");
    const currentPageId = wrapper?.getAttribute("data-current-page");
    if (currentPageId !== "page_4") return; // ✅ 현재 페이지가 page_4일 때만
  
    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;
  
    console.log("🎯 확인 버튼 클릭됨 → example_box에 on 클래스 추가 시작");
  
    const exampleBoxes = currentPage.querySelectorAll(".input_wrap .example_box");
    exampleBoxes.forEach(box => {
      box.classList.add("on");
    });
  
    console.log("✅ example_box에 on 클래스 추가 완료");
  };
  
});
