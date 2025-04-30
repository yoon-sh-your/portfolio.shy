document.addEventListener("DOMContentLoaded", function () {
    function checkPage() {
      let isPage4Visible = document.querySelector(".page_4")?.offsetParent !== null;
  
      // 페이지별 대발문 및 버튼 숨김
      document.querySelector(".title.type2").style.display = isPage4Visible ? "none" : "block";
    }
  
    // 페이지 변경 이벤트가 있을 때마다 실행 (예: 버튼 클릭)
    document.addEventListener("click", checkPage);
  
    // 초기 상태 체크 (페이지가 로드되었을 때 바로 체크)
    checkPage();
  });