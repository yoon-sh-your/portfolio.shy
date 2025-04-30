// var audio_click = new Audio("../../common/audio/click.mp3");

// 계산기 팝업 HTML 생성 함수
function createCalculatorHTML() {
    return `
        <div class="cal_popup calculator_wrap" tabindex="-1" style="position: absolute;">
            <div class="calculator_area">
                <input type="text" placeholder=" " class="cal_display" disabled value="0" />
                <div class="cal_buttons">
                    <button class="cal_btn" data-value="C">AC</button>
                    <button class="cal_btn" data-value="/">÷</button>
                    <button class="cal_btn" data-value="7">7</button>
                    <button class="cal_btn" data-value="8">8</button>
                    <button class="cal_btn" data-value="9">9</button>
                    <button class="cal_btn" data-value="*">×</button>
                    <button class="cal_btn" data-value="4">4</button>
                    <button class="cal_btn" data-value="5">5</button>
                    <button class="cal_btn" data-value="6">6</button>
                    <button class="cal_btn" data-value="-">-</button>
                    <button class="cal_btn" data-value="1">1</button>
                    <button class="cal_btn" data-value="2">2</button>
                    <button class="cal_btn" data-value="3">3</button>
                    <button class="cal_btn" data-value="+">+</button>
                    <button class="cal_btn" data-value="0">0</button>
                    <button class="cal_btn" data-value=".">.</button>
                    <button class="cal_btn cal_result" data-value="=">=</button>
                </div>
            </div>
            <button class="btn img_close" tabindex="0" aria-label="계산기 닫기"></button>
        </div>
    `;
}

