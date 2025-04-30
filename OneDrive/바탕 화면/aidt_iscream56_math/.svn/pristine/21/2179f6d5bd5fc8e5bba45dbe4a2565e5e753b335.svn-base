// Function to read class from active page and apply to .title.score
const updateTitleScoreClass = () => {
  // Get the current active page element from the global variable
  const currentActivePage = pagenation.activePage;

  if (!currentActivePage) {
    // console.log("updateTitleScoreClass: 현재 activePage 요소를 찾을 수 없음");
    return;
  }
  // console.log("updateTitleScoreClass 호출 대상:", currentActivePage);

  // Find the target .title.score element
  const scoreTarget = document.querySelector('.title.score');
  if (!scoreTarget) {
    // console.log("updateTitleScoreClass: .title.score 요소를 찾을 수 없음");
    return;
  }

  // Read status classes from the current active page element
  const hasSuccess = currentActivePage.classList.contains('success');
  const hasFail = currentActivePage.classList.contains('fail');
  const hasFailAll = currentActivePage.classList.contains('fail_all');

  // Clear previous status classes from .title.score
  scoreTarget.classList.remove('success', 'fail', 'fail_all');

  // Apply the found class to .title.score
  if (hasSuccess) {
    scoreTarget.classList.add('success');
    // console.log("score.js: .title.score에 'success' 적용됨");
  } else if (hasFail) {
    scoreTarget.classList.add('fail');
    // console.log("score.js: .title.score에 'fail' 적용됨");
  } else if (hasFailAll) {
    scoreTarget.classList.add('fail_all');
    // console.log("score.js: .title.score에 'fail_all' 적용됨");
  } else {
    // console.log("score.js: activePage 요소에 상태 클래스 없음");
  }
};