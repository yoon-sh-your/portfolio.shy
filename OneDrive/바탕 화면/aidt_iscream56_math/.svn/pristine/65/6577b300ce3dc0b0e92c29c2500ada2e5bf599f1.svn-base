document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const svgList = document.querySelectorAll("svg.img01");
    const btnReset = document.querySelector(".btnReset");

    if (!svgList.length) {
      console.error("img01 요소가 존재하지 않습니다.");
      return;
    }

    svgList.forEach((svg) => {
      const imgArea = svg.closest(".img_area");
      const svg2 = imgArea.querySelector("svg.img02");
      const dotWrap = imgArea.querySelector(".dot_wrap");
      const guideLine = svg.querySelector("path.line");

      if (!guideLine || !svg2) return;

      svg.addEventListener("click", () => {
        if (svg2.classList.contains("folded")) return;

        const d = guideLine.getAttribute("d");
        const coords = [...d.matchAll(/(-?\d+\.?\d*)/g)].map(m => parseFloat(m[1]));
        const [x1, y1, x2, y2] = coords;

        let transformStr = "";

        if (x1 === x2) {
          // 수직 대칭
          const cx = x1;
          transformStr = `translate(${2 * cx}, 0) scale(-1, 1)`;
        } else if (y1 === y2) {
          // 수평 대칭
          const cy = y1;
          transformStr = `translate(0, ${2 * cy}) scale(1, -1)`;
        } else {
          // 기울어진 선에 대한 대칭 처리
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

        svg2.style.transition = "transform 0.6s ease-in-out";
        svg2.style.transformOrigin = "left center";
        svg2.style.transform = transformStr;
        svg2.classList.add("folded");

        if (dotWrap) dotWrap.style.display = "none";
        btnReset?.classList.add("active");
      });
    });

    // 리셋 버튼 동작
    btnReset?.addEventListener("click", () => {
      document.querySelectorAll("svg.img02").forEach(svg2 => {
        svg2.style.transform = "";
        svg2.classList.remove("folded");
      });

      document.querySelectorAll(".dot_wrap").forEach(dot => {
        dot.style.display = "flex";
      });

      btnReset.classList.remove("active");
    });
  }, 100);
});
