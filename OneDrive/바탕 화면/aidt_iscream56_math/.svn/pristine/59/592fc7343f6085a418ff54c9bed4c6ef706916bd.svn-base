runAfterAppReady(function () {
    const $sliders = $('input[type="range"]');
    
    $sliders.each(function(index) {
        const $slider = $(this);
        const $container = $slider.closest('.slider-container');
        const $buttons = $container.find('.direction-buttons');
        const $leftBtn = $container.find('.left-btn');
        const $rightBtn = $container.find('.right-btn');
        const $valueInput = $container.find('.value-input');
        const $dropdown = $container.find('.custom_dropdown');
        
        // 초기값 설정
        if ($slider.attr('id') === 'range_answer2') {
            $valueInput.val((parseInt($slider.val()) / 10).toFixed(1));
        }
        
        // 슬라이더 값 변경 시
        $slider.on('input', function() {
            const value = parseInt(this.value);
            if ($slider.attr('id') === 'range_answer2') { // 두 번째 슬라이더
                $valueInput.val((value / 10).toFixed(1));
            } else { // 첫 번째 슬라이더
                $valueInput.val(value);
            }
            updateSliderStyle($slider);
            if ($buttons.css('display') === 'block') {
                updateButtonPosition($slider);
            }
            checkAnswer($slider, $valueInput);
        });

        // 숫자 입력 필드 값 변경 시
        $valueInput.on('input', function() {
            let value;
            if ($slider.attr('id') === 'range_answer2') { // 두 번째 슬라이더
                value = parseFloat(this.value) * 10;
            } else { // 첫 번째 슬라이더
                value = parseInt(this.value);
            }
            
            const min = parseInt($slider.attr('min'));
            const max = parseInt($slider.attr('max'));
            
            if (value >= min && value <= max) {
                $slider.val(value);
                updateSliderStyle($slider);
                if ($buttons.css('display') === 'block') {
                    updateButtonPosition($slider);
                }
                checkAnswer($slider, $valueInput);
            }
        });

        // 왼쪽 버튼 클릭
        $leftBtn.on('click', function() {
            $slider.removeClass('right').addClass('left');
            updateSliderStyle($slider);
            $buttons.css('display', 'none');
            checkAnswer($slider, $valueInput);
        });
        
        // 오른쪽 버튼 클릭
        $rightBtn.on('click', function() {
            $slider.removeClass('left').addClass('right');
            updateSliderStyle($slider);
            $buttons.css('display', 'none');
            checkAnswer($slider, $valueInput);
        });

        // 핸들 클릭 시 버튼 표시
        $slider.on('mousedown', function(e) {
            const thumbRect = this.getBoundingClientRect();
            const thumbX = e.clientX - thumbRect.left;
            
            if (thumbX >= 0 && thumbX <= thumbRect.width) {
                $buttons.css('display', 'block');
                updateButtonPosition($slider);
            }
        });
        
        // 문서 클릭 시 버튼 숨김
        $(document).on('click', function(e) {
            if (!$container.is(e.target) && $container.has(e.target).length === 0) {
                $buttons.css('display', 'none');
            }
        });
    });
    
    function updateButtonPosition($slider) {
        const min = parseInt($slider.attr('min'));
        const max = parseInt($slider.attr('max'));
        const value = parseInt($slider.val());
        const percentage = ((value - min) / (max - min)) * 100;
        const $buttons = $slider.parent().find('.direction-buttons');
        
        $buttons.css('left', `calc(${percentage}% - ${$buttons.outerWidth() / 2}px)`);
    }
    
    function updateSliderStyle($slider) {
        const min = parseInt($slider.attr('min'));
        const max = parseInt($slider.attr('max'));
        const value = parseInt($slider.val());
        const percentage = ((value - min) / (max - min)) * 100;
        
        if ($slider.hasClass('left')) {
            $slider.css('--before-width', percentage + '%');
        } else if ($slider.hasClass('right')) {
            $slider.css('--after-width', (100 - percentage) + '%');
        }
        
        // input number 값 업데이트
        const $container = $slider.closest('.slider-container');
        const $valueInput = $container.find('.value-input');
        const sliderId = $slider.attr('id');
        
        if (sliderId === 'range_answer2') { // 두 번째 슬라이더인 경우
            $valueInput.val((value / 10).toFixed(1));
        } else { // 첫 번째 슬라이더인 경우
            $valueInput.val(value);
        }
        
        // checkAnswer 호출
        const $dropdown = $container.find('.custom_dropdown');
        const index = $slider.index();
        checkAnswer($slider, $valueInput);
    }

    function checkAnswer($slider, $valueInput) {
        // range input의 방향 확인
        const expectedDirection = $slider.data('answer');
        const currentDirection = $slider.hasClass('left') ? 'left' : 'right';
        const directionCorrect = expectedDirection === currentDirection;
        
        // input number의 값 확인
        const expectedValue = parseFloat($valueInput.data('answer-single'));
        const currentValue = parseFloat($valueInput.val());
        const valueCorrect = expectedValue === currentValue;
        
        // 방향과 값이 모두 일치하는 경우 correction="true"
        if (directionCorrect && valueCorrect) {
            $valueInput.attr('correction', 'true');
        } else {
            // 오답인 경우 correction="false"
            $valueInput.attr('correction', 'false');
        }
    }

    window.getCustomTargets = function (page) {
        return $(page).find(".custom_check_target");
    };
    
    // 커스텀 정답 조건
    window.customCheckCondition = function (el) {
        const $el = $(el);
        const $container = $el.closest('.slider-container');
        const $input = $container.find('input[type="number"]');
        
        // correction 속성이 없는 경우 'empty' 반환
        if ($input.attr('correction') === undefined) {
            return 'empty';
        }
        
        // input number의 correction 속성이 true인 경우에만 true 반환
        return $input.attr('correction') === 'true';
    };

    window.resetCustom = function () {
        // 모든 range input 초기화
        $('input[type="range"]').each(function() {
            const $slider = $(this);
            const min = parseInt($slider.attr('min'));
            const max = parseInt($slider.attr('max'));
            const middleValue = Math.floor((min + max) / 2);
            
            // correction 데이터 제거 (초기상태)
            const $valueInput = $slider.parent().find('.value-input');
            $valueInput.removeAttr('correction');
            
            // 클래스 제거
            $slider.removeClass('left right');
            
            // range 값 중간값으로 설정
            $slider.val(middleValue);
            
            // input number 값 업데이트
            if ($slider.attr('id') === 'range_answer2') { // 두 번째 슬라이더
                $valueInput.val((middleValue / 10).toFixed(1));
            } else { // 첫 번째 슬라이더
                $valueInput.val(middleValue);
            }
            
            // 스타일 업데이트
            updateSliderStyle($slider);
        });
    };

    // 버튼 활성화 패턴 적용
    defineButtonClassRules([
        {
            selector: "input[type='range'], input[type='number']",
            key: "custom_check_btn_active",
            test: (el) => {
                const $el = $(el);
                const $container = $el.parent();
                const $slider = $container.find('input[type="range"]');
                const $input = $container.find('input[type="number"]');
                
                // 방향이 선택되어 있고 correction 데이터가 있는지 확인
                const hasDirection = $slider.hasClass('left') || $slider.hasClass('right');
                const hasCorrection = $input.attr('correction') !== undefined;
                
                return hasDirection && hasCorrection;
            }
        }
    ]);

    // 버튼 상태 변경 후 강제 평가 문 실행
    window.forceWatchEvaluation();

    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function () {
        // alert("🚨 여기에 답안 발문 스크립트 작성");
    };
});

