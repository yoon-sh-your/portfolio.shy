/** 헤딩 타이틀 */
//타이틀 단원 숫자 자동 삽입
document.querySelectorAll(".title h1[data-number]").forEach((h1) => {
  const numberStr = h1.dataset.number; // data-number 값 가져오기
  const numberArray = numberStr.split(""); // 숫자를 한 글자씩 배열로 변환

  // 숫자들을 감쌀 span 태그 생성
  const numberWrapper = document.createElement("span");
  numberWrapper.classList.add("number_images"); // CSS 스타일을 위한 클래스 추가

  // 숫자별 이미지 태그 생성 및 추가
  numberArray.forEach((num) => {
    const img = document.createElement("img");
    img.src = `../../common_contents/common/img/title_heading_${num}.svg`;
    img.alt = `숫자 ${num}`;

    numberWrapper.appendChild(img); // span 안에 이미지 추가
  });

  h1.prepend(numberWrapper); // h1 태그의 기존 텍스트 앞에 숫자(span) 삽입
});

document.querySelectorAll("h2[data-type]").forEach((h2) => {
  const typeValue = h2.dataset.type; // data-type 값 가져오기
  const titleText = h2.dataset.text; // data-text 값 가져오기
  const digit = typeValue.replace(/\D/g, ""); // 숫자만 남기고 제거

  if (digit) {
    const img = document.createElement("img");
    const titleHead = document.createElement("div");

    if(titleText == '창의+'){
      titleHead.classList.add("creative");
      h2.parentNode.classList.add('creative_plus');
    }else{
      titleHead.classList.add("title_head");
    }

    img.src = `../../common_contents/common/img/title_mid_${digit}.svg`; // 이미지 파일명 구성
    digit == "1" ? ((img.alt = "자기주도"), (titleHead.innerText = titleText)) : digit == "2" ? ((img.alt = "생각 깨우기"), (titleHead.innerText = titleText)) : null;

    if(titleText == '창의+'){
      titleHead.appendChild(img); // h2 태그 텍스트 앞에 이미지 삽입
      
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');

      span1.lang = 'y';
      span1.innerHTML = '창';
      span1.classList.add('ctxt1');
      span2.lang = 'y';
      span2.innerHTML = '의';
      span2.classList.add('ctxt2');

      titleHead.appendChild(span1);
      titleHead.appendChild(span2);

      h2.parentNode.prepend(titleHead);
    }else{
      h2.prepend(titleHead);
      titleHead.prepend(img); // h2 태그 텍스트 앞에 이미지 삽입
    }
  }
});

document.querySelectorAll("h2[data-icon]").forEach((h2) => {
  const iconName = h2.dataset.icon; // data-type 값 가져오기

  if (iconName) {
    const img = document.createElement("img");
    img.src = `../../common_contents/common/img/icon_${iconName}.svg`; // 이미지 파일명 구성
    img.alt = `icon_${iconName}`;
    img.classList.add(`icon_${iconName}`);

    h2.prepend(img); // h2 태그 텍스트 앞에 이미지 삽입
  }
});

document.querySelectorAll("h2[data-head]").forEach((h2) => {
  const headNumber = h2.dataset.head; // data-type 값 가져오기
  const isStar = h2.dataset.star;

  if (headNumber) {
    const img = document.createElement("img");
    img.src = `../../common_contents/common/img/title_heading_num_${headNumber}${isStar ? "_star" : ""}.svg`;
    img.classList.add("heading");
    img.art = `heading number ${headNumber}`; // 이미지 파일명 구성

    h2.prepend(img); // h2 태그 텍스트 앞에 이미지 삽입
  }
});

// 대발문 분수가 있으면서, 한줄인 경우 처리를 위한 스크립트 (250423 수정)
document.querySelectorAll("h2").forEach((h2) => {
  let flag = false;

  const hasFractoinBox = h2.querySelectorAll(".fraction_box");
  if (hasFractoinBox.length > 0) {
    hasFractoinBox.forEach(fraction => {
      if(flag) return;
      if(fraction.parentElement.tagName.toLowerCase() == 'h2') flag = true;
    });
    
    if (flag)  h2.classList.add("fraction-line-1");
  }
});

/****************************************************************************************************************/
/** 정오답 체크 기능 */
// 문서 로드 시 정답 힌트 자동 생성
const elements = document.querySelectorAll("math-field[data-answer-single], math-field[data-answer-multi], .custom_dropdown[data-answer-single]");
if (elements.length > 0) {
  elements.forEach((element) => {
    const answer = element.getAttribute("data-answer-single");
    if (answer !== "empty_answer") {
      createHint(element);
    }
  });
}