// 계산기 기능을 초기화하는 함수 정의
function initializeCalculator() {
    const calculator_icon = document.querySelector(".calculator");
    if (!calculator_icon) {
        return;
    }

    calculator_icon.addEventListener("click", function() {
        const popup = document.querySelector(".cal_popup");
        const wrap = document.getElementById("app_wrap");
        
        if (popup) {
            popup.remove();
            calculator_icon.classList.remove("on");
            return;
        }

        const calculator_html = createCalculatorHTML();
        const container = document.getElementById("app_wrap") || document.body;
        container.insertAdjacentHTML('beforeend', calculator_html);
        
        const new_popup = document.querySelector(".cal_popup");
        if (!new_popup) return;
        
        calculator_icon.classList.add("on");
        new_popup.style.display = "block";
        
        if (wrap && new_popup) {
            var scale = globalScale || 1;
            var CALC_WIDTH = 290; // 기본 너비
            var CALC_HEIGHT = 360; // 기본 높이
            var app_rect = wrap.getBoundingClientRect(); // wrap 요소의 실제 크기 및 위치 정보

            // app_wrap의 실제 크기(스케일 적용됨)를 기준으로 중앙 계산
            var center_x = (app_rect.width - CALC_WIDTH * scale) / 2;
            var center_y = (app_rect.height - CALC_HEIGHT * scale) / 2; // app_rect.height 사용

            // 계산된 위치(스케일된 좌표 기준)를 scale로 나누어 
            // 부모 요소(#app_wrap)의 스케일되지 않은 좌표계에 맞게 설정
            new_popup.style.left = center_x / scale + "px";
            new_popup.style.top = center_y / scale + "px";
        }

        $(document).off("click", ".img_close").on("click", ".img_close", function() {
            new_popup.remove();
            calculator_icon.classList.remove("on");
        });

        if ($.ui && $.ui.draggable) {
            if ($(".cal_popup").hasClass('ui-draggable')) {
                try { $(".cal_popup").draggable('destroy'); } catch(e) {}
            }
            var scale = globalScale || 1;
            var calc_width = 290 * scale;
            var calc_height = 360 * scale;
            var app_wrap = document.getElementById("app_wrap");
            var app_rect = app_wrap.getBoundingClientRect();
            
            $(".cal_popup").draggable({
                containment: [
                    0,
                    0,
                    app_rect.width - calc_width,
                    app_rect.height - calc_height
                ],
                start: function(event, ui) {
                    ui.position.left = ui.position.left / scale;
                    ui.position.top = ui.position.top / scale;
                    ui.helper.css("cursor", "grabbing");
                },
                drag: function(event, ui) {
                    ui.position.left = ui.position.left / scale;
                    ui.position.top = ui.position.top / scale;
                },
                stop: function(event, ui) {
                    ui.position.left = ui.position.left / scale;
                    ui.position.top = ui.position.top / scale;
                    ui.helper.css("cursor", "move");
                }
            });
        }

        if ($(".cal_display")) {
            let calculator_display = $(".cal_display");
            let calculator_result_area = $(".textareaGroup textarea");
            let calculator_current_input = "";
            let calculator_last_number = "";
            let calculator_formula = "";
            let calculator_tag_type = "input";
            let calculator_is_number = false;

            if (calculator_display.prop("tagName")?.toLowerCase() === "input") {
                calculator_tag_type = "input";
            } else {
                calculator_tag_type = "span";
            }

            function return_calculator_number(val) {
                if (calculator_tag_type === "input") {
                    calculator_display.val(val);
                } else {
                    calculator_display.text(val);
                }
            }

            function replaced_formula(val) {
                let string;
                let parts;
                if (val) {
                    parts = calculator_formula.match(/([0-9.]+|[+\-*\/])/g) || []; 
                    for (var i = 0; i < parts.length; i++) {
                        if (parts[i] == "0" || parts[i] == "00") {
                            if (parts[i+1] !== '.' && !is_number(parts[i+1])) {
                                parts[i] = "0"; 
                            }
                        }
                    }
                    string = parts.join("");
                    calculator_formula = string;
                    string = string.replace(/\*/g, "×").replace(/÷/g, "/");
                } else {
                    string = calculator_formula.replace(/×/g, "*").replace(/÷/g, "/");
                }
                return string;
            }

            function is_number(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }

            $(".cal_btn").on("pointerup", function (e) {
                e.stopPropagation();
                let value = $(this).data("value");

                if (value === "C") {
                    calculator_current_input = "";
                    calculator_last_number = "";
                    calculator_formula = "";
                    calculator_is_number = false;
                    return_calculator_number(0);
                } else if (value === "=") {
                    if (is_number(calculator_last_number) || calculator_last_number === '0') {
                        try {
                            let formula_to_eval = replaced_formula(false);
                            if (/[+\-*\/]$/.test(formula_to_eval.trim())) {
                                formula_to_eval = formula_to_eval.trim().slice(0, -1);
                            }
                            let result = eval(formula_to_eval) || 0;
                            result = Math.round(result * 1000) / 1000;
                            return_calculator_number(result);
                            calculator_current_input = String(result);
                            calculator_formula = String(result);
                            calculator_last_number = String(result);
                            calculator_is_number = true;
                        } catch (error) {
                            console.error("Calculation error:", error);
                            return_calculator_number("Error");
                            calculator_current_input = "";
                            calculator_formula = "";
                            calculator_last_number = "";
                            calculator_is_number = false;
                        }
                    }
                } else if (value === "*" || value === "/" || value === "+" || value === "-") {
                    if (calculator_is_number || calculator_last_number === '.') { 
                        if (/[+\-*\/]$/.test(calculator_formula.trim())) {
                            calculator_formula = calculator_formula.trim().slice(0, -1) + value;
                        } else {
                            calculator_formula += value;
                        }
                        calculator_is_number = false;
                        calculator_last_number = value;
                        return_calculator_number(replaced_formula(true));
                    }
                } else if (value === ".") {
                    const last_num_segment = calculator_formula.split(/[+\-*\/]/).pop();
                    if (!last_num_segment.includes('.') && (calculator_is_number || calculator_formula === "" || /[+\-*\/]$/.test(calculator_formula.trim()))) {
                        if (calculator_formula === "" || /[+\-*\/]$/.test(calculator_formula.trim())){
                            calculator_formula += "0" + value;
                        } else {
                            calculator_formula += value;
                        }
                        calculator_is_number = true; 
                        calculator_last_number = value;
                        return_calculator_number(replaced_formula(true));
                    }
                } else {
                    calculator_formula += String(value);
                    calculator_is_number = true;
                    calculator_last_number = String(value);
                    return_calculator_number(replaced_formula(true));
                }
            });
        }
    });
}

