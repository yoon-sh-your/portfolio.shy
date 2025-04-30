runAfterAppReady(function() {
    // 모든 카운팅 래퍼와 관련 요소들을 선택
    const countingWraps = document.querySelectorAll('.counting_wrap');
    
    // 각 카운팅 래퍼에 대해 이벤트 설정
    countingWraps.forEach((wrap, index) => {
        const inputCount = wrap.querySelector('.input_count');
        const btnPlus = wrap.querySelector('.btn_plus');
        const btnMinus = wrap.querySelector('.btn_minus');
        const filedBox = document.querySelector(`.${wrap.classList[1]}.filed_box`);
        
        // 초기값 설정
        inputCount.value = 1;
        
        // 플러스 버튼 클릭 이벤트
        btnPlus.addEventListener('click', function() {
            let currentValue = parseInt(inputCount.value) || 0;
            if (currentValue < 3) {
                inputCount.value = currentValue + 1;
                updateBoxes(filedBox, currentValue + 1);
                handleValueChange(index);
            }
        });
        
        // 마이너스 버튼 클릭 이벤트
        btnMinus.addEventListener('click', function() {
            let currentValue = parseInt(inputCount.value) || 0;
            if (currentValue > 1) {
                inputCount.value = currentValue - 1;
                updateBoxes(filedBox, currentValue - 1);
                handleValueChange(index);
            }
        });
        
        // 입력값 변경 감지
        inputCount.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            if (value < 1) {
                this.value = 1;
            } else if (value > 3) {
                this.value = 3;
            }
            updateBoxes(filedBox, parseInt(this.value));
            handleValueChange(index);
        });
    });
    
    // 박스 업데이트 함수
    function updateBoxes(filedBox, count) {
        const currentBoxes = filedBox.querySelectorAll('.box');
        const currentCount = currentBoxes.length;
        
        if (count > currentCount) {
            // 박스 추가
            for (let i = currentCount; i < count; i++) {
                const box = document.createElement('div');
                box.className = 'box';
                filedBox.appendChild(box);
                
                // 애니메이션을 위해 약간의 지연 후 show 클래스 추가
                setTimeout(() => {
                    box.classList.add('show');
                }, i * 100);
            }
        } else if (count < currentCount) {
            // 박스 제거
            for (let i = currentCount - 1; i >= count; i--) {
                currentBoxes[i].remove();
            }
        }
    }
    
    // 값 변경 시 실행될 함수
    function handleValueChange(index) {
        console.log('handleValueChange', index);
        const inputCount = countingWraps[index].querySelector('.input_count');
        const count = parseInt(inputCount.value) || 0;
        
        // 해당 카운팅 래퍼의 클래스에 따라 매스필드 처리
        const wrapClass = countingWraps[index].classList[1]; // 두 번째 클래스명 가져오기 (change_answer1 또는 change_answer2)
        
        // 해당 클래스를 가진 모든 매스필드 찾기
        const mathFields = document.querySelectorAll(`.${wrapClass} math-field`);
        
        // 각 매스필드에 대해 처리
        mathFields.forEach(mathField => {
            let value;
            if (wrapClass === 'change_answer1') {
                value = 12 * count;
            } else if (wrapClass === 'change_answer2') {
                value = 40 * count;
            }
            mathField.setAttribute('data-answer-single', value);
        });
        
        console.log('현재 값:', count);
    }

    // 버튼 클래스 규칙 정의
    defineButtonClassRules([
        {
            selector: ".input_count", // 입력 카운팅을 감지
            test: (el) => {
                if (typeof $ !== "function") {
                    console.error("jQuery가 로드되지 않았습니다.");
                    return false;
                }
                const val = parseInt($(el).val()) || 0;
                return val > 1;
            },
            setClass: [
                { target: ".btnReset", class: "active" }
            ]
        }
    ]);
    
    // 버튼 상태 변경 후 강제 평가
    window.forceWatchEvaluation();

    // 커스텀 리셋 함수
    window.resetCustom = function () {
        // 모든 카운팅 래퍼 초기화
        countingWraps.forEach((wrap, index) => {
            const inputCount = wrap.querySelector('.input_count');
            const filedBox = document.querySelector(`.${wrap.classList[1]}.filed_box`);
            
            // 입력값 초기화
            inputCount.value = 1;
            
            // 박스 초기화
            filedBox.innerHTML = '';
            const box = document.createElement('div');
            box.className = 'box show';
            filedBox.appendChild(box);
            
            // 매스필드 값 초기화
            handleValueChange(index);
        });
    };

    window.onCorrectCustom = function () {
        alert("🎉 정답시 발문해야할 기능 여기에 추가");
      };
});