// 문서 로드 시 input, textarea에 플레이스 홀더 자동생성
document.querySelectorAll(".input_wrap math-field").forEach((element) => {
  if (!element.hasAttribute("placeholder") || (element.placeholder && element.placeholder.trim() === "")) {
    element.setAttribute("placeholder", "\u200B"); // 빈값 설정
  }
});

/** ✅ 정답 힌트 생성 */
function createHint(element, multi = false) {
  let answerText;
  let hint;

  if(element.getAttribute("data-custom-hint") === 'y') return;

  if (multi !== false) {
    const multiAnswer = JSON.parse(element.getAttribute("data-answer-multi"));
    answerText = multiAnswer.values[multi]?.trim() || "";

    if (element.parentElement.querySelectorAll(".multiple_hint").length == 0) {
      const multiple = document.createElement("div");
      multiple.classList.add("multiple_hint");
      element.parentElement.querySelectorAll(".text_hint")[0].append(multiple);
      element.parentElement.querySelectorAll(".text_hint")[0].classList.add("multiple_hint_wrap");
    }

    hint = document.createElement("span");
  } else {
    removeHint(element); // 기존 힌트 제거

    hint = document.createElement("div");
    hint.classList.add("text_hint");

    answerText = element.dataset.answerSingle?.trim() || "";
  }

  // 분수 표현 찾기
  const fractions = [];
  let remainingText = answerText;
  let match;

  // 새로운 분수 패턴: 15(1)/(2) 또는 (1)/(2)
  // const newFractionPattern = /(\d+\s*)?\((\d+)\)\/\((\d+)\)/g;
  const newFractionPattern = /(\d+\s*)?\(((?:\d+|(?:\d+xx\d+)|(?:\d+\-:\d+)))\)\/\(((?:\d+|(?:\d+xx\d+)|(?:\d+\-:\d+)))\)/g;

  while ((match = newFractionPattern.exec(remainingText)) !== null) {
    fractions.push({
      start: match.index,
      end: match.index + match[0].length,
      whole: match[1] ? match[1].trim() : null, // 정수부 (옵션)
      numerator: match[2], // 분자
      denominator: match[3], // 분모
    });
  }

  // \frac 패턴 제거 (주석 처리 또는 삭제)
  // const bracketPattern = /\\frac\{(\d+)\}\{(\d+)\}/g;
  // while ((match = bracketPattern.exec(remainingText)) !== null) {
  //     // ... 기존 \frac{}{} 패턴 처리 로직 ...
  // }

  // \fracXY 패턴 제거 (주석 처리 또는 삭제)
  // const simplePattern = /\\frac(\d)(\d)/g;
  // while ((match = simplePattern.exec(remainingText)) !== null) {
  //     // ... 기존 \fracXY 패턴 처리 로직 ...
  // }

  if (fractions.length > 0) {
    if (multi !== false) {
    } else {
      hint.classList.add("fraction");
    }

    // 시작 위치를 기준으로 정렬
    fractions.sort((a, b) => a.start - b.start);

    let lastEnd = 0;

    fractions.forEach((fraction, index) => {
      // 현재 분수 앞의 텍스트 처리
      if (fraction.start > lastEnd) {
        const beforeText = remainingText.substring(lastEnd, fraction.start).replace(/\xx/g, "×").replace(/\-:/g, "÷");
        if (beforeText.trim()) {
          const textSpan = document.createElement("span");
          textSpan.textContent = beforeText;
          hint.appendChild(textSpan);
          console.log(beforeText);
          // hint.appendChild(createSpace()); // 텍스트 뒤에 공백 추가
        }
      }

      // 정수부 추가 (존재하는 경우)
      if (fraction.whole) {
        const wholeNumberSpan = document.createElement("span");
        wholeNumberSpan.textContent = fraction.whole;

        const mixedFranction = document.createElement("div");
        mixedFranction.classList.add("mixed_fraction");
        mixedFranction.appendChild(wholeNumberSpan);

        // 분수 추가
        mixedFranction.appendChild(createFractionBox(fraction.numerator, fraction.denominator));

        hint.appendChild(mixedFranction);
      } else {
        // 분수 추가
        hint.appendChild(createFractionBox(fraction.numerator, fraction.denominator));
      }

      lastEnd = fraction.end;

      // 분수 뒤에 공백 추가 (마지막 분수가 아니고, 뒤에 텍스트가 올 경우 대비)
      if (index < fractions.length - 1 || lastEnd < remainingText.length) {
        // hint.appendChild(createSpace());
      }
    });

    // 마지막 분수 이후의 텍스트 처리
    if (lastEnd < remainingText.length) {
      const afterText = remainingText.substring(lastEnd).replace(/\xx/g, "×").replace(/\-:/g, "÷");
      if (afterText.trim()) {
        const textSpan = document.createElement("span");
        textSpan.textContent = afterText;
        hint.appendChild(textSpan);
      }
    }
  } else {
    // 일반 텍스트일 경우
    hint.textContent = answerText.replace(/\xx/g, "×").replace(/\-:/g, "÷");

    const isPureNumber = /^[\d.]+$/.test(answerText);
    const looksLikeFormula = /[\d]+[\+\-\*\/xX]{1,}[\d\{\}]+/.test(answerText);

    // ✅ 텍스트이며 수식이 아닌 경우만 lang="y" 부여
    if (answerText && !isPureNumber && !looksLikeFormula) {
      hint.setAttribute("lang", "y");
    }
  }

  // 🔹 custom_dropdown 처리
  if (element.classList.contains("custom_dropdown")) {
    setTimeout(() => {
      const customSelect = element.nextElementSibling;
      if (customSelect && customSelect.classList.contains("custom_select")) {
        customSelect.appendChild(hint);
      }
    }, 100);
  } else {
    // 일반 input / textarea / math-field
    if (multi !== false) {
      const textEqual = document.createElement("span");
      textEqual.textContent = "=";

      element.parentElement.querySelectorAll(".multiple_hint")[0].appendChild(textEqual);
      element.parentElement.querySelectorAll(".multiple_hint")[0].appendChild(hint);
    } else {
      element.after(hint);
    }
  }

  if(element.getAttribute("data-multi-hint") == 'y'){
    if (element.getAttribute("data-answer-multi")) {
      const multiAnswer = JSON.parse(element.getAttribute("data-answer-multi"));
      if (multiAnswer.values.length > 1) {
        if (multi !== false) {
          if (multiAnswer.values.length - 1 > multi) {
            createHint(element, multi + 1);
          }
        } else {
          createHint(element, 1);
        }
      }
    }
  }
}