function initialize_triangle_ruler() {
  const wrap = document.getElementById('app_wrap');
  const triangle = document.querySelector('.obj_triangle');
  const button = document.querySelector('.btn.triangle');

  if (!wrap || !button) return;

  let triangles = [];
  let isVisible = false;

  // 삼각자 숨기기 함수
  function hide_triangles() {
    wrap.classList.remove('on_measure_angle');
    triangles.forEach(t => t.css('display', 'none'));
    button.classList.remove('active');
    button.ariaLabel = '';
    isVisible = false;
  }

  // 삼각자 보이기 함수
  function show_triangles() {
    wrap.classList.add('on_measure_angle');
    triangles.forEach(t => t.css('display', 'block'));
    button.classList.add('active');
    button.ariaLabel = '활성화됨';
    isVisible = true;
  }

  // 삼각자 생성 함수
  function create_triangle(isReverse = false) {
    const new_triangle = $('<div/>').addClass('obj_triangle');
    if (isReverse) {
      new_triangle.addClass('reverse');
    }
    const handle = $('<button/>').addClass('handle');
    new_triangle.append(handle);
    new_triangle.appendTo('#app_wrap');
    
    const scale = globalScale || 1;
    const wrapRect = wrap.getBoundingClientRect();
    const triangleWidth = 500;  // 삼각자 실제 너비
    const triangleHeight = 257; // 삼각자 실제 높이
    const gap = 30;  // 두 삼각자 사이 간격 (100에서 30으로 줄임)
    
    // 중앙 위치 계산 (스케일 적용)
    const centerY = ((wrapRect.height - triangleHeight * scale) / 2) / scale;
    let centerX;
    
    // 버튼의 data-triangle 속성 확인 (F|R)
    const triangleType = button.dataset.triangle || 'F';
    
    if (triangleType === 'F|R') {
      const totalWidth = triangleWidth * 2 + gap; // 전체 너비 (두 삼각자 + 간격)
      const startX = (wrapRect.width - totalWidth * scale) / 2; // 시작 X 위치
      
      if (isReverse) {
        // 왼쪽 삼각자
        centerX = startX / scale;
      } else {
        // 오른쪽 삼각자
        centerX = (startX + (triangleWidth + gap) * scale) / scale;
      }
    } else {
      // 하나의 삼각자일 경우 정중앙
      centerX = (wrapRect.width - triangleWidth * scale) / 2 / scale;
    }
    
    new_triangle.css({ 
      top: centerY,
      left: centerX
    });
    
    return new_triangle;
  }

  // 삼각자 초기 생성
  function create_triangles() {
    if (triangles.length === 0) {
      const triangleType = button.dataset.triangle || 'F';
      
      if (triangleType === 'F|R') {
        triangles.push(create_triangle(false));
        triangles.push(create_triangle(true));
      } else if (triangleType === 'F') {
        triangles.push(create_triangle(false));
      } else if (triangleType === 'R') {
        triangles.push(create_triangle(true));
      }

      setup_triangle_events();
    }
    show_triangles();
  }

  // 삼각자 이벤트 설정
  function setup_triangle_events() {
    let angle = 0;
    let isRotating = false;
    let isMoving = false;
    let currentMoveHandler = null;
    let currentEndHandler = null;

    // 스케일 보정 함수
    function calc_zoom(value, offset = 0) {
      const scale = globalScale || 1;
      return (value / scale) + offset;
    }

    // 각 삼각자에 대해 드래그 이벤트 설정
    triangles.forEach(new_triangle => {
      const handle = new_triangle.find('.handle');
      
      // 회전 핸들 이벤트
      handle.on('mousedown touchstart', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (isMoving) return;
        isRotating = true;

        const calc_angle_degrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
        let pX = (pY = cX = cY = sA = mA = degree = 0);
        const triangleRect = new_triangle.get(0).getBoundingClientRect();
        const scale = globalScale || 1;

        // 삼각자의 실제 무게중심 계산 (스케일 적용)
        const isReverse = new_triangle.hasClass('reverse');
        const width = triangleRect.width * scale;
        const height = triangleRect.height * scale;

        if (isReverse) {
          cX = triangleRect.left + (width * 2/3);
          cY = triangleRect.top + (height * 2/3);
        } else {
          cX = triangleRect.left + (width * 1/3);
          cY = triangleRect.top + (height * 2/3);
        }
        
        // 터치/마우스 좌표 계산
        const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;
        
        pX = clientX - cX;
        pY = clientY - cY;
        sA = calc_angle_degrees(pX, pY);

        // 이전 핸들러 제거
        if (currentMoveHandler) {
          document.removeEventListener('mousemove', currentMoveHandler);
          document.removeEventListener('touchmove', currentMoveHandler);
        }
        if (currentEndHandler) {
          document.removeEventListener('mouseup', currentEndHandler);
          document.removeEventListener('touchend', currentEndHandler);
        }

        currentMoveHandler = function(e) {
          if (!isRotating) return;
          e.preventDefault();
          e.stopPropagation();

          const moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
          const moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
          const currentX = moveX - cX;
          const currentY = moveY - cY;
          const mA = calc_angle_degrees(currentX, currentY);
          degree = mA - sA + angle;
          new_triangle.css({ transform: `rotate(${degree}deg)` });
        };

        currentEndHandler = function(e) {
          if (!isRotating) return;
          e.preventDefault();
          e.stopPropagation();
          isRotating = false;
          angle = degree;
          document.removeEventListener('mousemove', currentMoveHandler);
          document.removeEventListener('touchmove', currentMoveHandler);
          document.removeEventListener('mouseup', currentEndHandler);
          document.removeEventListener('touchend', currentEndHandler);
          currentMoveHandler = null;
          currentEndHandler = null;
        };

        document.addEventListener('mousemove', currentMoveHandler, { passive: false });
        document.addEventListener('touchmove', currentMoveHandler, { passive: false });
        document.addEventListener('mouseup', currentEndHandler);
        document.addEventListener('touchend', currentEndHandler);
      });

      // 이동 이벤트
      new_triangle.on('mousedown touchstart', (evt) => {
        if (evt.target.classList.contains('handle')) return;
        evt.preventDefault();
        evt.stopPropagation();
        if (isRotating) return;
        isMoving = true;
        
        const top = new_triangle.get(0).offsetTop;
        const left = new_triangle.get(0).offsetLeft;
        
        // 터치/마우스 좌표 계산
        const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;
        
        const mX = calc_zoom(clientX, -left);
        const mY = calc_zoom(clientY, -top);

        // 이전 핸들러 제거
        if (currentMoveHandler) {
          document.removeEventListener('mousemove', currentMoveHandler);
          document.removeEventListener('touchmove', currentMoveHandler);
        }
        if (currentEndHandler) {
          document.removeEventListener('mouseup', currentEndHandler);
          document.removeEventListener('touchend', currentEndHandler);
        }

        currentMoveHandler = function(e) {
          if (!isMoving) return;
          e.preventDefault();
          e.stopPropagation();

          const moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
          const moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
          new_triangle.css({ 
            top: calc_zoom(moveY, -mY), 
            left: calc_zoom(moveX, -mX) 
          });
        };

        currentEndHandler = function(e) {
          if (!isMoving) return;
          e.preventDefault();
          e.stopPropagation();
          isMoving = false;
          document.removeEventListener('mousemove', currentMoveHandler);
          document.removeEventListener('touchmove', currentMoveHandler);
          document.removeEventListener('mouseup', currentEndHandler);
          document.removeEventListener('touchend', currentEndHandler);
          currentMoveHandler = null;
          currentEndHandler = null;
        };

        document.addEventListener('mousemove', currentMoveHandler, { passive: false });
        document.addEventListener('touchmove', currentMoveHandler, { passive: false });
        document.addEventListener('mouseup', currentEndHandler);
        document.addEventListener('touchend', currentEndHandler);
      });
    });
  }

  // 버튼 클릭 시 삼각자 토글
  button.addEventListener('click', () => {
    if (triangles.length === 0) {
      create_triangles();
    } else {
      if (isVisible) {
        hide_triangles();
      } else {
        show_triangles();
      }
    }
  });
}

