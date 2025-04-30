runAfterAppReady(() => { // 앱 준비 후 실행, jQuery 사용가능 
    console.log("ema614_06_0003.js 실행");

    // page_1의 boolean_wrap 버튼 초기화
    const page1Col1Wrap = document.querySelector('.page_1 .col1 .boolean_wrap');
    const page1Col2Wrap = document.querySelector('.page_1 .col2 .boolean_wrap');

    // page_3의 boolean_wrap 버튼 초기화
    const page3Col1Wrap = document.querySelector('.page_3 .col1 .boolean_wrap');
    const page3Col2Wrap = document.querySelector('.page_3 .col2 .boolean_wrap');

    // data-answer-single 속성에서 숫자 값을 가져옴
    const page1Col1AnswerCount = parseInt(page1Col1Wrap.getAttribute('data-answer-single'), 10);
    const page1Col2AnswerCount = parseInt(page1Col2Wrap.getAttribute('data-answer-single'), 10);
    
    const page3Col1AnswerCount = parseInt(page3Col1Wrap.getAttribute('data-answer-single'), 10);
    const page3Col2AnswerCount = parseInt(page3Col2Wrap.getAttribute('data-answer-single'), 10);

    console.log('정답 개수:', { 
        page1Col1AnswerCount, 
        page1Col2AnswerCount,
        page3Col1AnswerCount,
        page3Col2AnswerCount
    });

    const page1Col1Buttons = page1Col1Wrap.querySelectorAll('button');
    const page1Col2Buttons = page1Col2Wrap.querySelectorAll('button');
    
    const page3Col1Buttons = page3Col1Wrap.querySelectorAll('button');
    const page3Col2Buttons = page3Col2Wrap.querySelectorAll('button');

    // 선택된 버튼 수를 추적하는 변수
    let selectedPage1Col1Count = 0;
    let selectedPage1Col2Count = 0;
    
    let selectedPage3Col1Count = 0;
    let selectedPage3Col2Count = 0;

    // 버튼 상태 업데이트 함수
    function updateButtonState() {
        const btnCheck = document.querySelector('.btnCheck');
        const btnReset = document.querySelector('.btnReset');
        
        // 버튼 하나라도 선택되면 활성화
        if (selectedPage1Col1Count > 0 || selectedPage1Col2Count > 0 || 
            selectedPage3Col1Count > 0 || selectedPage3Col2Count > 0) {
            if (btnCheck) {
                btnCheck.classList.add('active');
                // disabled 속성 제거 (속성 자체가 없도록)
                btnCheck.removeAttribute('disabled');
            }
            if (btnReset) btnReset.classList.add('active');
        } else {
            if (btnCheck) {
                btnCheck.classList.remove('active');
                // disabled 속성 추가하지 않음
            }
            if (btnReset) btnReset.classList.remove('active');
        }
    }

    function updateCorrectionState(buttons, answerCount) {
        // 모든 버튼 초기화
        buttons.forEach(btn => {
            btn.setAttribute('data-correction', 'false');
            btn.classList.remove('hint');
        });
      
        // 선택된 버튼 가져오기
        const selectedButtons = Array.from(buttons).filter(btn => btn.classList.contains('selected'));
      
        // answerCount 개수만큼 앞에서부터 selected된 버튼만 정답 처리
        selectedButtons.slice(0, answerCount).forEach(btn => {
            btn.setAttribute('data-correction', 'true');
        });
        
        // 디버깅: correction 상태 로그
        console.log('Correction 상태 업데이트:', {
            totalButtons: buttons.length,
            selectedButtons: selectedButtons.length,
            answerCount,
            correctionButtons: document.querySelectorAll('[data-correction="true"]').length
        });
    }
    
    function applyHintOnlyTrue(buttons, answerCount) {
        buttons.forEach((btn, i) => {
            btn.classList.remove('hint'); // 초기화
            if (i < answerCount) {
                btn.classList.add('hint');
            }
        });
    }

    // 버튼 클릭 이벤트 핸들러 함수
    function handleButtonClick(btn, buttons, answerCount, isPage1, isCol1) {
        // 디버깅: 클릭 전 상태 로그
        console.log('클릭 전 상태:', {
            beforeSelected: btn.classList.contains('selected'),
            beforeCorrection: btn.getAttribute('data-correction'),
            selectedPage1Col1Count,
            selectedPage1Col2Count,
            selectedPage3Col1Count,
            selectedPage3Col2Count
        });
        
        // selected 클래스 토글
        const isSelected = btn.classList.toggle('selected');
        
        // 선택된 버튼 수 업데이트
        if (isPage1) {
            if (isCol1) {
                selectedPage1Col1Count = isSelected ? 
                    selectedPage1Col1Count + 1 : 
                    Math.max(0, selectedPage1Col1Count - 1);
            } else {
                selectedPage1Col2Count = isSelected ? 
                    selectedPage1Col2Count + 1 : 
                    Math.max(0, selectedPage1Col2Count - 1);
            }
        } else {
            if (isCol1) {
                selectedPage3Col1Count = isSelected ? 
                    selectedPage3Col1Count + 1 : 
                    Math.max(0, selectedPage3Col1Count - 1);
            } else {
                selectedPage3Col2Count = isSelected ? 
                    selectedPage3Col2Count + 1 : 
                    Math.max(0, selectedPage3Col2Count - 1);
            }
        }
        
        // correction 상태 업데이트
        updateCorrectionState(buttons, answerCount);
        
        // 버튼 상태 업데이트
        updateButtonState();
        
        // correction 변경 이벤트 강제 트리거 (observer용)
        const event = new Event('change', { bubbles: true });
        btn.dispatchEvent(event);

        // 정오답 상태 다시 평가
        if (typeof window.forceWatchEvaluation === 'function') {
            console.log('forceWatchEvaluation 호출');
            setTimeout(() => {
                window.forceWatchEvaluation();
            }, 0);
        } else {
            console.warn('forceWatchEvaluation 함수가 정의되지 않음');
        }
        
        // 디버깅: 클릭 후 상태 로그
        console.log('클릭 후 상태:', {
            afterSelected: btn.classList.contains('selected'),
            afterCorrection: btn.getAttribute('data-correction'),
            selectedPage1Col1Count,
            selectedPage1Col2Count,
            selectedPage3Col1Count,
            selectedPage3Col2Count
        });
    }

    function bindButtonEvents(buttons, answerCount, isPage1, isCol1) {
        buttons.forEach((btn, index) => {
            btn.setAttribute('data-index', index);

            // 디버깅: 클릭 이벤트 로그
            console.log('버튼 클릭 이벤트 바인딩:', {
                index,
                isPage1,
                isCol1,
                button: btn
            });

            // 클릭 이벤트 리스너 등록
            btn.addEventListener('click', function(e) {
                e.preventDefault(); // 기본 동작 차단
                
                // 디버깅: 클릭 이벤트 로그
                console.log('버튼 클릭:', {
                    index,
                    isPage1,
                    isCol1,
                    beforeSelected: this.classList.contains('selected'),
                    beforeCorrection: this.getAttribute('data-correction')
                });

                // 버튼 클릭 핸들러 호출
                handleButtonClick(this, buttons, answerCount, isPage1, isCol1);
            });
        });
    }

    // 이벤트 바인딩 - page_1
    bindButtonEvents(page1Col1Buttons, page1Col1AnswerCount, true, true);
    bindButtonEvents(page1Col2Buttons, page1Col2AnswerCount, true, false);
    
    // 이벤트 바인딩 - page_3
    bindButtonEvents(page3Col1Buttons, page3Col1AnswerCount, false, true);
    bindButtonEvents(page3Col2Buttons, page3Col2AnswerCount, false, false);

    // page_3의 math-field 이벤트 바인딩
    const page3MathFields = document.querySelectorAll('.page_3 .input_wrap math-field');
    page3MathFields.forEach(field => {
        field.addEventListener('input', function() {
            // 페이지 활성화
            activatePage(document.querySelector('.page_3'));
            
            // btnCheck의 disabled 속성 제거 (속성 자체가 없도록)
            const btnCheck = document.querySelector('.btnCheck');
            if (btnCheck) {
                btnCheck.removeAttribute('disabled');
            }
            
            // 입력값이 변경될 때마다 정오답 평가
            if (typeof window.forceWatchEvaluation === 'function') {
                setTimeout(() => {
                    window.forceWatchEvaluation();
                }, 0);
            }
        });
    });

    // page_4의 math-field 이벤트 바인딩
    const page4MathFields = document.querySelectorAll('.page_4 .input_wrap math-field');
    page4MathFields.forEach(field => {
        field.addEventListener('input', function() {
            // 페이지 활성화
            activatePage(document.querySelector('.page_4'));
            
            // btnCheck의 disabled 속성 제거 (속성 자체가 없도록)
            const btnCheck = document.querySelector('.btnCheck');
            if (btnCheck) {
                btnCheck.removeAttribute('disabled');
            }
            
            // 입력값이 변경될 때마다 정오답 평가
            if (typeof window.forceWatchEvaluation === 'function') {
                setTimeout(() => {
                    window.forceWatchEvaluation();
                }, 0);
            }
        });
    });

    // 커스텀 채점 대상
    window.getCustomTargets = function(page) {
        return $(page).find(".col1 .boolean_wrap button, .col2 .boolean_wrap button, .input_wrap math-field");
    };

    // 정답 조건: answerCount 개수만큼 정확히 선택된 경우
    window.customCheckCondition = function(el) {
        // 현재 활성화된 페이지 확인
        let activePage = document.querySelector('.page.on');
        
        // activePage가 null인 경우 처리
        if (!activePage) {
            console.warn('활성화된 페이지를 찾을 수 없습니다. 요소의 부모 페이지를 확인합니다.');
            
            // 요소의 부모 페이지 찾기
            const page1 = el.closest('.page_1');
            const page3 = el.closest('.page_3');
            const page4 = el.closest('.page_4');
            
            if (page1) {
                activePage = page1;
                console.log('page_1을 활성화된 페이지로 설정합니다.');
            } else if (page3) {
                activePage = page3;
                console.log('page_3을 활성화된 페이지로 설정합니다.');
            } else if (page4) {
                activePage = page4;
                console.log('page_4를 활성화된 페이지로 설정합니다.');
            } else {
                console.error('요소의 부모 페이지를 찾을 수 없습니다.');
                return false;
            }
        }
        
        const isPage1 = activePage.classList.contains('page_1');
        const isPage3 = activePage.classList.contains('page_3');
        const isPage4 = activePage.classList.contains('page_4');
        
        // math-field 요소인 경우
        if (el.tagName === 'MATH-FIELD') {
            const answerValue = el.getAttribute('data-answer-single');
            const userValue = el.value.trim();
            
            if (!userValue) return "empty";
            
            return userValue === answerValue;
        }
        
        // boolean_wrap 버튼인 경우
        if (isPage1) {
            const col1Selected = document.querySelectorAll('.page_1 .col1 .boolean_wrap button.selected').length;
            const col2Selected = document.querySelectorAll('.page_1 .col2 .boolean_wrap button.selected').length;
            
            // 선택된 버튼 수가 정답 개수와 일치하는지 확인
            const col1Correct = col1Selected === page1Col1AnswerCount;
            const col2Correct = col2Selected === page1Col2AnswerCount;

            if (col1Selected === 0 && col2Selected === 0) return "empty";

            return col1Correct && col2Correct;
        } else if (isPage3) {
            const col1Selected = document.querySelectorAll('.page_3 .col1 .boolean_wrap button.selected').length;
            const col2Selected = document.querySelectorAll('.page_3 .col2 .boolean_wrap button.selected').length;
            
            // 선택된 버튼 수가 정답 개수와 일치하는지 확인
            const col1Correct = col1Selected === page3Col1AnswerCount;
            const col2Correct = col2Selected === page3Col2AnswerCount;

            if (col1Selected === 0 && col2Selected === 0) return "empty";

            // math-field 정답 체크
            const mathFields = document.querySelectorAll('.page_3 .input_wrap math-field');
            let allMathFieldsCorrect = true;
            let hasMathFieldInput = false;

            mathFields.forEach(field => {
                const answerValue = field.getAttribute('data-answer-single');
                const userValue = field.value.trim();
                
                if (userValue) {
                    hasMathFieldInput = true;
                    if (userValue !== answerValue) {
                        allMathFieldsCorrect = false;
                    }
                }
            });

            // math-field가 있고 입력이 있는 경우에만 체크
            if (mathFields.length > 0 && hasMathFieldInput) {
                return col1Correct && col2Correct && allMathFieldsCorrect;
            }

            return col1Correct && col2Correct;
        }
        
        return false;
    };

    window.onCustomIncorrect = function(count) {
        console.log("오답 횟수:", count);
    };

    window.onCorrectCustom = function() {
        console.log("정답이에요!");
    };

    window.onIncorrectCustom = function() {
        console.log("다시 생각해보세요.");
    };

    window.onIncorrectTwiceCustom = function() {
        console.log("정답 공개됩니다!");
        
        // 현재 활성화된 페이지 확인
        const activePage = document.querySelector('.page.on');
        
        // activePage가 null인 경우 처리
        if (!activePage) {
            return;
        }
        
        const isPage1 = activePage.classList.contains('page_1');
        const isPage3 = activePage.classList.contains('page_3');
        
        // 모든 버튼의 selected 클래스 제거
        const allButtons = document.querySelectorAll('.boolean_wrap button');
        allButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('data-correction', 'false');
            btn.classList.remove('hint'); // 기존 hint 클래스 제거
        });
        
        // 선택된 버튼 수 초기화
        selectedPage1Col1Count = 0;
        selectedPage1Col2Count = 0;
        selectedPage3Col1Count = 0;
        selectedPage3Col2Count = 0;
        
        // 버튼 상태 업데이트 - btnReset은 활성화 상태로 유지하고 btnCheck는 비활성화
        const btnCheck = document.querySelector('.btnCheck');
        const btnReset = document.querySelector('.btnReset');
        
        // btnCheck 버튼은 비활성화 (disabled 속성 추가하지 않음)
        if (btnCheck) {
            btnCheck.classList.remove('active');
        }
        
        // btnReset 버튼은 활성화 상태로 유지
        if (btnReset) {
            btnReset.classList.add('active');
        }
        
        // 현재 활성화된 페이지의 모든 .tag 요소에 .on 클래스 추가
        const tags = activePage.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.add('on');
        });
        
        // 힌트 적용 함수
        function applyHintToButtons(buttons, answerCount, pageName, colName) {
            for (let i = 0; i < answerCount && i < buttons.length; i++) {
                buttons[i].classList.add('hint');
            }
        }
        
        if (isPage1) {
            // page_1 힌트 적용
            applyHintToButtons(page1Col1Buttons, page1Col1AnswerCount, 'page_1', 'col1');
            applyHintToButtons(page1Col2Buttons, page1Col2AnswerCount, 'page_1', 'col2');
            
            // 직접 DOM에서 버튼을 선택하여 hint 클래스 추가 (백업 방법)
            const col1Wrap = document.querySelector('.page_1 .col1 .boolean_wrap');
            const col2Wrap = document.querySelector('.page_1 .col2 .boolean_wrap');
            
            if (col1Wrap) {
                const buttons = col1Wrap.querySelectorAll('button');
                for (let i = 0; i < page1Col1AnswerCount && i < buttons.length; i++) {
                    buttons[i].classList.add('hint');
                }
            }
            
            if (col2Wrap) {
                const buttons = col2Wrap.querySelectorAll('button');
                for (let i = 0; i < page1Col2AnswerCount && i < buttons.length; i++) {
                    buttons[i].classList.add('hint');
                }
            }
        } else if (isPage3) {
            // page_3 힌트 적용
            applyHintToButtons(page3Col1Buttons, page3Col1AnswerCount, 'page_3', 'col1');
            applyHintToButtons(page3Col2Buttons, page3Col2AnswerCount, 'page_3', 'col2');
            
            // 직접 DOM에서 버튼을 선택하여 hint 클래스 추가 (백업 방법)
            const col1Wrap = document.querySelector('.page_3 .col1 .boolean_wrap');
            const col2Wrap = document.querySelector('.page_3 .col2 .boolean_wrap');
            
            if (col1Wrap) {
                const buttons = col1Wrap.querySelectorAll('button');
                for (let i = 0; i < page3Col1AnswerCount && i < buttons.length; i++) {
                    buttons[i].classList.add('hint');
                }
            }
            
            if (col2Wrap) {
                const buttons = col2Wrap.querySelectorAll('button');
                for (let i = 0; i < page3Col2AnswerCount && i < buttons.length; i++) {
                    buttons[i].classList.add('hint');
                }
            }
        }
    };

    window.onEmptyCustom = function() {
        console.log("입력을 먼저 해보세요!");
    };

    window.resetCustom = function() {
        console.log('리셋 실행');
        
        // 현재 활성화된 페이지 확인
        const activePage = document.querySelector('.page.on');
        const isPage1 = activePage.classList.contains('page_1');
        const isPage3 = activePage.classList.contains('page_3');
        
        if (isPage1) {
            [...page1Col1Buttons, ...page1Col2Buttons].forEach(btn => {
                btn.classList.remove('selected');
                btn.setAttribute('data-correction', 'false');
                const event = new Event('change', { bubbles: true });
                btn.dispatchEvent(event);
            });
            
            // 선택된 버튼 수 초기화
            selectedPage1Col1Count = 0;
            selectedPage1Col2Count = 0;
        } else if (isPage3) {
            [...page3Col1Buttons, ...page3Col2Buttons].forEach(btn => {
                btn.classList.remove('selected');
                btn.setAttribute('data-correction', 'false');
                const event = new Event('change', { bubbles: true });
                btn.dispatchEvent(event);
            });
            
            // 선택된 버튼 수 초기화
            selectedPage3Col1Count = 0;
            selectedPage3Col2Count = 0;
            
            // page_3의 math-field 초기화
            const page3MathFields = document.querySelectorAll('.page_3 .input_wrap math-field');
            page3MathFields.forEach(field => {
                field.value = '';
                delete field.dataset.correction;
            });
        } else if (activePage.classList.contains('page_4')) {
            // page_4의 math-field 초기화
            const page4MathFields = document.querySelectorAll('.page_4 .input_wrap math-field');
            page4MathFields.forEach(field => {
                field.value = '';
                delete field.dataset.correction;
            });
        }
        
        // 현재 활성화된 페이지의 모든 .tag 요소에서 .on 클래스 제거
        const tags = activePage.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.remove('on');
        });
        
        // 버튼 상태 업데이트
        updateButtonState();
        
        // btnCheck 버튼의 disabled 속성 제거
        const btnCheck = document.querySelector('.btnCheck');
        if (btnCheck) {
            btnCheck.removeAttribute('disabled');
        }
    };
    
    
    // 초기 버튼 상태 설정
    updateButtonState();
    
    // 버튼 클릭 이벤트 직접 추가 (기존 이벤트와 중복 방지)
    document.querySelectorAll('.boolean_wrap button').forEach(btn => {
        // 기존 이벤트 리스너 제거
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 새 이벤트 리스너 추가
        newBtn.addEventListener('click', function() {
            const isPage1 = this.closest('.page_1') !== null;
            const isPage3 = this.closest('.page_3') !== null;
            const isCol1 = this.closest('.col1') !== null;
            
            // 페이지 활성화
            if (isPage1) {
                activatePage(document.querySelector('.page_1'));
            } else if (isPage3) {
                activatePage(document.querySelector('.page_3'));
            }
            
            // btnCheck의 disabled 속성 제거 (속성 자체가 없도록)
            const btnCheck = document.querySelector('.btnCheck');
            if (btnCheck) {
                btnCheck.removeAttribute('disabled');
            }
            
            let buttons, answerCount;
            
            if (isPage1) {
                buttons = isCol1 ? page1Col1Buttons : page1Col2Buttons;
                answerCount = isCol1 ? page1Col1AnswerCount : page1Col2AnswerCount;
            } else if (isPage3) {
                buttons = isCol1 ? page3Col1Buttons : page3Col2Buttons;
                answerCount = isCol1 ? page3Col1AnswerCount : page3Col2AnswerCount;
            }
            
            // selected 클래스 토글
            this.classList.toggle('selected');
            
            // 선택된 버튼 수 업데이트
            if (isPage1) {
                if (isCol1) {
                    selectedPage1Col1Count = this.classList.contains('selected') ? 
                        selectedPage1Col1Count + 1 : 
                        Math.max(0, selectedPage1Col1Count - 1);
                } else {
                    selectedPage1Col2Count = this.classList.contains('selected') ? 
                        selectedPage1Col2Count + 1 : 
                        Math.max(0, selectedPage1Col2Count - 1);
                }
            } else if (isPage3) {
                if (isCol1) {
                    selectedPage3Col1Count = this.classList.contains('selected') ? 
                        selectedPage3Col1Count + 1 : 
                        Math.max(0, selectedPage3Col1Count - 1);
                } else {
                    selectedPage3Col2Count = this.classList.contains('selected') ? 
                        selectedPage3Col2Count + 1 : 
                        Math.max(0, selectedPage3Col2Count - 1);
                }
            }
            
            // correction 상태 업데이트
            updateCorrectionState(buttons, answerCount);
            
            // 버튼 상태 업데이트
            updateButtonState();
            
            // correction 변경 이벤트 강제 트리거 (observer용)
            const event = new Event('change', { bubbles: true });
            this.dispatchEvent(event);
            
            // 정오답 상태 다시 평가
            if (typeof window.forceWatchEvaluation === 'function') {
                setTimeout(() => {
                    window.forceWatchEvaluation();
                }, 0);
            }
        });
    });

    // 페이지 활성화 함수 추가
    function activatePage(pageElement) {
        // 모든 페이지에서 on 클래스 제거
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('on');
        });
        
        // 지정된 페이지에 on 클래스 추가
        if (pageElement) {
            pageElement.classList.add('on');
            console.log(`페이지 ${pageElement.className}가 활성화되었습니다.`);
        }
    }
    
    // 초기 페이지 활성화 (첫 번째 페이지)
    const firstPage = document.querySelector('.page');
    if (firstPage) {
        activatePage(firstPage);
    }
});






