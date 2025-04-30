// initKeypad 함수를 전역으로 노출
window.initKeypad = function() {
  // 페이지 초기화
  const backspace_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="36px" height="36px" fill="#fff"><path d="M360-200q-22 0-40-11.5T289-241L120-480l169-239q13-18 31-29.5t40-11.5h420q24.75 0 42.38 17.62Q840-724.75 840-700v440q0 24.75-17.62 42.37Q804.75-200 780-200H360Zm420-60v-440 440Zm-431 0h431v-440H349L195-480l154 220Zm99-66 112-112 112 112 43-43-113-111 111-111-43-43-110 112-112-112-43 43 113 111-113 111 43 43Z"/></svg>';
  
  const mathFields = document.getElementsByTagName('math-field');
  [...mathFields].forEach((mathField) => {
    // 사운드 비활성화
    mathField.sound = false;
    mathField.setAttribute('sound', 'false');

    if (isConnectedPlaform() === false) {
      // 플랫폼이 아닌 경우 개발용: 키패드 모드가 활성화된 상태에서만 키보드 표시
      if (window.self !== window.top) {
        // iframe 안에 있는 경우
        mathField.mathVirtualKeyboardPolicy = "sandboxed";
        console.log("keypad sandbox");
      }
      else {
        mathField.mathVirtualKeyboardPolicy = 'auto';
      }
    }
    
    // 숫자와 기호만 입력 가능하도록 설정
    if (mathField.getAttribute('type') === 'number') {
      mathField.addEventListener('input', function(event) {
        const value = event.target.getValue('plain-text');
        // 숫자, 기호, 특수문자, 분수식, 빈칸 표기용 네모 기호 허용
        if (!/^[\d+\-*\/=.,:<>()%\\frac{}\\placeholder{}]*$/.test(value)) {
          event.target.value = value.replace(/[^\d+\-*\/=.,:<>()%\\frac{}\\placeholder{}]/g, '');
        }
      });
    }
    
    // textarea 클래스 추가
    if (mathField.classList.contains('textarea')) {
      mathField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          mathField.insert("\\\\");
          event.preventDefault(); // 기본 Enter 동작 방지
        } else if (event.key === "Backspace") {
          const value = mathField.getValue();
          const lines = value.split('\\\\');
          if (lines.length > 1) { // 여러 줄이 있을 때만
            const currentLine = lines[lines.length - 1].trim();
            if (currentLine === '') { // 현재 줄이 비어있으면
              lines.pop(); // 마지막 줄 제거
              mathField.setValue(lines.join('\\\\')); // 나머지 줄들 다시 설정
              event.preventDefault(); // 기본 백스페이스 동작 방지
            }
          }
        }
      });
    }
    
    mathField.addEventListener('input', function(event) {
      // latex.value = mf.value
    });

    mathField.addEventListener("focus", (e) => {
      e.preventDefault();  // 이벤트 전파 중지
      if (isConnectedPlaform() === false) {
        // 플랫폼이 아닌 경우 개발용: 키패드 모드가 활성화된 상태에서만 키보드 표시
        if (keypadModeState.isKeypadMode && !mathField.classList.contains('hint')) {
          mathVirtualKeyboard.show();
        } else {
          mathVirtualKeyboard.hide();
        }
        e.stopPropagation();
      }
      else {
        sendHandwriting(mathField);
      }
    }, true);  // 캡처링 페이즈에서 이벤트 처리
    
    // 포커스 해제 시 키보드 숨김
    mathField.addEventListener("blur", () => {
      if (mathVirtualKeyboard.visible) {
        mathVirtualKeyboard.hide();
      }      
    });
    

    // document.body.style.setProperty("--smart-fence-color", "transparent");
    // document.body.style.setProperty("--composition-background-color", "transparent");
    // document.body.style.setProperty("--contains-highlight-background-color", "transparent");
    
    MathfieldElement.soundsDirectory = null; // 소리 제거
    MathfieldElement.fontsDirectory = null; // 폰트 제거
    
    mathField.textContent = '';  // 초기 내용 지우기
    mathField.mathModeSpace = '\\:' // 수학 모드에서 공백을 넣기 위한 설정
    mathField.mode = "text"; // 기본 모드 설정
    mathField.editToolbar = "none"; // hide toolbar
    mathField.inlineShortcuts = false; // 인라인 단축키 사용 안함  
    mathField.smartFence = false; // 스마트 펜스 비활성화
    mathField.smartFenceColor = "transparent"; // 스마트 펜스 색상 투명으로 설정
    mathField.smartSuperscript = false; // 스마트 위첨자 비활성화

    mathVirtualKeyboard.editToolbar = "none"; // hide toolbar
    mathVirtualKeyboard.plonkSound = null; // 사운드 비활성화
    mathVirtualKeyboard.keypressSound = null; // 키 입력 사운드 비활성화
    
    mathVirtualKeyboard.layouts = [
      {
        label: '숫자/연산 기호',
        rows: [
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
          ['\\frac{#0}\\placeholder{}', { latex: '\\placeholder{}\\frac{#0}\\placeholder{}', width: 2, height: 2 }, '+', '-', '\\times', '\\div', '=', '.', '\\cdots'],
          [{ class: 'separator w10' }, { class: 'separator w20' }, ':', '<', '>', '(', ')', { class: 'action', label: backspace_icon, width: 2, command: ['performWithFeedback', 'deleteBackward'] }]
        ]
      },
      {
        label: '도형/단위',
        rows: [
          ['\\triangledown', '\\square', '\\triangle', '○', '☆', '\\heartsuit', '\\diamond', '˚', { class: 'separator w20' }],
          ['㎜', '㎝', 'm', '㎞', 'g', '㎏', 't', '℃', { class: 'separator w20' }],
          ['㎠', '㎡', '㎢', '㎤', '㎥', 'mL', 'L', { label: '%' }, { class: 'action', label: backspace_icon, width: 2, command: ['performWithFeedback', 'deleteBackward'] }]
        ]
      }
    ];

    /* 업데이트된 lib 받기 전까지 입력 영역 넘치는 문제 임시 수정 */    
    let style = document.createElement('style');
    const computedStyle = window.getComputedStyle(mathField);
    let afterWidth = `width: ${computedStyle.width};`;
    let maxHeight = parseInt(computedStyle.height) - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom);// }
    let afterHeight = `height: ${maxHeight}px;`;

    style.innerHTML = `
            * {
                font-family: 'Pretendard' !important;
            }
            :lang(ko), :lang(ko-kr), :lang(ko-kr-std) {
                --ui-font-family: 'Pretendard';
                --smart-fence-color: transparent;
                --composition-background-color: transparent;
                --contains-highlight-background-color: transparent;
            }
            .ML__container {
                ${afterWidth}
            }
            .ML__content {
                
                align-items: flex-start !important;
                ${afterHeight}
                overflow-y: auto !important; 
            }
            .ML__cmr {
                font-weight: bold !important;
            }
            .ML__mathit {
                font-style: normal !important;
            }
    `;
    mathField.shadowRoot.appendChild(style);
  });
}