function initialize_ruler() {
  const wrap = document.getElementById('app_wrap');
  const button = document.querySelector('.btn.ruler');

  if (!wrap || !button) return;

  let ruler = null;
  let isVisible = false;

  // 일반자 숨기기 함수
  function hide_ruler() {
    wrap.classList.remove('on_measure');
    if (ruler) {
      ruler.css('display', 'none');
    }
    button.classList.remove('active');
    button.ariaLabel = '';
    isVisible = false;
  }

  // 일반자 보이기 함수
  function show_ruler() {
    wrap.classList.add('on_measure');
    if (ruler) {
      ruler.css('display', 'block');
    }
    button.classList.add('active');
    button.ariaLabel = '활성화됨';
    isVisible = true;
  }

  // 일반자 생성 함수
  function create_ruler() {
    const new_ruler = $('<div/>').addClass('obj_ruler');
    const handle = $('<button/>').addClass('handle');
    new_ruler.append(handle);
    new_ruler.appendTo('#app_wrap');
    
    const scale = globalScale || 1;
    const wrapRect = wrap.getBoundingClientRect();
    const rulerWidth = 600;  // 일반자 실제 너비
    const rulerHeight = 96;  // 일반자 실제 높이
    
    // 중앙 위치 계산 (스케일 적용)
    const centerY = ((wrapRect.height - rulerHeight * scale) / 2) / scale;
    const centerX = (wrapRect.width - rulerWidth * scale) / 2 / scale;
    
    new_ruler.css({ 
      top: centerY,
      left: centerX
    });
    
    return new_ruler;
  }

  // 일반자 이벤트 설정
  function setup_ruler_events() {
    let angle = 0;
    let isRotating = false;
    let isMoving = false;
    let currentMoveHandler = null;
    let currentEndHandler = null;

    // 스케일 보정 함수
    function calc_zoom(value, offset = 0) {
      const scale = globalScale || 1;
      return (value / scale) + offset;
    }

    const handle = ruler.find('.handle');
    
    // 회전 핸들 이벤트
    handle.on('mousedown touchstart', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (isMoving) return;
      isRotating = true;

      const calc_angle_degrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
      let pX = (pY = cX = cY = sA = mA = degree = 0);
      const rulerRect = ruler.get(0).getBoundingClientRect();
      const scale = globalScale || 1;

      // 일반자의 중심점 계산 (스케일 적용)
      cX = rulerRect.left + (rulerRect.width * scale / 2);
      cY = rulerRect.top + (rulerRect.height * scale / 2);
      
      // 터치/마우스 좌표 계산
      const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;
      
      pX = clientX - cX;
      pY = clientY - cY;
      sA = calc_angle_degrees(pX, pY);

      // 이전 핸들러 제거
      if (currentMoveHandler) {
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
      }
      if (currentEndHandler) {
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
      }

      currentMoveHandler = function(e) {
        if (!isRotating) return;
        e.preventDefault();
        e.stopPropagation();

        const moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const currentX = moveX - cX;
        const currentY = moveY - cY;
        const mA = calc_angle_degrees(currentX, currentY);
        degree = mA - sA + angle;
        ruler.css({ transform: `rotate(${degree}deg)` });
      };

      currentEndHandler = function(e) {
        if (!isRotating) return;
        e.preventDefault();
        e.stopPropagation();
        isRotating = false;
        angle = degree;
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
        currentMoveHandler = null;
        currentEndHandler = null;
      };

      document.addEventListener('mousemove', currentMoveHandler, { passive: false });
      document.addEventListener('touchmove', currentMoveHandler, { passive: false });
      document.addEventListener('mouseup', currentEndHandler);
      document.addEventListener('touchend', currentEndHandler);
    });

    // 이동 이벤트
    ruler.on('mousedown touchstart', (evt) => {
      if (evt.target.classList.contains('handle')) return;
      evt.preventDefault();
      evt.stopPropagation();
      if (isRotating) return;
      isMoving = true;
      
      const top = ruler.get(0).offsetTop;
      const left = ruler.get(0).offsetLeft;
      
      // 터치/마우스 좌표 계산
      const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;
      
      const mX = calc_zoom(clientX, -left);
      const mY = calc_zoom(clientY, -top);

      // 이전 핸들러 제거
      if (currentMoveHandler) {
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
      }
      if (currentEndHandler) {
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
      }

      currentMoveHandler = function(e) {
        if (!isMoving) return;
        e.preventDefault();
        e.stopPropagation();

        const moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        ruler.css({ 
          top: calc_zoom(moveY, -mY), 
          left: calc_zoom(moveX, -mX) 
        });
      };

      currentEndHandler = function(e) {
        if (!isMoving) return;
        e.preventDefault();
        e.stopPropagation();
        isMoving = false;
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
        currentMoveHandler = null;
        currentEndHandler = null;
      };

      document.addEventListener('mousemove', currentMoveHandler, { passive: false });
      document.addEventListener('touchmove', currentMoveHandler, { passive: false });
      document.addEventListener('mouseup', currentEndHandler);
      document.addEventListener('touchend', currentEndHandler);
    });
  }

  // 버튼 클릭 시 일반자 토글
  button.addEventListener('click', () => {
    if (!ruler) {
      ruler = create_ruler();
      setup_ruler_events();
      show_ruler();
    } else {
      if (isVisible) {
        hide_ruler();
      } else {
        show_ruler();
      }
    }
  });
}

