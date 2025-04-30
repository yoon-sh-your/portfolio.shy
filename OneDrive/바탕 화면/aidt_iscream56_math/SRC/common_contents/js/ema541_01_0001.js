// btnReset 버튼의 active 클래스를 강제로 제거하고 비활성화
function forceDisableBtnReset() {
    const btnReset = document.querySelector('.btnReset');
    if (btnReset) {
        btnReset.classList.remove('active');
        btnReset.disabled = true;
        btnReset.style.opacity = '0.5';
        btnReset.style.pointerEvents = 'none';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 초기 실행
    forceDisableBtnReset();
    
    // MutationObserver 설정
    const btnReset = document.querySelector('.btnReset');
    if (btnReset) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    forceDisableBtnReset();
                }
            });
        });
        
        observer.observe(btnReset, { attributes: true });
        
        // 주기적으로 active 클래스 제거
        setInterval(forceDisableBtnReset, 100);
    }
    
    // 페이징 이벤트 후에도 실행
    document.addEventListener('click', function(e) {
        if (e.target.closest('.pagination button')) {
            setTimeout(forceDisableBtnReset, 100);
        }
    });
}); 