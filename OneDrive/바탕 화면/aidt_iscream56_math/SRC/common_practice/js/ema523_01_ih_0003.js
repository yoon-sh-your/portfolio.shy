runAfterAppReady(() => {
  let firstPoint = null;
  let scale = getScale();

  $('.connect_point').on('click', function (e) {
    e.stopPropagation(); // 다른 클릭 방지
    audioManager.playSound('click');
    const $this = $(this);
    const $quizArea = $this.closest('.quiz_area');
    const svg = $quizArea.find('svg')[0];
    const id = parseInt($this.attr('data-id'));

    // 클릭된 점의 중심 좌표 구하기
    const offset = $this.offset();
    const parentOffset = $quizArea.offset();

    const scaledWidth = $this.width();
    const scaledHeight = $this.height();
    const x = (offset.left - parentOffset.left) / scale + scaledWidth / 2;
    const y = (offset.top - parentOffset.top) / scale + scaledHeight / 2;

    if (!firstPoint) {
      firstPoint = { $el: $this, x, y, id, quizArea: $quizArea };
      $this.addClass('selected'); // 첫 번째 클릭 시 표시용 클래스
    } else {
      // 다른 영역이면 무시하고 초기화
      if (!firstPoint.quizArea.is($quizArea)) {
        firstPoint.$el.removeClass('selected');
        firstPoint = null;
        return;
      }

      const secondPoint = { $el: $this, x, y, id };

      // 두 점의 id 오름차순 정렬
      const ids = [firstPoint.id, secondPoint.id].sort((a, b) => a - b);
      const dataAnswer = `${ids[0]},${ids[1]}`;

      const exists = $(svg).find(`line[data-answer="${dataAnswer}"]`).length > 0;
      if (!exists) {
        const svgns = 'http://www.w3.org/2000/svg';
        const line = document.createElementNS(svgns, 'line');
        line.setAttribute('x1', firstPoint.x);
        line.setAttribute('y1', firstPoint.y);
        line.setAttribute('x2', secondPoint.x);
        line.setAttribute('y2', secondPoint.y);
        line.setAttribute('stroke', '#3B71FE');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('data-answer', dataAnswer);
        svg.appendChild(line);

        $('.btn_area button').addClass('active');
      }

      // 초기화
      firstPoint.$el.removeClass('selected');
      firstPoint = null;
    }
  });

  // quiz_area 외부 클릭 시 초기화
  $(document).on('click', function () {
    if (firstPoint) {
      firstPoint.$el.removeClass('selected');
      firstPoint = null;
    }
  });

  function checkConnectAnswers() {
    let allCorrect = true;

    $('.quiz_area').each(function () {
      const $quiz = $(this);
      const svg = $quiz.find('svg')[0];

      // 1. 사용자 선 목록 가져오기
      const userAnswers = [];
      $(svg)
        .find('line[data-answer]')
        .each(function () {
          const answer = $(this).attr('data-answer');
          userAnswers.push(answer);
        });

      // 2. 정답 목록 가져오기
      const correctList = $quiz.attr('data-answer-single');
      let correctAnswers = [];

      try {
        correctAnswers = JSON.parse(correctList.replace(/'/g, '"')); // ' → " 치환 후 JSON 변환
      } catch (err) {
        console.error('정답 형식 오류:', correctList);
        allCorrect = false;
        return;
      }

      // 3. 정렬 후 비교
      const sortedUser = userAnswers.map((a) => a.split(',').sort().join(',')).sort();
      const sortedCorrect = correctAnswers.map((a) => a.split(',').sort().join(',')).sort();

      const isCorrect = sortedUser.length === sortedCorrect.length && sortedUser.every((val, idx) => val === sortedCorrect[idx]);

      if (!isCorrect) {
        allCorrect = false;
        $quiz.addClass('wrong').removeClass('correct');
      } else {
        $quiz.addClass('correct').removeClass('wrong');
      }
    });

    return allCorrect;
  }

  // 커스텀 정답 조건
  window.customCheckCondition = function (el) {
    const result = checkConnectAnswers();
    return result;
  };

  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    $('.example').addClass('on');
  };

  window.onCorrectCustom = function () {
    document.body.classList.add('success');
    document.body.classList.add('result');
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    $('.quiz_area').each(function () {
      const $quiz = $(this);
      $quiz.find('svg line').remove(); // 선 제거
      $quiz.find('.connect_point').removeClass('selected'); // 선택 클래스 제거
      $quiz.removeClass('correct wrong'); // 상태 클래스 초기화
    });

    // 버튼 활성화도 필요하면 같이 초기화
    $('.btn_area button').removeClass('active');

    // 선택된 점 상태도 초기화 (전역 상태 초기화)
    firstPoint = null;

    $('.example').removeClass('on');
  };
});