function initialize_protractor() {
  const wrap = document.getElementById('app_wrap');
  const button = document.querySelector('.btn.protractor'); // 각도기 버튼 셀렉터 확인 필요

  if (!wrap || !button) return;

  let protractor = null;
  let isVisible = false;

  // 각도기 숨기기 함수
  function hide_protractor() {
    wrap.classList.remove('on_measure_angle'); // 필요시 클래스명 변경
    if (protractor) {
      protractor.css('display', 'none');
    }
    button.classList.remove('active');
    button.ariaLabel = '';
    isVisible = false;
  }

  // 각도기 보이기 함수
  function show_protractor() {
    wrap.classList.add('on_measure_angle'); // 필요시 클래스명 변경
    if (protractor) {
      protractor.css('display', 'block');
    }
    button.classList.add('active');
    button.ariaLabel = '활성화됨';
    isVisible = true;
  }

  // 각도기 생성 함수
  function create_protractor() {
    const new_protractor = $('<div/>').addClass('obj_protractor'); // CSS 클래스 확인 필요
    const handle = $('<button/>').addClass('handle');
    new_protractor.append(handle);
    new_protractor.appendTo('#app_wrap');

    const scale = globalScale || 1;
    const wrapRect = wrap.getBoundingClientRect();
    const protractorWidth = 600;  // 각도기 실제 너비 (예시값, 실제 크기로 변경)
    const protractorHeight = 96; // 각도기 실제 높이 (예시값, 실제 크기로 변경)

    // 중앙 위치 계산 (스케일 적용)
    const centerY = ((wrapRect.height - protractorHeight * scale) / 2) / scale;
    const centerX = (wrapRect.width - protractorWidth * scale) / 2 / scale;

    new_protractor.css({
      top: centerY,
      left: centerX
    });

    return new_protractor;
  }

  // 각도기 이벤트 설정 함수
  function setup_protractor_events() {
    let angle = 0;
    let isRotating = false;
    let isMoving = false;
    let currentMoveHandler = null;
    let currentEndHandler = null;

    // 스케일 보정 함수
    function calc_zoom(value, offset = 0) {
      const scale = globalScale || 1;
      return (value / scale) + offset;
    }

    const handle = protractor.find('.handle');

    // 회전 핸들 이벤트
    handle.on('mousedown touchstart', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (isMoving) return;
      isRotating = true;

      const calc_angle_degrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
      let pX = 0, pY = 0, cX = 0, cY = 0, sA = 0, mA = 0, degree = 0;
      const protractorRect = protractor.get(0).getBoundingClientRect();
      const scale = globalScale || 1;

      // 각도기의 중심점 계산 (스케일 적용)
      cX = protractorRect.left + (protractorRect.width / 2); // 스케일된 너비의 절반
      cY = protractorRect.top + (protractorRect.height / 2); // 스케일된 높이의 절반

      // 터치/마우스 좌표 계산
      const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;

      pX = clientX - cX;
      pY = clientY - cY;
      sA = calc_angle_degrees(pX, pY);

      // 이전 핸들러 제거
      if (currentMoveHandler) {
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
      }
      if (currentEndHandler) {
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
      }

      currentMoveHandler = function(e) {
        if (!isRotating) return;
        e.preventDefault();
        e.stopPropagation();

        const moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const currentX = moveX - cX;
        const currentY = moveY - cY;
        mA = calc_angle_degrees(currentX, currentY);
        degree = mA - sA + angle;
        protractor.css({ transform: `rotate(${degree}deg)` });
      };

      currentEndHandler = function(e) {
        if (!isRotating) return;
        e.preventDefault();
        e.stopPropagation();
        isRotating = false;
        angle = degree;
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
        currentMoveHandler = null;
        currentEndHandler = null;
      };

      document.addEventListener('mousemove', currentMoveHandler, { passive: false });
      document.addEventListener('touchmove', currentMoveHandler, { passive: false });
      document.addEventListener('mouseup', currentEndHandler);
      document.addEventListener('touchend', currentEndHandler);
    });

    // 이동 이벤트
    protractor.on('mousedown touchstart', (evt) => {
      if (evt.target.classList.contains('handle')) return; // 핸들 클릭 시 이동 방지
      evt.preventDefault();
      evt.stopPropagation();
      if (isRotating) return;
      isMoving = true;

      const top = protractor.get(0).offsetTop;
      const left = protractor.get(0).offsetLeft;

      // 터치/마우스 좌표 계산
      const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;

      const mX = calc_zoom(clientX, -left);
      const mY = calc_zoom(clientY, -top);

      // 이전 핸들러 제거
      if (currentMoveHandler) {
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
      }
      if (currentEndHandler) {
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
      }

      currentMoveHandler = function(e) {
        if (!isMoving) return;
        e.preventDefault();
        e.stopPropagation();

        const moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        protractor.css({
          top: calc_zoom(moveY, -mY),
          left: calc_zoom(moveX, -mX)
        });
      };

      currentEndHandler = function(e) {
        if (!isMoving) return;
        e.preventDefault();
        e.stopPropagation();
        isMoving = false;
        document.removeEventListener('mousemove', currentMoveHandler);
        document.removeEventListener('touchmove', currentMoveHandler);
        document.removeEventListener('mouseup', currentEndHandler);
        document.removeEventListener('touchend', currentEndHandler);
        currentMoveHandler = null;
        currentEndHandler = null;
      };

      document.addEventListener('mousemove', currentMoveHandler, { passive: false });
      document.addEventListener('touchmove', currentMoveHandler, { passive: false });
      document.addEventListener('mouseup', currentEndHandler);
      document.addEventListener('touchend', currentEndHandler);
    });
  }

  // 버튼 클릭 시 각도기 토글
  button.addEventListener('click', () => {
    if (!protractor) {
      protractor = create_protractor();
      setup_protractor_events();
      show_protractor();
    } else {
      if (isVisible) {
        hide_protractor();
      } else {
        show_protractor();
      }
    }
  });
}

