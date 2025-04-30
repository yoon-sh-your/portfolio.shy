runAfterAppReady(() => { 
    function markFractionHints() {
        // 현재 페이지 기준
        const page = pagenation.activePage;

        // fraction_wrap 내에 있는 math-field 중 data-answer-multi가 있고, 오답인 것 찾기
        page.querySelectorAll(".fraction_wrap math-field[data-answer-multi]").forEach(mathField => {
            if (mathField.dataset.correction === "false") {
            const wrap = mathField.closest(".fraction_wrap");
            if (!wrap) return;

            const hintEl = wrap.querySelector(".multiple_hint");
            if (hintEl) {
                hintEl.classList.add("hint");
                hintEl.hidden = false; // 혹시 hidden 되어 있으면 보이게 처리
            }
            }
        });
        }

        // onIncorrectTwice 이벤트에서 호출되도록 연결
        const originalOnIncorrectTwice = window.onIncorrectTwiceCustom;
        window.onIncorrectTwiceCustom = function () {
        if (typeof originalOnIncorrectTwice === "function") {
            originalOnIncorrectTwice();
        }
        markFractionHints();
        };

        // 초기 실행에서도 확인 가능하게 설정 (선택사항)
        markFractionHints();
        
        // btnReset 버튼 클릭 시 초기화 기능
        const btnReset = document.querySelector('.btnReset');
        if (btnReset) {
        btnReset.addEventListener('click', function() {
            // 모든 multiple_hint 요소에서 hint 클래스 제거
            document.querySelectorAll('.multiple_hint').forEach(hintEl => {
            hintEl.classList.remove('hint');
            hintEl.hidden = true; // 힌트 숨기기
            });
            
            // 모든 boolean_wrap 버튼의 선택 상태 초기화
            document.querySelectorAll('.boolean_wrap button').forEach(button => {
            button.classList.remove('selected');
            button.removeAttribute('data-correction');
            });
            
            // 모든 math-field 입력값 초기화
            document.querySelectorAll('.input_wrap math-field').forEach(mathField => {
            if (typeof mathField.setValue === 'function') {
                mathField.setValue('');
            } else {
                mathField.value = '';
            }
            mathField.removeAttribute('data-correction');
            });
            
            // 버튼 상태 업데이트
            updateButtonState();
            
            // 정오답 상태 다시 평가
            if (typeof window.forceWatchEvaluation === 'function') {
            setTimeout(() => {
                window.forceWatchEvaluation();
            }, 0);
            }
        });
        }
        
        // boolean_wrap 버튼 클릭 이벤트 처리
        function setupBooleanWrapButtons() {
        // 모든 boolean_wrap 내의 버튼에 이벤트 리스너 추가
        document.querySelectorAll('.boolean_wrap button').forEach(button => {
            button.addEventListener('click', function() {
            // 버튼의 selected 클래스 토글
            this.classList.toggle('selected');
            
            // 버튼 상태 업데이트
            updateButtonState();
            
            // 정오답 상태 다시 평가
            if (typeof window.forceWatchEvaluation === 'function') {
                setTimeout(() => {
                window.forceWatchEvaluation();
                }, 0);
            }
            });
        });
        }
        
        // 버튼 상태 업데이트 함수
        function updateButtonState() {
        const btnCheck = document.querySelector('.btnCheck');
        const btnReset = document.querySelector('.btnReset');
        
        // 선택된 버튼이 있는지 확인
        const hasSelectedButtons = document.querySelectorAll('.boolean_wrap button.selected').length > 0;
        
        // 버튼 활성화/비활성화 처리
        if (btnCheck) {
            if (hasSelectedButtons) {
            btnCheck.classList.add('active');
            btnCheck.removeAttribute('disabled');
            } else {
            btnCheck.classList.remove('active');
            }
        }
        
        if (btnReset) {
            if (hasSelectedButtons) {
            btnReset.classList.add('active');
            } else {
            btnReset.classList.remove('active');
            }
        }
        }
        
        // 커스텀 채점 대상 설정
        window.getCustomTargets = function(page) {
        return $(page).find(".boolean_wrap button, .input_wrap math-field");
        };
        
        // 커스텀 정답 조건 설정
        window.customCheckCondition = function(el) {
        // boolean_wrap 버튼인 경우
        if (el.classList.contains('num')) {
            // 현재 페이지의 모든 boolean_wrap 버튼 중 선택된 버튼이 있는지 확인
            const page = pagenation.activePage;
            const hasSelectedButtons = page.querySelectorAll('.boolean_wrap button.selected').length > 0;
            
            // 선택된 버튼이 있으면 정답 여부를 확인
            if (hasSelectedButtons) {
            // 현재 버튼이 선택되어 있고 정답이면 true 반환
            if (el.classList.contains('selected')) {
                return el.getAttribute('data-answer-single') === 'true';
            }
            // 현재 버튼이 선택되어 있고 오답이면 false 반환
            else if (el.getAttribute('data-answer-single') === 'true') {
                return false;
            }
            // 현재 버튼이 선택되어 있지 않고 정답이 아니면 무시
            return null;
            }
            
            // 선택된 버튼이 없으면 empty 반환
            return "empty";
        }
        
        // math-field인 경우 기존 로직 유지
        if (el.tagName === 'MATH-FIELD') {
            const answerValue = el.getAttribute('data-answer-single');
            const userValue = el.value.trim();
            
            if (!userValue) return "empty";
            
            return userValue === answerValue;
        }
        
        return false;
        };
        
        // 초기 설정
        setupBooleanWrapButtons();
        updateButtonState();
});
