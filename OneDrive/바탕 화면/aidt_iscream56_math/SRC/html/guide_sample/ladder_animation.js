document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 선택
    const startPoints = document.querySelectorAll('.start-point');
    const objBoxes = document.querySelectorAll('.obj_box');
    const mathFields = document.querySelectorAll('math-field');
    
    // 각 시작점에 클릭 이벤트 추가
    startPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            // 이전 애니메이션 초기화
            resetAnimations();
            
            // 현재 선택된 경로 활성화
            activatePath(index);
        });
    });

    // 모든 애니메이션 초기화 함수
    function resetAnimations() {
        objBoxes.forEach(box => {
            box.classList.remove('active');
            box.querySelector('.path-draw').classList.remove('active');
        });
    }

    // 특정 경로 활성화 함수
    function activatePath(index) {
        const currentBox = objBoxes[index];
        const obj = currentBox.querySelector('.obj');
        
        // active 클래스 추가
        currentBox.classList.add('active');
        currentBox.querySelector('.path-draw').classList.add('active');
        
        // 애니메이션 종료 시 active 클래스 제거 및 math-field 활성화
        obj.addEventListener('animationend', function() {
            currentBox.classList.remove('active');
            
            // 해당하는 math-field 활성화
            const boxClass = currentBox.classList[1]; // obj_box1, obj_box2 등
            const boxNumber = boxClass.replace('obj_box', '');
            
            // math-field 활성화 순서 매핑
            const fieldOrder = {
                '1': 3, // obj_box1 -> input3
                '2': 2, // obj_box2 -> input2
                '3': 4, // obj_box3 -> input4
                '4': 1  // obj_box4 -> input1
            };
            
            const targetField = mathFields[fieldOrder[boxNumber] - 1];
            if (targetField) {
                targetField.removeAttribute('disabled');
                targetField.focus();
            }
        }, { once: true });
    }
});
