import { checkAnswerPop } from './common.js';

// 특정 요소의 scale 값을 가져오는 함수
function getScaleValue(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (transform === 'none' || !transform) {
    return 1; // transform이 없거나 'none'인 경우 기본 값은 1입니다.
  }

  // matrix(a, b, c, d, e, f) 형태에서 scaleX 값 (a) 추출
  const matrixMatch = transform.match(/matrix\(([^,]+),/);
  if (matrixMatch && matrixMatch[1]) {
    return parseFloat(matrixMatch[1]);
  }

  // scale(X) 또는 scale(X, Y) 형태에서 scaleX 값 추출
  const scaleMatch = transform.match(/scale\(([^,)]+)/);
  if (scaleMatch && scaleMatch[1]) {
    return parseFloat(scaleMatch[1]);
  }

  // scale3d(X, Y, Z) 형태에서 scaleX 값 추출
  const scale3dMatch = transform.match(/scale3d\(([^,]+),/);
  if (scale3dMatch && scale3dMatch[1]) {
    return parseFloat(scale3dMatch[1]);
  }

  // scaleX(X) 형태에서 scaleX 값 추출
  const scaleXMatch = transform.match(/scaleX\(([^)]+)\)/);
  if (scaleXMatch && scaleXMatch[1]) {
    return parseFloat(scaleXMatch[1]);
  }

  console.warn('Could not parse scale from transform:', transform);
  return 1; // 일치하는 변환 값이 없으면 기본 값은 1입니다.
}

export function setCirclePos() {
  $('.page.on .dot').each(function () {
    const $dot = $(this);
    const pos = $dot.attr('pos');

    const $circle = $(`.page.on circle[pos="${pos}"]`);
    const $svg = $('.page.on svg');

    if ($circle.length && $svg.length) {
      const dotRect = this.getBoundingClientRect();
      const svgRect = $svg[0].getBoundingClientRect();

      const scale = getScaleValue($('#scaleWrapper')[0] || document.body);

      const cx = (dotRect.left + dotRect.width / 2 - svgRect.left) / scale;
      const cy = (dotRect.top + dotRect.height / 2 - svgRect.top) / scale;

      $circle.attr({ cx, cy });
    }
  });
}

$(window).on('load resize', function () {
  // resize 이벤트 추가
  // 페이지 로드 및 리사이즈 시 circle 위치 조정
  $('.page.on').each(function () {
    const $currentPage = $(this);
    $currentPage.find('.dot').each(function () {
      const $dot = $(this);
      const pos = $dot.attr('pos');
      const $circle = $currentPage.find(`circle[pos="${pos}"]`);
      const $svg = $currentPage.find('svg.theboard'); // svg 선택자 구체화

      if ($circle.length && $svg.length) {
        const dotRect = this.getBoundingClientRect();
        const svgRect = $svg[0].getBoundingClientRect();
        // scaleWrapper의 scale 값 가져오기 (없으면 body)
        const scaleElement = document.getElementById('scaleWrapper') || document.body;
        const scale = getScaleValue(scaleElement);

        // scale 값이 0 또는 유효하지 않은 경우 기본값 1 사용
        const safeScale = scale && scale !== 0 ? scale : 1;

        // getBoundingClientRect는 scale이 적용된 크기와 위치를 반환하므로,
        // SVG 내부 좌표로 변환할 때 scale로 나눠줘야 함.
        const cx = (dotRect.left + dotRect.width / 2 - svgRect.left) / safeScale;
        const cy = (dotRect.top + dotRect.height / 2 - svgRect.top) / safeScale;

        $circle.attr({ cx, cy });
      }
    });
    // 기존에 그려진 선들의 좌표도 업데이트 (필요한 경우)
    $currentPage.find('svg.theboard line.correct').each(function () {
      // 구현: 선의 시작/끝점 pos 찾아서 circle 좌표 업데이트 후 선 다시 그리기
      // 예: const startPos = $(this).attr('data-start-pos'); // 선에 pos 정보 저장 필요
      //     const endPos = $(this).attr('data-end-pos');
      //     const startCircle = $currentPage.find(`circle[pos="${startPos}"]`);
      //     const endCircle = $currentPage.find(`circle[pos="${endPos}"]`);
      //     if(startCircle.length && endCircle.length) {
      //         $(this).attr('x1', startCircle.attr('cx'));
      //         $(this).attr('y1', startCircle.attr('cy'));
      //         $(this).attr('x2', endCircle.attr('cx'));
      //         $(this).attr('y2', endCircle.attr('cy'));
      //     }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const isActivitiesLimit = false; // 활동 제한 여부 (현재 사용되지 않음)

  // 현재 보이는 페이지의 board, solution 영역 얻기
  function getCurrentBoardElements() {
    const page = document.querySelector('.page.on');
    if (!page) return { canvas: null, areaSolution: null, startPoints: [], endPoints: [] };
    return {
      canvas: page.querySelector('.theboard'),
      areaSolution: page.querySelector('.area-solution'),
      startPoints: page.querySelectorAll('.theboard .thapoint'), // a렌더링 순서 고려하여 .theboard 하위에서 찾기
      endPoints: page.querySelectorAll('.theboard .thapoint2'),
    };
  }

  let startLeft = true; // 드래그/클릭 시작점이 왼쪽(.thapoint)인지 여부
  let startPoint = null; // 드래그 또는 첫 번째 클릭 시작점 요소
  let line = null; // 현재 그려지고 있는 선 (드래그 중 또는 클릭 완료 시 생성)
  let snapped = false; // 드래그 중 끝점에 스냅되었는지 여부
  let snappedTo = null; // 드래그 중 스냅된 끝점 요소
  let activePoint = null; // 클릭-투-클릭 시 첫 번째 클릭된 점 요소

  // SVG 점 좌표 얻기 (cx, cy 속성)
  function getPointCoordinates(point) {
    if (!point) return { x: 0, y: 0 };
    return {
      x: parseFloat(point.getAttribute('cx')),
      y: parseFloat(point.getAttribute('cy')),
    };
  }

  // SVG 선 요소 생성
  function createLine(x1, y1, x2, y2) {
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('stroke', '#FF5884'); // 임시 선 색상
    newLine.setAttribute('stroke-width', '8');
    newLine.setAttribute('stroke-linecap', 'round');
    newLine.style.pointerEvents = 'none'; // 선 자체는 이벤트 받지 않음
    return newLine;
  }

  // 드래그 시작 (mousedown/touchstart on circle)
  function onPointMouseDown(event) {
    console.log('onPointMouseDown');
    const targetPoint = event.currentTarget;
    // 클릭 모드 진행 중이거나, 이미 완료된 점이면 드래그 시작 안 함
    if (activePoint || targetPoint.classList.contains('done')) {
      event.preventDefault();
      return;
    }

    const { areaSolution } = getCurrentBoardElements();
    if (!areaSolution) return;

    startPoint = targetPoint;
    startLeft = startPoint.classList.contains('thapoint');

    const coords = getPointCoordinates(startPoint);
    line = createLine(coords.x, coords.y, coords.x, coords.y);
    areaSolution.appendChild(line);

    // 시작점 .dot 시각적 표시 (on 클래스)
    const pos = startPoint.getAttribute('pos');
    if (pos) {
      $(`.page.on .dot[pos="${pos}"]`).addClass('on');
    }

    event.preventDefault(); // 기본 드래그 동작 방지
  }

  // 드래그 중 (mousemove/touchmove on canvas)
  function onCanvasMouseMove(event) {
    // 드래그 시작 상태 아니거나(line 없음), 클릭 모드일 때(activePoint 있음) 무시
    if (!line || activePoint) return;

    const evPoint = getXYEventPoint(event); // 스케일 보정된 캔버스 좌표
    if (!evPoint) return;

    const { canvas } = getCurrentBoardElements();
    if (!canvas) return;

    // 현재 마우스/터치 포인터의 화면 좌표 얻기
    let clientX, clientY;
    if (event.type.startsWith('touch')) {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        return;
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // 스냅 처리: 포인터 아래 요소 확인
    snapped = false;
    snappedTo = null;
    const elementUnderPointer = document.elementFromPoint(clientX, clientY);

    // 스냅 조건: 다른 타입의 점이고, 시작점과 다르고, 아직 완료되지 않은 점
    const isPotentialEndPoint =
      elementUnderPointer &&
      elementUnderPointer.tagName === 'circle' && // circle 요소인지 확인
      (elementUnderPointer.classList.contains('thapoint') || elementUnderPointer.classList.contains('thapoint2')) &&
      elementUnderPointer !== startPoint &&
      !elementUnderPointer.classList.contains('done');

    let endPos = null; // 스냅된 점의 pos
    if (isPotentialEndPoint) {
      const isCorrectPair = (startLeft && elementUnderPointer.classList.contains('thapoint2')) || (!startLeft && elementUnderPointer.classList.contains('thapoint'));
      if (isCorrectPair) {
        // 유효한 스냅
        snapped = true;
        snappedTo = elementUnderPointer;
        endPos = snappedTo.getAttribute('pos');

        // 스냅된 점의 좌표로 line 끝점 설정
        const endCoords = getPointCoordinates(snappedTo);
        line.setAttribute('x2', endCoords.x);
        line.setAttribute('y2', endCoords.y);
      }
    }

    // 스냅되지 않았을 경우: 마우스/터치 좌표 사용 (evPoint)
    if (!snapped) {
      line.setAttribute('x2', evPoint.x);
      line.setAttribute('y2', evPoint.y);
    }

    // 스냅 시각 효과 처리 (.dot의 on 클래스 관리)
    const startPos = startPoint?.getAttribute('pos');
    $(`.page.on .dot.on:not(.done)`).each(function () {
      const currentPos = $(this).attr('pos');
      // 시작점 또는 현재 스냅된 점이 아니면 on 클래스 제거
      if (currentPos !== startPos && currentPos !== endPos) {
        $(this).removeClass('on');
      }
    });
    // 스냅된 점이 있다면 .on 추가 (done 상태 아니면)
    if (snapped && endPos && !$(`.page.on .dot[pos="${endPos}"]`).hasClass('done')) {
      $(`.page.on .dot[pos="${endPos}"]`).addClass('on');
    }

    event.preventDefault();
  }

  // 드래그 종료 (mouseup/touchend on canvas 또는 mouseleave)
  function onCanvasMouseUp(event) {
    // 클릭 모드 진행 중이면 드래그 종료 로직 무시
    if (activePoint) {
      event.preventDefault();
      return;
    }
    // 드래그 시작 상태 아니면(line 없음) 무시
    if (!line || !startPoint) {
      // 간혹 line만 남는 경우 방지 위해 reset 호출
      resetActivePoint();
      return;
    }

    const { areaSolution } = getCurrentBoardElements();
    if (!areaSolution) {
      console.error('areaSolution not found on mouseup');
      resetActivePoint(); // 필수 요소 없으면 리셋
      return;
    }

    // 스냅된 유효한 끝점이 있는지 확인
    const isEndPointValid = snapped && snappedTo;
    // 추가적인 타입 체크는 handleLineDrawing 에서도 함

    if (isEndPointValid) {
      // 유효한 드롭 -> 선 그리기 완료 처리
      handleLineDrawing(snappedTo); // 스냅된 점을 끝점으로 전달
    } else {
      // 유효하지 않은 드롭 -> 임시 선 제거 및 상태 초기화
      line.remove();
      resetActivePoint();
    }

    // 드래그 관련 상태 최종 초기화 (위에서 처리 안된 경우 대비)
    snapped = false;
    snappedTo = null;
    // startPoint, line은 handleLineDrawing 또는 resetActivePoint 에서 null 처리됨

    event.preventDefault();
  }

  // 선 그리기 완료 및 정답 처리 (드래그 또는 클릭 완료 시)
  function handleLineDrawing(endPoint) {
    const { areaSolution } = getCurrentBoardElements();
    // 필수 요소 확인 (startPoint는 전역 변수 사용)
    if (!areaSolution || !startPoint || !endPoint) {
      console.error('handleLineDrawing: Missing required elements', { areaSolution, startPoint, endPoint });
      resetActivePoint(); // 문제가 있으면 일단 리셋
      if (line) line.remove();
      line = null;
      return;
    }

    // 클릭-투-클릭의 경우 line이 없음 -> 새로 생성 및 추가
    if (!line) {
      const startCoords = getPointCoordinates(startPoint);
      const endCoords = getPointCoordinates(endPoint);
      line = createLine(startCoords.x, startCoords.y, endCoords.x, endCoords.y);
      areaSolution.appendChild(line);
      // startLeft 상태 업데이트 (클릭 시작점에 따라)
      startLeft = startPoint.classList.contains('thapoint');
    } else {
      // 드래그의 경우, 선 끝점 좌표 최종 확정
      const endCoords = getPointCoordinates(endPoint);
      line.setAttribute('x2', endCoords.x);
      line.setAttribute('y2', endCoords.y);
    }

    // 정답 확인 (n 속성 값 비교)
    const isCorrect = startPoint.getAttribute('n') === endPoint.getAttribute('n');
    const startPos = startPoint.getAttribute('pos');
    const endPos = endPoint.getAttribute('pos');

    if (isCorrect) {
      // --- 정답 처리 ---
      line.setAttribute('stroke', '#273b56'); // 정답 선 색상
      line.classList.add('correct');
      // 선에 연결 정보 저장 (리사이즈 시 사용 위함 - 선택 사항)
      line.setAttribute('data-start-pos', startPos);
      line.setAttribute('data-end-pos', endPos);
      $(`.page.on .dot[pos="${startPos}"]`).addClass('correct');
      $(`.page.on .dot[pos="${endPos}"]`).addClass('correct');
      // 점 비활성화 (multi 클래스 없으면)
      if (!startPoint.classList.contains('multi')) {
        startPoint.style.pointerEvents = 'none';
        startPoint.classList.add('disabled'); // done 클래스 추가 활성화
      }
      if (!endPoint.classList.contains('multi')) {
        endPoint.style.pointerEvents = 'none';
        endPoint.classList.add('disabled'); // done 클래스 추가 활성화
      }

      // 연결된 .dot 스타일 업데이트 (done)
      if (startPos) $(`.page.on .dot[pos="${startPos}"]`).removeClass('on').addClass('done'); // done 클래스 추가 활성화
      if (endPos) $(`.page.on .dot[pos="${endPos}"]`).removeClass('on').addClass('done'); // done 클래스 추가 활성화

      // 모든 문제 완료 확인 로직 (이 부분은 유지)
      const correctLinesCount = areaSolution.querySelectorAll('line.correct').length;
      const nonMultiStartPointsCount = Array.from(getCurrentBoardElements().startPoints).filter((p) => !p.classList.contains('multi')).length;
      const allStartsDone = Array.from(getCurrentBoardElements().startPoints).every((p) => p.classList.contains('done') || p.classList.contains('multi'));
      if (correctLinesCount >= nonMultiStartPointsCount || allStartsDone) {
        const qeArea = document.querySelector('.page.on .qe_area');
        if (qeArea) qeArea.classList.add('disabled');
        checkAnswerPop?.();
      }

      playSound?.('o');
      let currentPage = $('.pagination button.on').index() + 1;
      checkPageAnswerStates?.(currentPage);

      // 정답 처리 후 상태 변수 초기화 제거 (resetActivePoint에서 처리)
      // startPoint = null;
      // line = null;
      // activePoint = null;
      // snapped = false;
      // snappedTo = null;
    } else {
      // --- 오답 처리 ---
      if (line) line.remove(); // 오답 선 제거 (line이 있을 경우)
      checkAnswerPop?.(); // 오답 팝업/피드백
      // 오답 시 endPoint 상태 직접 초기화 제거 (resetActivePoint에서 처리)
      // if (endPoint && !endPoint.classList.contains('multi')) { ... }
    }

    // !! 중요: 정답/오답 처리 후 항상 resetActivePoint 호출 !!
    resetActivePoint();

    $('.page.on .btnReset').removeClass('disable');
  }

  // 이벤트 좌표를 SVG 내부 좌표로 변환 (scale 고려)
  function getXYEventPoint(event) {
    const { canvas } = getCurrentBoardElements();
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleElement = document.getElementById('scaleWrapper') || document.body;
    const scale = getScaleValue(scaleElement);
    const safeScale = scale && scale !== 0 ? scale : 1;

    let clientX, clientY;
    if (event.type.startsWith('touch')) {
      // changedTouches는 touchend에서도 사용 가능하므로 우선 사용
      const touch = event.changedTouches?.[0] || event.touches?.[0];
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        return null;
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: (clientX - rect.left) / safeScale,
      y: (clientY - rect.top) / safeScale,
    };
  }

  // 활성 상태 초기화 (리셋 로직)
  function resetActivePoint() {
    // 현재 페이지의 모든 점(`.thapoint`, `.thapoint2`) 가져오기
    const { startPoints, endPoints } = getCurrentBoardElements();
    const allPoints = [...startPoints, ...endPoints];

    // 모든 점 순회하며 상태 초기화
    allPoints.forEach((point) => {
      // multi 클래스가 없는 점만 처리
      if (!point.classList.contains('multi')) {
        point.classList.remove('done'); // done 클래스 제거
        point.style.pointerEvents = ''; // 포인터 이벤트 복구

        // 연결된 .dot 요소 상태 초기화
        const pos = point.getAttribute('pos');
        if (pos) {
          $(`.page.on .dot[pos="${pos}"]`).removeClass('on done');
        }
      }
      // active 클래스는 특정 점에만 적용되므로 별도 처리 (아래)
      point.classList.remove('active');
    });

    // 임시선 제거
    if (line && line.getAttribute('stroke') === '#FF5884') {
      line.remove();
      // line = null; // 아래에서 null 처리됨
    }
    // 모든 .dot의 on 클래스 제거 (위에서 done과 함께 처리되기도 함)
    $('.page.on .dot.on').removeClass('on');

    // 상호작용 상태 변수 초기화
    snapped = false;
    snappedTo = null;
    startPoint = null;
    line = null;
    activePoint = null; // activePoint도 여기서 확실히 초기화
  }

  // 이벤트 리스너 설정
  function setupCanvasEvents() {
    document.querySelectorAll('.theboard').forEach((canvas) => {
      // 기존 리스너 제거 (중복 방지)
      canvas.removeEventListener('mousemove', onCanvasMouseMove);
      canvas.removeEventListener('touchmove', onCanvasMouseMove);
      canvas.removeEventListener('mouseup', onCanvasMouseUp);
      canvas.removeEventListener('touchend', onCanvasMouseUp);
      canvas.removeEventListener('mouseleave', onCanvasMouseUp);
      // 새 리스너 등록
      canvas.addEventListener('mousemove', onCanvasMouseMove);
      canvas.addEventListener('touchmove', onCanvasMouseMove, { passive: false });
      canvas.addEventListener('mouseup', onCanvasMouseUp);
      canvas.addEventListener('touchend', onCanvasMouseUp);
      canvas.addEventListener('mouseleave', onCanvasMouseUp);
    });
  }

  function setupPointEvents() {
    document.querySelectorAll('.theboard .thapoint, .theboard .thapoint2').forEach((point) => {
      // 기존 리스너 제거
      point.removeEventListener('mousedown', onPointMouseDown);
      point.removeEventListener('touchstart', onPointMouseDown);
      point.removeEventListener('click', onClickPoint);
      // 새 리스너 등록
      point.addEventListener('mousedown', onPointMouseDown);
      point.addEventListener('touchstart', onPointMouseDown, { passive: false });
      point.addEventListener('click', onClickPoint);
    });
  }

  // 클릭 이벤트 처리 (click on circle)
  function onClickPoint(event) {
    const targetPoint = event.currentTarget;
    if (targetPoint.classList.contains('done')) {
      return; // 완료된 점 무시
    }
    // 드래그 직후 발생하는 click 이벤트 방지 (선택적: 짧은 시간 내 mousedown 후 click 무시)
    // const timeSinceMouseDown = performance.now() - lastMouseDownTime;
    // if (timeSinceMouseDown < 200) return;

    if (!activePoint) {
      // --- 첫 번째 클릭 ---
      activePoint = targetPoint;
      activePoint.classList.add('active'); // 시각적 피드백 (CSS 필요)
      const pos = activePoint.getAttribute('pos');
      if (pos) $(`.page.on .dot[pos="${pos}"]`).addClass('on');

      // handleLineDrawing에서 사용할 시작점 정보 설정
      startPoint = activePoint;
      // line은 아직 없음 (클릭 모드)
      line = null;
    } else {
      // --- 두 번째 클릭 ---
      if (activePoint === targetPoint) {
        // 같은 점 다시 클릭: 선택 취소
        resetActivePoint();
      } else {
        // 다른 점 클릭: 유효성 검사 후 처리
        const isSecondPointValidType = (activePoint.classList.contains('thapoint') && targetPoint.classList.contains('thapoint2')) || (activePoint.classList.contains('thapoint2') && targetPoint.classList.contains('thapoint'));

        if (isSecondPointValidType) {
          // 유효한 쌍 -> 선 그리기 처리
          handleLineDrawing(targetPoint); // targetPoint를 endPoint로 전달
        } else {
          // 유효하지 않은 쌍 (같은 타입 등) -> 첫 번째 선택 취소
          resetActivePoint();
          // 요구사항: 잘못된 두 번째 클릭 시 바로 새 시작점으로? -> 현재는 취소만.
        }
      }
    }
    // 이벤트 전파 중지 (상위 요소 이벤트 방지)
    event.stopPropagation();
  }

  // 초기 이벤트 리스너 설정
  setupCanvasEvents();
  setupPointEvents();

  // 페이지 변경 감지 및 이벤트 재설정 로직
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // body 클래스 변경 시, 페이지 전환 가능성 확인
        // .page.on 요소가 변경되었는지 확인하는 더 정확한 방법 고려
        const newPage = document.querySelector('.page.on');
        if (newPage && newPage !== previousPage) {
          // 페이지가 실제로 변경되었는지 확인
          // console.log('Page changed, resetting events and state.');
          // 기존 페이지 이벤트 제거 시도 (페이지별로 관리했다면 더 좋음)
          // 여기서는 일단 새로 설정하기 전에 상태 초기화
          resetActivePoint();
          // 새 페이지에 이벤트 리스너 설정
          setupCanvasEvents();
          setupPointEvents();
          previousPage = newPage; // 현재 페이지 추적
        }
      }
    }
  });

  let previousPage = document.querySelector('.page.on'); // 초기 페이지 추적
  // 감시 설정: body 클래스 변경 감시
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: false });
});