// LaTeX에서 텍스트 추출하기
function extractTextFromLatex(latex) {
  // LaTeX 명령어들을 일반 텍스트로 변환하는 함수
  const convertLatexCommands = (text) => {
    return text
      .replace(/\\textasteriskcentered/g, '*')  // \textasteriskcentered -> *
      .replace(/\\times/g, '×')                 // \times -> ×
      .replace(/\\div/g, '÷')                   // \div -> ÷
      .replace(/\\cdot/g, '·')                  // \cdot -> ·
      .replace(/\\pm/g, '±')                    // \pm -> ±
      .replace(/\\infty/g, '∞')                 // \infty -> ∞
      .replace(/\\le/g, '≤')                    // \le -> ≤
      .replace(/\\ge/g, '≥')                    // \ge -> ≥
      .replace(/\\neq/g, '≠');                  // \neq -> ≠
  };

  // \text{...} 내부의 텍스트 추출 및 LaTeX 명령어 변환
  const processText = (text) => {
    // \text{} 안의 내용을 추출
    const textMatches = text.match(/\\text\{([^}]*)\}|([^\\{}]+)/g);
    if (!textMatches) return text;

    return textMatches
      .map(match => {
        const textMatch = match.match(/\\text\{([^}]*)\}/);
        const content = textMatch ? textMatch[1] : match;
        // LaTeX 명령어를 변환
        return convertLatexCommands(content);
      })
      .join('')
      .trim();
  };

  // 전체 LaTeX 문자열 처리
  const processed = processText(latex);
  return processed;
}
