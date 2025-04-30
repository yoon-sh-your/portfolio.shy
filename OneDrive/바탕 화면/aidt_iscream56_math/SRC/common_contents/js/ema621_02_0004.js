document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 확인 함수
    function getCurrentPage() {
        const appWrap = document.getElementById('app_wrap');
        return appWrap.getAttribute('data-current-page');
    }
    
    // 오답 카운트 변수
    let wrongAnswerCount = 0;
    
    // 확인 버튼 클릭 이벤트
    document.querySelector('.btnCheck').addEventListener('click', function() {
        const currentPage = getCurrentPage();
        
        // 페이지 2일 때만 처리
        if (currentPage === 'page_2') {
            // 오답인 경우 (이 부분은 실제 오답 판별 로직에 맞게 수정 필요)
            const isWrongAnswer = true; // 임시로 true로 설정
            
            if (isWrongAnswer) {
                wrongAnswerCount++;
                
                // 두 번째 오답일 때
                if (wrongAnswerCount === 2) {
                    const tagElement = document.querySelector('.tag');
                    if (tagElement) {
                        tagElement.classList.add('on');
                    }
                }
            }
        }
    });
    
    // 리셋 버튼 클릭 이벤트
    document.querySelector('.btnReset').addEventListener('click', function() {
        const currentPage = getCurrentPage();
        
        // 페이지 2일 때만 처리
        if (currentPage === 'page_2') {
            // 오답 카운트 초기화
            wrongAnswerCount = 0;
            
            // tag에서 on 클래스 제거
            const tagElement = document.querySelector('.tag');
            if (tagElement) {
                tagElement.classList.remove('on');
            }
        }
    });
});
