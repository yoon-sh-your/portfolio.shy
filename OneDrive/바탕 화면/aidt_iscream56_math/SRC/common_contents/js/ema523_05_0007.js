document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const btnReset = document.querySelector(".btnReset");
    const svgList = document.querySelectorAll(".img01");

    if (!svgList.length) {
      console.error("img01 요소가 존재하지 않습니다.");
      return;
    }

    svgList.forEach((svg) => {
      const imgArea = svg.closest(".img_area");
      const svg2 = imgArea.querySelector("svg.img02");
      const dotWrap = imgArea.querySelector(".dot_wrap");
      const gifSpan = imgArea.querySelector("span[class^='gif']");
      const gifImg = gifSpan?.querySelector("img");
      const guideLine = svg2?.querySelector("path");

      if (!guideLine || !svg2 || !gifImg || !gifSpan) return;

      svg.addEventListener("click", () => {
        if (svg2.classList.contains("folded")) return;
      
        const d = guideLine.getAttribute("d");
        const coords = [...d.matchAll(/(-?\d+\.?\d*)/g)].map(m => parseFloat(m[1]));
      
        let transformStr = "";
        if (coords.length >= 4) {
          const [x1, y1, x2, y2] = coords;
          if (x1 === x2) {
            const cx = x1;
            transformStr = `translate(${2 * cx}, 0) scale(-1, 1)`;
          } else if (y1 === y2) {
            const cy = y1;
            transformStr = `translate(0, ${2 * cy}) scale(1, -1)`;
          } else {
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const cx = x1;
            const cy = y1;
            transformStr =
              `translate(${cx}, ${cy}) ` +
              `rotate(${angle * 180 / Math.PI}) ` +
              `scale(1, -1) ` +
              `rotate(${-angle * 180 / Math.PI}) ` +
              `translate(${-cx}, ${-cy})`;
          }
        }
      
        svg2.style.transition = "transform 0.6s ease-in-out";
        svg2.style.transformOrigin = "left center";
        svg2.style.transform = transformStr;
        svg2.classList.add("folded");
      
        if (dotWrap) dotWrap.style.display = "none";
        if (gifSpan) gifSpan.style.display = "block";
      
        // ✅ 추가: .img.flex 숨기기
        const flexWrapper = imgArea.querySelector(".img.flex");
        if (flexWrapper) flexWrapper.style.display = "none";
      
        // 현재 페이지일 때만 버튼 활성화
        const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");
        const parentPage = svg.closest(".page")?.classList.contains(currentPageId);
        if (parentPage) {
          btnReset?.classList.add("active");
        }
      });      
    });

    // ✅ 리셋 버튼 동작
    btnReset?.addEventListener("click", () => {
      const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");
      if (!currentPageId) return;

      const currentPage = document.querySelector(`.page.${currentPageId}`);
      if (!currentPage) return;

      currentPage.querySelectorAll(".img_area").forEach(imgArea => {
        const svg2 = imgArea.querySelector("svg.img02");
        const dotWrap = imgArea.querySelector(".dot_wrap");
        const gifSpan = imgArea.querySelector("span[class^='gif']");
        const gifImg = gifSpan?.querySelector("img");

        if (svg2) {
          svg2.style.transform = "";
          svg2.classList.remove("folded");
        }
        if (dotWrap) {
          dotWrap.style.display = "flex";
        }
        if (gifImg && gifSpan) {
          // ✅ GIF src 리셋해서 재생 초기화
          const src = gifImg.getAttribute("src");
          gifImg.setAttribute("src", src);
          gifSpan.style.display = "none"; // gif span 숨기기
        }
      });

      const flexWrapper = imgArea.querySelector(".img.flex");
      if (flexWrapper) flexWrapper.style.display = "flex";

      btnReset.classList.remove("active");
    });

    // ✅ 페이지 이동 감지하고 리셋버튼 상태 자동 조정
    document.addEventListener("click", (e) => {
      if (e.target.closest(".paging_controller button")) {
        setTimeout(() => {
          updateResetButtonState();
        }, 100); // 페이지 이동 후 0.3초 후 체크
      }
    });

    function updateResetButtonState() {
      const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");
      if (!currentPageId) return;

      const currentPage = document.querySelector(`.page.${currentPageId}`);
      if (!currentPage) return;

      const hasFoldedSvg = currentPage.querySelector("svg.img02.folded");

      if (hasFoldedSvg) {
        btnReset?.classList.add("active");
      } else {
        btnReset?.classList.remove("active");
      }
    }
  }, 100);
});