// 분수 생성 함수
function createFractionBox(numerator, denominator) {
  const fractionBox = document.createElement("div");
  fractionBox.classList.add("fraction_box");

  const numeratorSpan = document.createElement("span");
  numeratorSpan.textContent = numerator.replace(/\xx/g, "×").replace(/\-:/g, "÷");

  const denominatorSpan = document.createElement("span");
  denominatorSpan.textContent = denominator.replace(/\xx/g, "×").replace(/\-:/g, "÷");

  fractionBox.appendChild(numeratorSpan);
  fractionBox.appendChild(denominatorSpan);

  return fractionBox;
}

// 공백 생성 함수
function createSpace() {
  const space = document.createElement("span");
  space.textContent = " ";
  return space;
}

/**
 * 정답 힌트값 변경 감지
 */
function observeAnswerChange(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-answer-single") {
          createHint(mutation.target); // 변경 감지 시 힌트 다시 생성
        }
      });
    });

    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-answer-single"],
    });
  });
}

observeAnswerChange(".input_wrap math-field:not(.textarea)[data-answer-single], .input_wrap math-field.textarea[data-answer-single], .custom_dropdown[data-answer-single]");

/* 힌트 제거 */
function removeHint(element) {
  const existingHint = element.parentNode.querySelector(".text_hint");
  if (existingHint) existingHint.remove();

  const multipleHint = element.parentNode.querySelector(".multiple_hint");
  if (multipleHint) multipleHint.remove();
}

/*section.contents 패딩값 동적 제어*/
document.querySelectorAll("section.contents").forEach((section) => {
  const btnArea = section.querySelector(".btn_area");

  const isHidden = !btnArea || window.getComputedStyle(btnArea).display === "none";

  if (isHidden) {
    section.style.marginBottom = "unset";
  }
});

/* fraction_box 높이 동적 제어 */
document.querySelectorAll(".fraction_box").forEach((parent) => {
  const child = parent.querySelector("span"); // 첫 번째 span을 높이 기준으로 가정

  if (child) {
    // span 요소가 존재하는지 확인
    const updateHeight = () => {
      const height = child.offsetHeight;
      // CSS 변수를 사용하여 높이 동적 설정 (예: --child-height)
      // 해당 CSS 변수를 사용하는 CSS 규칙이 필요합니다.
      // 예: .fraction_box span:last-child { top: calc(var(--child-height, 0) * -1px); }
      parent.style.setProperty("--child-height", `${height}px`);
    };

    updateHeight(); // 초기 높이 설정

    // 자식 요소의 크기가 변경될 수 있는 경우 ResizeObserver 사용
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(child);
  }
});

/* 자기주도2 카드 개수 자동 카운트 */
document.querySelectorAll(".letCheck").forEach((card) => {
  card.dataset.count = card.querySelectorAll("li").length;
});