/** ==================================================
 * app.js 로드 후 도구 초기화 실행 (수정됨)
 * ================================================== */
runAfterAppReady(() => {
    // 계산기 초기화는 항상 시도 (내부에서 .cal_icon 확인)
    initializeCalculator();
    initialize_triangle_ruler();
    initialize_ruler();
    initialize_protractor(); // 각도기 초기화 추가
});

function initTools() {
  const tools = document.querySelectorAll('.tool');
  
  tools.forEach(tool => {
    tool.addEventListener('mousedown', handleToolStart);
    tool.addEventListener('touchstart', handleToolStart);
  });

  document.addEventListener('mousemove', handleToolMove);
  document.addEventListener('touchmove', handleToolMove);
  
  document.addEventListener('mouseup', handleToolEnd);
  document.addEventListener('touchend', handleToolEnd);
}

function handleToolStart(e) {
  e.preventDefault();
  const tool = e.target.closest('.tool');
  if (!tool) return;

  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

  const toolType = tool.dataset.tool;
  const toolRect = tool.getBoundingClientRect();
  
  startX = clientX;
  startY = clientY;
  isDragging = true;
  currentTool = toolType;
  
  // 툴 사용 시작 시 효과음 재생
  audioManager.playSound("tool_start");
}

function handleToolMove(e) {
  if (!isDragging) return;
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  const dx = clientX - startX;
  const dy = clientY - startY;
  
  // 드래그 거리 계산
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 5) { // 최소 드래그 거리
    if (!isToolActive) {
      isToolActive = true;
      // 툴 사용 중 효과음 재생
      audioManager.playSound("tool_use");
    }
  }
  
  // 툴 사용 로직...
}

function handleToolEnd(e) {
  if (!isDragging) return;
  
  const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
  const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
  
  isDragging = false;
  isToolActive = false;
  currentTool = null;
  
  // 툴 사용 종료 시 효과음 재생
  audioManager.playSound("tool_end");
}



