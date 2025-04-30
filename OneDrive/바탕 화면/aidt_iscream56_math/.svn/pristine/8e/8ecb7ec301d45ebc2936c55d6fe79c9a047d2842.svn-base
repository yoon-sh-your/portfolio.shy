import { checkAnswerPop } from './common.js';

// 특정 요소의 scale 값을 가져오는 함수
function getScaleValue(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (transform === 'none') {
    return 1; // transform이 없는 경우 기본 값은 1입니다.
  }

  // scale 값을 추출하기 위해 정규 표현식을 사용합니다.
  const match = transform.match(/matrix\(([^,]+),[^,]+,[^,]+,[^,]+,[^,]+,[^,]+\)/);
  if (match) {
    return parseFloat(match[1]);
  }

  // 2D 변환이 아닌 경우 (예: scale3d 등)
  const scaleMatch = transform.match(/scale\(([^,]+)\)/);
  if (scaleMatch) {
    return parseFloat(scaleMatch[1]);
  }

  return 1; // 일치하는 변환 값이 없으면 기본 값은 1입니다.
}
$(window).on('load', function () {
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
});

document.addEventListener('DOMContentLoaded', function () {
  const isActivitiesLimit = false; // 활동 제한 여부

  // 현재 보이는 페이지의 board, solution 영역 얻기
  function getCurrentBoardElements() {
    const page = document.querySelector('.page.on');
    return {
      canvas: page.querySelector('.theboard'),
      areaSolution: page.querySelector('.area-solution'),
      startPoints: page.querySelectorAll('.thapoint'),
      endPoints: page.querySelectorAll('.thapoint2'),
    };
  }

  let startLeft = true;
  let startPoint = null;
  let startEvt = null;
  let line = null;
  let snapped = false;
  let snappedTo = null;

  function getPointCoordinates(point) {
    return {
      x: parseFloat(point.getAttribute('cx')),
      y: parseFloat(point.getAttribute('cy')),
    };
  }

  function createLine(x1, y1, x2, y2) {
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('stroke', '#FF5884');
    newLine.setAttribute('stroke-width', '8');
    newLine.setAttribute('stroke-linecap', 'round');
    newLine.style.pointerEvents = 'none';
    return newLine;
  }

  function onPointMouseDown(event) {
    const { areaSolution } = getCurrentBoardElements();

    startEvt = event;
    startLeft = event.target.classList.contains('thapoint');
    startPoint = event.target;

    const coords = getPointCoordinates(startPoint);
    line = createLine(coords.x, coords.y, coords.x, coords.y);
    areaSolution.appendChild(line);

    const pos = startPoint.getAttribute('pos');
    if (pos) {
      $(`.page.on .dot[pos="${pos}"]`).addClass('on');
    }

    event.preventDefault();
  }

  function onCanvasMouseMove(event) {
    const evPoint = getXYEventPoint(event);
    if (!evPoint || !line) return;

    const { canvas } = getCurrentBoardElements();

    const svg = canvas;
    const point = svg.createSVGPoint();
    point.x = evPoint.x;
    point.y = evPoint.y;

    const startCoords = getXYEventPoint(startEvt);
    let x = point.x;
    let y = point.y + (startCoords.y - point.y < 0 ? -6 : 6);

    let clientX, clientY;
    if (event.type.startsWith('touch')) {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const endPoint = document.elementFromPoint(clientX, clientY);
    if ((endPoint?.classList.contains('thapoint') || endPoint?.classList.contains('thapoint2')) && endPoint !== startPoint) {
      const endCoords = getXYEventPoint(event);
      x = endCoords.x;
      y = endCoords.y;
      snapped = true;
      snappedTo = endPoint;
    }

    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    event.preventDefault();
    resetActivePoint();
  }
  function onCanvasMouseUp(event) {
    const { areaSolution } = getCurrentBoardElements();
    if (!line || !startPoint) return;

    let endPoint = snappedTo || event.target;

    if ((startLeft && endPoint?.classList.contains('thapoint2')) || (!startLeft && endPoint?.classList.contains('thapoint'))) {
      handleLineDrawing(endPoint);
    } else {
      areaSolution.removeChild(line);

      const pos = startPoint?.getAttribute('pos');
      if (pos) {
        $(`.page.on .dot[pos="${pos}"]`).removeClass('on');
      }
    }

    startEvt = null;
    startPoint = null;
    line = null;
    snappedTo = null;
    event.preventDefault();
  }

  function handleLineDrawing(endPoint) {
    const { areaSolution } = getCurrentBoardElements();
    const endCoords = getPointCoordinates(endPoint);
    line.setAttribute('x2', endCoords.x);
    line.setAttribute('y2', endCoords.y);

    const startPos = startPoint.getAttribute('pos');
    const endPos = endPoint.getAttribute('pos');

    console.log(startPoint.getAttribute('n'), '//', endPoint.getAttribute('n'));

    if (startPoint.getAttribute('n') !== endPoint.getAttribute('n')) {
      line.remove();

      if (startPos) $(`.page.on .dot[pos="${startPos}"]`).removeClass('on');
      checkAnswerPop?.();
      return;
    }

    line.setAttribute('stroke', '#273B56');
    if (!startPoint.classList.contains('multi')) {
      startPoint.style.pointerEvents = 'none';
    }
    if (!endPoint.classList.contains('multi')) {
      endPoint.style.pointerEvents = 'none';
    }
    startPoint.classList.add('done');

    if (startPos) $(`.page.on .dot[pos="${startPos}"]`).addClass('done');
    if (endPos) $(`.page.on .dot[pos="${endPos}"]`).addClass('done');

    if ($('.page.on .thapoint').length === $('.page.on svg line').length) {
      $('.page.on .qe_area').addClass('disabled');
      checkAnswerPop?.();
    }

    playSound?.('o');
    let currentPage = $('.pagination button.on').index() + 1;
    checkPageAnswerStates?.(currentPage);
  }

  function getXYEventPoint(event) {
    const { canvas } = getCurrentBoardElements();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = getScaleValue(document.getElementById('scaleWrapper'));

    let clientX, clientY;
    if (event.type.startsWith('touch')) {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: (clientX - rect.left) / scaleFactor,
      y: (clientY - rect.top) / scaleFactor,
    };
  }

  function resetActivePoint() {
    // $('.active').removeClass('active');
    // $('.active-dot').removeClass('active-dot').css({ transform: 'unset' });
    // $('.end').removeClass('end');
  }

  function setupCanvasEvents() {
    document.querySelectorAll('.theboard').forEach((canvas) => {
      canvas.addEventListener('mousemove', onCanvasMouseMove);
      canvas.addEventListener('touchmove', onCanvasMouseMove);
      canvas.addEventListener('mouseup', onCanvasMouseUp);
      canvas.addEventListener('touchend', onCanvasMouseUp);
    });
  }

  function setupPointEvents() {
    document.querySelectorAll('.thapoint, .thapoint2').forEach((point) => {
      point.addEventListener('mousedown', onPointMouseDown);
      point.addEventListener('touchstart', onPointMouseDown);
      point.addEventListener('click', onClickPoint);
      point.addEventListener('touchend', onClickPoint);
    });
  }

  function onClickPoint(e) {
    const $this = $(this);
    const $activePoint = $('.active');
    const isThapoint = $this.hasClass('thapoint');

    if ($activePoint.length) {
      if (($activePoint.hasClass('thapoint') && !isThapoint) || ($activePoint.hasClass('thapoint2') && isThapoint)) {
        drawLine($activePoint[0], this);
        $activePoint.css('pointer-events', 'none');
        $this.css('pointer-events', 'none');
        $('.btn.hide').addClass('show');
        resetActivePoint();
      }
    } else {
      // $this.addClass('active');
      // const pos = $this.attr('pos');
      // $(`.dot[pos="${pos}"]`).addClass('active-dot').css({ transform: 'scale(1.3)' });
    }
  }

  function drawLine(from, to) {
    const { areaSolution } = getCurrentBoardElements();
    const x1 = from.getAttribute('cx');
    const y1 = from.getAttribute('cy');
    const x2 = to.getAttribute('cx');
    const y2 = to.getAttribute('cy');

    const newLine = createLine(x1, y1, x2, y2);
    areaSolution.appendChild(newLine);
  }

  setupCanvasEvents();
  setupPointEvents();
});
