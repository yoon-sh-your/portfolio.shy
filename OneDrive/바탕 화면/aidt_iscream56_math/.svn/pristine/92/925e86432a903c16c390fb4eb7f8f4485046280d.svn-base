let currentNumber = 1; // 1부터 시작

document.addEventListener("DOMContentLoaded", function () {
  const gridItems = document.querySelectorAll(
    "#page1 .grid-item:not(.highlight)"
  );

  gridItems.forEach((item) => {
    item.addEventListener("click", function () {
      // 이미 숫자가 있는 칸은 무시
      if (item.textContent.trim() !== "") return;

      if (currentNumber <= 12) {
        item.textContent = currentNumber;
/*         item.style.border = "2px solid #673ab7";
        item.style.backgroundColor = "#e6e0f8"; */
        item.style.fontSize = "32px";
        item.style.fontWeight = "700";
        item.style.color = "#333";
        currentNumber++;
      }
    });
  });
});
function resetCustom(pageId) {
  console.log("🔄 resetCustom 실행됨, pageId:", pageId);
  const normalizedId = pageId.replace("_", "");
  const page = document.getElementById(normalizedId);
  if (!page) return;

  const gridItems = page.querySelectorAll(".grid-item");

  gridItems.forEach((item) => {
    if (!item.classList.contains("highlight")) {
      item.className = "grid-item";
      item.textContent = "";
      item.style.border = "";
      item.style.backgroundColor = "";
      item.style.fontSize = "";
      item.style.fontWeight = "";
      item.style.color = "";
    }
  });

  // 숫자 초기화
  currentNumber = 1;

  const answerField = page.querySelector("math-field[data-answer-single]");
  if (answerField && answerField.setValue) {
    answerField.setValue("");
  } else if (answerField) {
    answerField.value = "";
  }
}
