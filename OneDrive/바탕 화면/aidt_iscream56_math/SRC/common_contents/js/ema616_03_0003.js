runAfterAppReady(function () {
    const topBoxes = document.querySelectorAll('.top_box, .bottom_box');

    topBoxes.forEach((box) => {
        const btnWrap = box.querySelector('.btn_wrap');
        const btnMinus = btnWrap.querySelector('.btn_plus');
        const btnPlus = btnWrap.querySelector('.btn_minus');
        const dropdown = box.querySelector('.custom_dropdown');

        const mathFields = box.querySelectorAll('math-field');
        const boxShow = box.querySelector('.box_show');

        let currentCount = 0;

        const getMaxCount = () => {
            if (!dropdown) return 0;
            return parseInt(dropdown.value) || 0;
        };

        const setCount = (val) => {
            if (val < 0) val = 0;
            const maxCount = getMaxCount();
            if (val > maxCount) val = maxCount;
            currentCount = val;
            if (boxShow) {
                renderBoxes(val);
            }
            // correction 체크
            checkCorrection(val);
        };

        const checkCorrection = (count) => {
            const answer = parseInt(mathFields[0].getAttribute('data-answer-single'));
            if (count === answer) {
                window.onCorrectCustom?.();
            }
        };

        const renderBoxes = (count) => {
            if (!boxShow) return;
            const currentBoxes = boxShow.querySelectorAll('i');
            const currentCount = currentBoxes.length;
            
            if (count > currentCount) {
                // 새로운 쌓기나무 추가
                for (let i = currentCount; i < count; i++) {
                    const newBox = document.createElement('i');
                    newBox.classList.add('box');
                    newBox.style.animation = 'box_show_ani .3s ease-in forwards';
                    boxShow.appendChild(newBox);
                }
            } else if (count < currentCount) {
                // 쌓기나무 제거
                for (let i = currentCount - 1; i >= count; i--) {
                    boxShow.removeChild(currentBoxes[i]);
                }
            }
        };

        // 드롭다운 값 변경 이벤트 추가
        if (dropdown) {
            dropdown.addEventListener('change', () => {
                const maxCount = getMaxCount();
                if (currentCount > maxCount) {
                    setCount(maxCount);
                }
            });
        }

        // 초기화
        setCount(0);

        btnPlus.addEventListener('click', () => {
            const maxCount = getMaxCount();
            if (maxCount > 0 && currentCount < maxCount) setCount(currentCount + 1);
        });

        btnMinus.addEventListener('click', () => {
            if (currentCount > 0) setCount(currentCount - 1);
        });
    });

    window.resetCustom = function () {
        document.querySelectorAll('.top_box, .bottom_box').forEach((box) => {
            const mathFields = box.querySelectorAll('math-field');
            const boxShow = box.querySelector('.box_show');

            mathFields[0].setValue?.('0');
            mathFields[1].setValue?.('0');
            mathFields[0].setAttribute('data-answer-single', '0');
            mathFields[1].setAttribute('data-answer-single', '0');

            // 박스도 초기화
            boxShow.innerHTML = '';
        });
    };

    window.onCorrectCustom = function () {
        // alert("🎉 정답이에요! 여기에 정답 후 처리 로직을 넣어주세요.");
    };
});
